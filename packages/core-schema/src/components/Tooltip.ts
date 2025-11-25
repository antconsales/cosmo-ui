/**
 * Tooltip Component Schema
 * Info tooltip for hover/gaze/tap interactions
 * Designed for both web and AR contexts
 */

export type TooltipPosition =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type TooltipTrigger = "hover" | "click" | "focus" | "manual";

export type TooltipVariant = "dark" | "light" | "info" | "warning" | "error";

export type TooltipAnchorType = "screen-space" | "world-space";

export type TooltipAutoAnchor = "face" | "surface" | "gaze";

export interface TooltipMetadata {
  /** AR anchoring mode */
  anchorType?: TooltipAnchorType;
  /** World position for world-space anchoring [x, y, z] */
  worldPosition?: [number, number, number];
  /** World rotation in radians [x, y, z] */
  worldRotation?: [number, number, number];
  /** Auto-anchor to detected surfaces/faces */
  autoAnchor?: TooltipAutoAnchor;
  /** Distance for auto-anchor (meters) */
  autoAnchorDistance?: number;
}

export interface Tooltip {
  /** Unique identifier */
  id: string;
  /** Text content to display */
  content: string;
  /** Position relative to target */
  position: TooltipPosition;
  /** How tooltip is triggered */
  trigger: TooltipTrigger;
  /** Visual style */
  variant: TooltipVariant;
  /** Whether to show arrow pointing to target */
  showArrow?: boolean;
  /** Delay before showing (ms) */
  delayShow?: number;
  /** Delay before hiding (ms) */
  delayHide?: number;
  /** Maximum width in pixels */
  maxWidth?: number;
  /** Whether tooltip is currently visible (for manual trigger) */
  visible?: boolean;
  /** Target element selector (for web) */
  targetSelector?: string;
  /** AR-specific metadata */
  metadata?: TooltipMetadata;
}
