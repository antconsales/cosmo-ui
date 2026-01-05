import React, { createContext, useContext, useState, useCallback } from "react";
import type { StatusIndicator as StatusIndicatorType } from "@cosmo/core-schema";
import { STATUSINDICATOR_CONSTRAINTS } from "@cosmo/core-schema";
import { StatusIndicator } from "./StatusIndicator";

/**
 * StatusIndicatorManager Context
 * Manages multiple StatusIndicators, enforcing system constraints
 */

interface StatusIndicatorManagerContextValue {
  indicators: Map<string, StatusIndicatorType>;
  addIndicator: (indicator: StatusIndicatorType) => boolean;
  updateIndicator: (id: string, updates: Partial<StatusIndicatorType>) => void;
  removeIndicator: (id: string) => void;
  clearAll: () => void;
}

const StatusIndicatorManagerContext = createContext<
  StatusIndicatorManagerContextValue | undefined
>(undefined);

export interface StatusIndicatorManagerProps {
  children: React.ReactNode;
  maxConcurrentIndicators?: number;
}

/**
 * StatusIndicatorManager Provider
 * Enforces system-level constraints:
 * - Max concurrent indicators (default: 10)
 * - FIFO eviction (oldest indicator removed first)
 * - State update support for dynamic status changes
 */
export function StatusIndicatorManager({
  children,
  maxConcurrentIndicators = STATUSINDICATOR_CONSTRAINTS.maxConcurrentIndicators,
}: StatusIndicatorManagerProps) {
  const [indicators, setIndicators] = useState<Map<string, StatusIndicatorType>>(new Map());

  const addIndicator = useCallback(
    (indicator: StatusIndicatorType): boolean => {
      setIndicators((prevIndicators) => {
        const newIndicators = new Map(prevIndicators);

        // If at max capacity, remove oldest indicator (FIFO)
        if (newIndicators.size >= maxConcurrentIndicators) {
          const oldestKey = newIndicators.keys().next().value;
          if (oldestKey) {
            newIndicators.delete(oldestKey);
          }
        }

        newIndicators.set(indicator.id, indicator);
        return newIndicators;
      });

      return true;
    },
    [maxConcurrentIndicators]
  );

  const updateIndicator = useCallback(
    (id: string, updates: Partial<StatusIndicatorType>) => {
      setIndicators((prevIndicators) => {
        const existing = prevIndicators.get(id);
        if (!existing) return prevIndicators;

        const newIndicators = new Map(prevIndicators);
        newIndicators.set(id, { ...existing, ...updates });
        return newIndicators;
      });
    },
    []
  );

  const removeIndicator = useCallback((id: string) => {
    setIndicators((prevIndicators) => {
      const newIndicators = new Map(prevIndicators);
      newIndicators.delete(id);
      return newIndicators;
    });
  }, []);

  const clearAll = useCallback(() => {
    setIndicators(new Map());
  }, []);

  const handleDismiss = useCallback(
    (id: string) => {
      removeIndicator(id);
    },
    [removeIndicator]
  );

  // Group indicators by position for stacking
  const indicatorsByPosition = new Map<string, StatusIndicatorType[]>();
  indicators.forEach((indicator) => {
    const pos = indicator.position || "top-right";
    const list = indicatorsByPosition.get(pos) || [];
    list.push(indicator);
    indicatorsByPosition.set(pos, list);
  });

  // Flatten with stack index
  const indicatorsWithStack: Array<{ indicator: StatusIndicatorType; stackIndex: number }> = [];
  indicatorsByPosition.forEach((list) => {
    list.forEach((indicator, index) => {
      indicatorsWithStack.push({ indicator, stackIndex: index });
    });
  });

  return (
    <StatusIndicatorManagerContext.Provider
      value={{ indicators, addIndicator, updateIndicator, removeIndicator, clearAll }}
    >
      {children}

      {/* Render all active indicators with stack offset */}
      {indicatorsWithStack.map(({ indicator, stackIndex }) => (
        <StatusIndicator
          key={indicator.id}
          indicator={indicator}
          onDismiss={handleDismiss}
          stackIndex={stackIndex}
        />
      ))}
    </StatusIndicatorManagerContext.Provider>
  );
}

/**
 * Hook to access StatusIndicatorManager context
 */
export function useStatusIndicatorManager(): StatusIndicatorManagerContextValue {
  const context = useContext(StatusIndicatorManagerContext);
  if (!context) {
    throw new Error(
      "useStatusIndicatorManager must be used within StatusIndicatorManager provider"
    );
  }
  return context;
}
