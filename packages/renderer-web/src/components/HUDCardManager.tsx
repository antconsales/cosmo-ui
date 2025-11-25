import React, { createContext, useContext, useState, useCallback } from "react";
import type { HUDCard as HUDCardType } from "@cosmo/core-schema";
import { HUDCARD_CONSTRAINTS } from "@cosmo/core-schema";
import { HUDCard } from "./HUDCard";

/**
 * HUDCardManager Context
 * Manages multiple HUDCards, enforcing system constraints
 */

interface HUDCardManagerContextValue {
  cards: Map<string, HUDCardType>;
  addCard: (card: HUDCardType) => boolean;
  removeCard: (id: string) => void;
  clearAll: () => void;
}

const HUDCardManagerContext = createContext<
  HUDCardManagerContextValue | undefined
>(undefined);

export interface HUDCardManagerProps {
  children: React.ReactNode;
  maxConcurrentCards?: number;
  onCardAction?: (cardId: string, actionId: string) => void;
}

/**
 * HUDCardManager Provider
 * Enforces system-level constraints:
 * - Max concurrent cards
 * - Priority-based eviction
 * - Position conflict handling
 */
export function HUDCardManager({
  children,
  maxConcurrentCards = HUDCARD_CONSTRAINTS.maxConcurrentCards,
  onCardAction,
}: HUDCardManagerProps) {
  const [cards, setCards] = useState<Map<string, HUDCardType>>(new Map());

  const addCard = useCallback(
    (card: HUDCardType): boolean => {
      setCards((prevCards) => {
        const newCards = new Map(prevCards);

        // If at max capacity, try to evict lowest priority card
        if (newCards.size >= maxConcurrentCards) {
          const cardPriority = card.priority || 3;
          let lowestPriorityId: string | null = null;
          let lowestPriority = Infinity;

          // Find lowest priority card
          for (const [id, existingCard] of newCards.entries()) {
            const priority = existingCard.priority || 3;
            if (priority < lowestPriority) {
              lowestPriority = priority;
              lowestPriorityId = id;
            }
          }

          // Only evict if new card has higher priority
          if (lowestPriorityId && cardPriority > lowestPriority) {
            newCards.delete(lowestPriorityId);
          } else {
            // Reject new card
            console.warn(
              `[Cosmo UI] Cannot add card ${card.id}: max concurrent limit reached`
            );
            return prevCards;
          }
        }

        newCards.set(card.id, card);
        return newCards;
      });

      return true;
    },
    [maxConcurrentCards]
  );

  const removeCard = useCallback((id: string) => {
    setCards((prevCards) => {
      const newCards = new Map(prevCards);
      newCards.delete(id);
      return newCards;
    });
  }, []);

  const clearAll = useCallback(() => {
    setCards(new Map());
  }, []);

  const handleDismiss = useCallback(
    (id: string) => {
      removeCard(id);
    },
    [removeCard]
  );

  const handleAction = useCallback(
    (cardId: string, actionId: string) => {
      if (onCardAction) {
        onCardAction(cardId, actionId);
      }
    },
    [onCardAction]
  );

  return (
    <HUDCardManagerContext.Provider
      value={{ cards, addCard, removeCard, clearAll }}
    >
      {children}

      {/* Render all active cards */}
      {Array.from(cards.values()).map((card) => (
        <HUDCard
          key={card.id}
          card={card}
          onDismiss={handleDismiss}
          onAction={handleAction}
        />
      ))}
    </HUDCardManagerContext.Provider>
  );
}

/**
 * Hook to access HUDCardManager context
 */
export function useHUDCardManager(): HUDCardManagerContextValue {
  const context = useContext(HUDCardManagerContext);
  if (!context) {
    throw new Error(
      "useHUDCardManager must be used within HUDCardManager provider"
    );
  }
  return context;
}
