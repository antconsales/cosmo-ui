import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { StatusIndicator, StatusIndicatorState } from "@cosmo/core-schema";
import { STATUSINDICATOR_CONSTRAINTS } from "@cosmo/core-schema";
import { ARStatusIndicator } from "./ARStatusIndicator";

/**
 * ARStatusIndicatorManager - Context provider for AR Status Indicators
 *
 * Same API as @cosmo/renderer-web StatusIndicatorManager
 * Manages indicator lifecycle and state updates in AR
 */

interface ARStatusIndicatorManagerContextValue {
  indicators: Map<string, StatusIndicator>;
  addIndicator: (indicator: StatusIndicator) => void;
  updateIndicator: (id: string, updates: Partial<StatusIndicator>) => void;
  setIndicatorState: (id: string, state: StatusIndicatorState) => void;
  removeIndicator: (id: string) => void;
  clearAll: () => void;
}

const ARStatusIndicatorManagerContext = createContext<
  ARStatusIndicatorManagerContextValue | undefined
>(undefined);

export interface ARStatusIndicatorManagerProps {
  children: ReactNode;
  maxIndicators?: number;
}

export function ARStatusIndicatorManager({
  children,
  maxIndicators = STATUSINDICATOR_CONSTRAINTS.maxConcurrentIndicators,
}: ARStatusIndicatorManagerProps) {
  const [indicators, setIndicators] = useState<Map<string, StatusIndicator>>(new Map());

  /**
   * Add a new indicator
   * Uses FIFO eviction when at max capacity
   */
  const addIndicator = useCallback(
    (indicator: StatusIndicator) => {
      setIndicators((prev) => {
        const newIndicators = new Map(prev);

        // FIFO eviction
        if (newIndicators.size >= maxIndicators) {
          const oldestKey = newIndicators.keys().next().value;
          if (oldestKey) {
            newIndicators.delete(oldestKey);
          }
        }

        newIndicators.set(indicator.id, indicator);
        return newIndicators;
      });
    },
    [maxIndicators]
  );

  /**
   * Update an indicator's properties
   */
  const updateIndicator = useCallback((id: string, updates: Partial<StatusIndicator>) => {
    setIndicators((prev) => {
      const existing = prev.get(id);
      if (!existing) return prev;

      const newIndicators = new Map(prev);
      newIndicators.set(id, { ...existing, ...updates });
      return newIndicators;
    });
  }, []);

  /**
   * Convenience method to update just the state
   */
  const setIndicatorState = useCallback((id: string, state: StatusIndicatorState) => {
    updateIndicator(id, { state });
  }, [updateIndicator]);

  /**
   * Remove an indicator by ID
   */
  const removeIndicator = useCallback((id: string) => {
    setIndicators((prev) => {
      const newIndicators = new Map(prev);
      newIndicators.delete(id);
      return newIndicators;
    });
  }, []);

  /**
   * Clear all indicators
   */
  const clearAll = useCallback(() => {
    setIndicators(new Map());
  }, []);

  /**
   * Handle indicator dismiss
   */
  const handleDismiss = useCallback(
    (id: string) => {
      removeIndicator(id);
    },
    [removeIndicator]
  );

  const contextValue = useMemo(
    () => ({
      indicators,
      addIndicator,
      updateIndicator,
      setIndicatorState,
      removeIndicator,
      clearAll,
    }),
    [indicators, addIndicator, updateIndicator, setIndicatorState, removeIndicator, clearAll]
  );

  // Group indicators by position for stacking
  const indicatorsByPosition = useMemo(() => {
    const groups = new Map<string, StatusIndicator[]>();

    indicators.forEach((indicator) => {
      const pos = indicator.position ?? "top-right";
      if (!groups.has(pos)) {
        groups.set(pos, []);
      }
      groups.get(pos)!.push(indicator);
    });

    return groups;
  }, [indicators]);

  return (
    <ARStatusIndicatorManagerContext.Provider value={contextValue}>
      {children}

      {/* Render all indicators as 3D objects */}
      <group name="cosmo-status-indicators">
        {Array.from(indicatorsByPosition.entries()).map(([_position, posIndicators]) =>
          posIndicators.map((indicator, index) => (
            <ARStatusIndicator
              key={indicator.id}
              indicator={indicator}
              index={index}
              onDismiss={handleDismiss}
            />
          ))
        )}
      </group>
    </ARStatusIndicatorManagerContext.Provider>
  );
}

/**
 * Hook to access ARStatusIndicatorManager context
 */
export function useARStatusIndicatorManager(): ARStatusIndicatorManagerContextValue {
  const context = useContext(ARStatusIndicatorManagerContext);

  if (!context) {
    throw new Error(
      "useARStatusIndicatorManager must be used within ARStatusIndicatorManager"
    );
  }

  return context;
}

// Alias for consistency
export const useStatusIndicatorManager = useARStatusIndicatorManager;
