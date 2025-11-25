import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { HUDCard } from "@cosmo/core-schema";
import { HUDCARD_CONSTRAINTS } from "@cosmo/core-schema";
import { ARHUDCard } from "./ARHUDCard";

/**
 * ARHUDCardManager - Context provider for AR HUD cards
 *
 * Same API as @cosmo/renderer-web HUDCardManager
 * Manages card lifecycle, priority, and interactions
 */

interface ARHUDCardManagerContextValue {
  cards: Map<string, HUDCard>;
  addCard: (card: HUDCard) => void;
  removeCard: (id: string) => void;
  clearAll: () => void;
}

const ARHUDCardManagerContext = createContext<
  ARHUDCardManagerContextValue | undefined
>(undefined);

export interface ARHUDCardManagerProps {
  children: ReactNode;
  onCardAction?: (cardId: string, actionId: string) => void;
  maxCards?: number;
}

export function ARHUDCardManager({
  children,
  onCardAction,
  maxCards = HUDCARD_CONSTRAINTS.maxConcurrentCards,
}: ARHUDCardManagerProps) {
  const [cards, setCards] = useState<Map<string, HUDCard>>(new Map());

  /**
   * Add a new card
   * Enforces max card limit with priority-based eviction
   */
  const addCard = useCallback(
    (card: HUDCard) => {
      setCards((prev) => {
        const newCards = new Map(prev);

        // If at max capacity, remove lowest priority card
        if (newCards.size >= maxCards) {
          let lowestPriority = Infinity;
          let lowestId = "";

          newCards.forEach((c, id) => {
            const priority = c.priority ?? 3;
            if (priority < lowestPriority) {
              lowestPriority = priority;
              lowestId = id;
            }
          });

          if (lowestId) {
            newCards.delete(lowestId);
          }
        }

        newCards.set(card.id, card);
        return newCards;
      });
    },
    [maxCards]
  );

  /**
   * Remove a card by ID
   */
  const removeCard = useCallback((id: string) => {
    setCards((prev) => {
      const newCards = new Map(prev);
      newCards.delete(id);
      return newCards;
    });
  }, []);

  /**
   * Clear all cards
   */
  const clearAll = useCallback(() => {
    setCards(new Map());
  }, []);

  /**
   * Handle card dismiss
   */
  const handleDismiss = useCallback(
    (id: string) => {
      const card = cards.get(id);
      const priority = card?.priority ?? 3;

      // Only allow dismissing if priority < 4 and dismissible !== false
      if (priority < 4 && card?.dismissible !== false) {
        removeCard(id);
      }
    },
    [cards, removeCard]
  );

  /**
   * Handle card action
   */
  const handleAction = useCallback(
    (cardId: string, actionId: string) => {
      if (onCardAction) {
        onCardAction(cardId, actionId);
      }
    },
    [onCardAction]
  );

  const contextValue = useMemo(
    () => ({
      cards,
      addCard,
      removeCard,
      clearAll,
    }),
    [cards, addCard, removeCard, clearAll]
  );

  // Group cards by position for stacking
  const cardsByPosition = useMemo(() => {
    const groups = new Map<string, HUDCard[]>();

    cards.forEach((card) => {
      const pos = card.position ?? "top-right";
      if (!groups.has(pos)) {
        groups.set(pos, []);
      }
      groups.get(pos)!.push(card);
    });

    // Sort each group by priority (highest first)
    groups.forEach((group) => {
      group.sort((a, b) => (b.priority ?? 3) - (a.priority ?? 3));
    });

    return groups;
  }, [cards]);

  return (
    <ARHUDCardManagerContext.Provider value={contextValue}>
      {children}

      {/* Render all cards as 3D objects */}
      <group name="cosmo-hud-cards">
        {Array.from(cardsByPosition.entries()).map(([_position, posCards]) =>
          posCards.map((card, index) => (
            <ARHUDCard
              key={card.id}
              card={card}
              index={index}
              onDismiss={handleDismiss}
              onAction={handleAction}
            />
          ))
        )}
      </group>
    </ARHUDCardManagerContext.Provider>
  );
}

/**
 * Hook to access ARHUDCardManager context
 * Same API as web renderer's useHUDCardManager
 */
export function useARHUDCardManager(): ARHUDCardManagerContextValue {
  const context = useContext(ARHUDCardManagerContext);

  if (!context) {
    throw new Error(
      "useARHUDCardManager must be used within ARHUDCardManager"
    );
  }

  return context;
}

// Alias for consistency with web renderer
export const useHUDCardManager = useARHUDCardManager;
