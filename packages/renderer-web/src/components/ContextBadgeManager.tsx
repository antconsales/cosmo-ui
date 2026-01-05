import React, { createContext, useContext, useState, useCallback } from "react";
import type { ContextBadge as ContextBadgeType } from "@cosmo/core-schema";
import { CONTEXTBADGE_CONSTRAINTS } from "@cosmo/core-schema";
import { ContextBadge } from "./ContextBadge";

/**
 * ContextBadgeManager Context
 * Manages multiple ContextBadges, enforcing system constraints
 */

interface ContextBadgeManagerContextValue {
  badges: Map<string, ContextBadgeType>;
  addBadge: (badge: ContextBadgeType) => boolean;
  removeBadge: (id: string) => void;
  clearAll: () => void;
}

const ContextBadgeManagerContext = createContext<
  ContextBadgeManagerContextValue | undefined
>(undefined);

export interface ContextBadgeManagerProps {
  children: React.ReactNode;
  maxConcurrentBadges?: number;
}

/**
 * ContextBadgeManager Provider
 * Enforces system-level constraints:
 * - Max concurrent badges (default: 8)
 * - FIFO eviction (oldest badge removed first)
 */
export function ContextBadgeManager({
  children,
  maxConcurrentBadges = CONTEXTBADGE_CONSTRAINTS.maxConcurrentBadges,
}: ContextBadgeManagerProps) {
  const [badges, setBadges] = useState<Map<string, ContextBadgeType>>(new Map());

  const addBadge = useCallback(
    (badge: ContextBadgeType): boolean => {
      setBadges((prevBadges) => {
        const newBadges = new Map(prevBadges);

        // If at max capacity, remove oldest badge (FIFO)
        if (newBadges.size >= maxConcurrentBadges) {
          const oldestKey = newBadges.keys().next().value;
          if (oldestKey) {
            newBadges.delete(oldestKey);
          }
        }

        newBadges.set(badge.id, badge);
        return newBadges;
      });

      return true;
    },
    [maxConcurrentBadges]
  );

  const removeBadge = useCallback((id: string) => {
    setBadges((prevBadges) => {
      const newBadges = new Map(prevBadges);
      newBadges.delete(id);
      return newBadges;
    });
  }, []);

  const clearAll = useCallback(() => {
    setBadges(new Map());
  }, []);

  const handleDismiss = useCallback(
    (id: string) => {
      removeBadge(id);
    },
    [removeBadge]
  );

  // Group badges by position for stacking
  const badgesByPosition = new Map<string, ContextBadgeType[]>();
  badges.forEach((badge) => {
    const pos = badge.position || "top-right";
    const list = badgesByPosition.get(pos) || [];
    list.push(badge);
    badgesByPosition.set(pos, list);
  });

  // Flatten with stack index
  const badgesWithStack: Array<{ badge: ContextBadgeType; stackIndex: number }> = [];
  badgesByPosition.forEach((list) => {
    list.forEach((badge, index) => {
      badgesWithStack.push({ badge, stackIndex: index });
    });
  });

  return (
    <ContextBadgeManagerContext.Provider
      value={{ badges, addBadge, removeBadge, clearAll }}
    >
      {children}

      {/* Render all active badges with stack offset */}
      {badgesWithStack.map(({ badge, stackIndex }) => (
        <ContextBadge
          key={badge.id}
          badge={badge}
          onDismiss={handleDismiss}
          stackIndex={stackIndex}
        />
      ))}
    </ContextBadgeManagerContext.Provider>
  );
}

/**
 * Hook to access ContextBadgeManager context
 */
export function useContextBadgeManager(): ContextBadgeManagerContextValue {
  const context = useContext(ContextBadgeManagerContext);
  if (!context) {
    throw new Error(
      "useContextBadgeManager must be used within ContextBadgeManager provider"
    );
  }
  return context;
}
