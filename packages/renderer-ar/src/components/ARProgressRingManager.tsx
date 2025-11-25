import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { ProgressRing } from "@cosmo/core-schema";
import { PROGRESSRING_CONSTRAINTS } from "@cosmo/core-schema";
import { ARProgressRing } from "./ARProgressRing";

/**
 * ARProgressRingManager - Context provider for AR Progress Rings
 *
 * Same API as @cosmo/renderer-web ProgressRingManager
 * Manages ring lifecycle and interactions in AR
 */

interface ARProgressRingManagerContextValue {
  rings: Map<string, ProgressRing>;
  addRing: (ring: ProgressRing) => void;
  updateRing: (id: string, value: number) => void;
  removeRing: (id: string) => void;
  clearAll: () => void;
}

const ARProgressRingManagerContext = createContext<
  ARProgressRingManagerContextValue | undefined
>(undefined);

export interface ARProgressRingManagerProps {
  children: ReactNode;
  maxRings?: number;
}

export function ARProgressRingManager({
  children,
  maxRings = PROGRESSRING_CONSTRAINTS.maxConcurrentRings,
}: ARProgressRingManagerProps) {
  const [rings, setRings] = useState<Map<string, ProgressRing>>(new Map());

  /**
   * Add a new ring
   * Uses FIFO eviction when at max capacity
   */
  const addRing = useCallback(
    (ring: ProgressRing) => {
      setRings((prev) => {
        const newRings = new Map(prev);

        // FIFO eviction
        if (newRings.size >= maxRings) {
          const oldestKey = newRings.keys().next().value;
          if (oldestKey) {
            newRings.delete(oldestKey);
          }
        }

        newRings.set(ring.id, ring);
        return newRings;
      });
    },
    [maxRings]
  );

  /**
   * Update a ring's value
   */
  const updateRing = useCallback((id: string, value: number) => {
    setRings((prev) => {
      const existing = prev.get(id);
      if (!existing) return prev;

      const newRings = new Map(prev);
      newRings.set(id, { ...existing, value });
      return newRings;
    });
  }, []);

  /**
   * Remove a ring by ID
   */
  const removeRing = useCallback((id: string) => {
    setRings((prev) => {
      const newRings = new Map(prev);
      newRings.delete(id);
      return newRings;
    });
  }, []);

  /**
   * Clear all rings
   */
  const clearAll = useCallback(() => {
    setRings(new Map());
  }, []);

  /**
   * Handle ring dismiss
   */
  const handleDismiss = useCallback(
    (id: string) => {
      removeRing(id);
    },
    [removeRing]
  );

  const contextValue = useMemo(
    () => ({
      rings,
      addRing,
      updateRing,
      removeRing,
      clearAll,
    }),
    [rings, addRing, updateRing, removeRing, clearAll]
  );

  // Group rings by position for stacking
  const ringsByPosition = useMemo(() => {
    const groups = new Map<string, ProgressRing[]>();

    rings.forEach((ring) => {
      const pos = ring.position ?? "center";
      if (!groups.has(pos)) {
        groups.set(pos, []);
      }
      groups.get(pos)!.push(ring);
    });

    return groups;
  }, [rings]);

  return (
    <ARProgressRingManagerContext.Provider value={contextValue}>
      {children}

      {/* Render all rings as 3D objects */}
      <group name="cosmo-progress-rings">
        {Array.from(ringsByPosition.entries()).map(([_position, posRings]) =>
          posRings.map((ring, index) => (
            <ARProgressRing
              key={ring.id}
              ring={ring}
              index={index}
              onDismiss={handleDismiss}
            />
          ))
        )}
      </group>
    </ARProgressRingManagerContext.Provider>
  );
}

/**
 * Hook to access ARProgressRingManager context
 */
export function useARProgressRingManager(): ARProgressRingManagerContextValue {
  const context = useContext(ARProgressRingManagerContext);

  if (!context) {
    throw new Error(
      "useARProgressRingManager must be used within ARProgressRingManager"
    );
  }

  return context;
}

// Alias for consistency
export const useProgressRingManager = useARProgressRingManager;
