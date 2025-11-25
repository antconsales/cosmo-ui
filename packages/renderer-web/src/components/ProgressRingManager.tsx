import React, { createContext, useContext, useState, useCallback } from "react";
import type { ProgressRing as ProgressRingType } from "@cosmo/core-schema";
import { PROGRESSRING_CONSTRAINTS } from "@cosmo/core-schema";
import { ProgressRing } from "./ProgressRing";

/**
 * ProgressRingManager Context
 * Manages multiple ProgressRings, enforcing system constraints
 */

interface ProgressRingManagerContextValue {
  rings: Map<string, ProgressRingType>;
  addRing: (ring: ProgressRingType) => boolean;
  updateRing: (id: string, value: number) => void;
  removeRing: (id: string) => void;
  clearAll: () => void;
}

const ProgressRingManagerContext = createContext<
  ProgressRingManagerContextValue | undefined
>(undefined);

export interface ProgressRingManagerProps {
  children: React.ReactNode;
  maxConcurrentRings?: number;
}

/**
 * ProgressRingManager Provider
 * Enforces system-level constraints:
 * - Max concurrent rings (default: 6)
 * - FIFO eviction (oldest ring removed first)
 */
export function ProgressRingManager({
  children,
  maxConcurrentRings = PROGRESSRING_CONSTRAINTS.maxConcurrentRings,
}: ProgressRingManagerProps) {
  const [rings, setRings] = useState<Map<string, ProgressRingType>>(new Map());

  const addRing = useCallback(
    (ring: ProgressRingType): boolean => {
      setRings((prevRings) => {
        const newRings = new Map(prevRings);

        // If at max capacity, remove oldest ring (FIFO)
        if (newRings.size >= maxConcurrentRings) {
          const oldestKey = newRings.keys().next().value;
          if (oldestKey) {
            newRings.delete(oldestKey);
          }
        }

        newRings.set(ring.id, ring);
        return newRings;
      });

      return true;
    },
    [maxConcurrentRings]
  );

  const updateRing = useCallback((id: string, value: number) => {
    setRings((prevRings) => {
      const existing = prevRings.get(id);
      if (!existing) return prevRings;

      const newRings = new Map(prevRings);
      newRings.set(id, { ...existing, value });
      return newRings;
    });
  }, []);

  const removeRing = useCallback((id: string) => {
    setRings((prevRings) => {
      const newRings = new Map(prevRings);
      newRings.delete(id);
      return newRings;
    });
  }, []);

  const clearAll = useCallback(() => {
    setRings(new Map());
  }, []);

  const handleDismiss = useCallback(
    (id: string) => {
      removeRing(id);
    },
    [removeRing]
  );

  return (
    <ProgressRingManagerContext.Provider
      value={{ rings, addRing, updateRing, removeRing, clearAll }}
    >
      {children}

      {/* Render all active rings */}
      {Array.from(rings.values()).map((ring) => (
        <ProgressRing
          key={ring.id}
          ring={ring}
          onDismiss={handleDismiss}
        />
      ))}
    </ProgressRingManagerContext.Provider>
  );
}

/**
 * Hook to access ProgressRingManager context
 */
export function useProgressRingManager(): ProgressRingManagerContextValue {
  const context = useContext(ProgressRingManagerContext);
  if (!context) {
    throw new Error(
      "useProgressRingManager must be used within ProgressRingManager provider"
    );
  }
  return context;
}
