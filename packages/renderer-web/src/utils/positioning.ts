import type { HUDCardPosition } from "@cosmo/core-schema";

/**
 * Positioning utility for HUD cards
 * Maps schema position enum to CSS properties
 */

export interface PositionStyle {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

const CARD_MARGIN = "16px"; // Safe margin from edges

/**
 * Converts HUDCardPosition to CSS positioning
 * Non-invasive: cards are always near edges, never center-blocking
 */
export function getPositionStyle(
  position: HUDCardPosition = "top-right"
): PositionStyle {
  switch (position) {
    case "top-left":
      return { top: CARD_MARGIN, left: CARD_MARGIN };

    case "top-center":
      return {
        top: CARD_MARGIN,
        left: "50%",
        // Note: requires transform: translateX(-50%) on element
      };

    case "top-right":
      return { top: CARD_MARGIN, right: CARD_MARGIN };

    case "center-left":
      return {
        top: "50%",
        left: CARD_MARGIN,
        // Note: requires transform: translateY(-50%) on element
      };

    case "center-right":
      return {
        top: "50%",
        right: CARD_MARGIN,
        // Note: requires transform: translateY(-50%) on element
      };

    case "bottom-left":
      return { bottom: CARD_MARGIN, left: CARD_MARGIN };

    case "bottom-center":
      return {
        bottom: CARD_MARGIN,
        left: "50%",
        // Note: requires transform: translateX(-50%) on element
      };

    case "bottom-right":
      return { bottom: CARD_MARGIN, right: CARD_MARGIN };

    default:
      // Safe default: top-right
      return { top: CARD_MARGIN, right: CARD_MARGIN };
  }
}

/**
 * Gets transform CSS for centered positions
 */
export function getPositionTransform(position: HUDCardPosition): string {
  switch (position) {
    case "top-center":
    case "bottom-center":
      return "translateX(-50%)";

    case "center-left":
    case "center-right":
      return "translateY(-50%)";

    default:
      return "none";
  }
}

/**
 * Calculates z-index based on priority
 * Base z-index: 1000
 * Range: 1000 (priority 1) to 1004 (priority 5)
 */
export function getZIndex(priority: number = 3): number {
  return 1000 + Math.max(0, Math.min(4, priority - 1));
}
