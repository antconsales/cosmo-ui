import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { ContextBadge } from "@cosmo/core-schema";
import { CONTEXTBADGE_CONSTRAINTS } from "@cosmo/core-schema";
import { ARContextBadge } from "./ARContextBadge";

/**
 * ARContextBadgeManager - Context provider for AR Context Badges
 *
 * Same API as @cosmo/renderer-web ContextBadgeManager
 * Manages badge lifecycle and interactions in AR
 */

interface ARContextBadgeManagerContextValue {
  badges: Map<string, ContextBadge>;
  addBadge: (badge: ContextBadge) => void;
  removeBadge: (id: string) => void;
  clearAll: () => void;
}

const ARContextBadgeManagerContext = createContext<
  ARContextBadgeManagerContextValue | undefined
>(undefined);

export interface ARContextBadgeManagerProps {
  children: ReactNode;
  maxBadges?: number;
}

export function ARContextBadgeManager({
  children,
  maxBadges = CONTEXTBADGE_CONSTRAINTS.maxConcurrentBadges,
}: ARContextBadgeManagerProps) {
  const [badges, setBadges] = useState<Map<string, ContextBadge>>(new Map());

  /**
   * Add a new badge
   * Uses FIFO eviction when at max capacity
   */
  const addBadge = useCallback(
    (badge: ContextBadge) => {
      setBadges((prev) => {
        const newBadges = new Map(prev);

        // FIFO eviction
        if (newBadges.size >= maxBadges) {
          const oldestKey = newBadges.keys().next().value;
          if (oldestKey) {
            newBadges.delete(oldestKey);
          }
        }

        newBadges.set(badge.id, badge);
        return newBadges;
      });
    },
    [maxBadges]
  );

  /**
   * Remove a badge by ID
   */
  const removeBadge = useCallback((id: string) => {
    setBadges((prev) => {
      const newBadges = new Map(prev);
      newBadges.delete(id);
      return newBadges;
    });
  }, []);

  /**
   * Clear all badges
   */
  const clearAll = useCallback(() => {
    setBadges(new Map());
  }, []);

  /**
   * Handle badge dismiss
   */
  const handleDismiss = useCallback(
    (id: string) => {
      const badge = badges.get(id);
      if (badge?.dismissible !== false) {
        removeBadge(id);
      }
    },
    [badges, removeBadge]
  );

  const contextValue = useMemo(
    () => ({
      badges,
      addBadge,
      removeBadge,
      clearAll,
    }),
    [badges, addBadge, removeBadge, clearAll]
  );

  // Group badges by position for stacking
  const badgesByPosition = useMemo(() => {
    const groups = new Map<string, ContextBadge[]>();

    badges.forEach((badge) => {
      const pos = badge.position ?? "top-right";
      if (!groups.has(pos)) {
        groups.set(pos, []);
      }
      groups.get(pos)!.push(badge);
    });

    return groups;
  }, [badges]);

  return (
    <ARContextBadgeManagerContext.Provider value={contextValue}>
      {children}

      {/* Render all badges as 3D objects */}
      <group name="cosmo-context-badges">
        {Array.from(badgesByPosition.entries()).map(([_position, posBadges]) =>
          posBadges.map((badge, index) => (
            <ARContextBadge
              key={badge.id}
              badge={badge}
              index={index}
              onDismiss={handleDismiss}
            />
          ))
        )}
      </group>
    </ARContextBadgeManagerContext.Provider>
  );
}

/**
 * Hook to access ARContextBadgeManager context
 */
export function useARContextBadgeManager(): ARContextBadgeManagerContextValue {
  const context = useContext(ARContextBadgeManagerContext);

  if (!context) {
    throw new Error(
      "useARContextBadgeManager must be used within ARContextBadgeManager"
    );
  }

  return context;
}

// Alias for consistency
export const useContextBadgeManager = useARContextBadgeManager;
