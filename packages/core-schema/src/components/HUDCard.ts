/**
 * HUDCard v0.1 - AI-first schema
 * A lightweight, glanceable card for displaying contextual information
 */

export type HUDCardVariant =
  | "neutral"   // default, general info
  | "info"      // informational, blue tint
  | "success"   // positive feedback, green tint
  | "warning"   // attention needed, yellow tint
  | "error";    // critical issue, red tint

export type HUDCardPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type HUDCardPriority = 1 | 2 | 3 | 4 | 5;
// 1 = lowest (dismissible, can be hidden if too many)
// 3 = default
// 5 = critical (always visible, overrides auto-hide)

export type HUDCardIcon =
  | "none"
  | "info"
  | "check"
  | "alert"
  | "error"
  | "bell"
  | "clock"
  | "star";

export interface HUDCardAction {
  id: string;
  label: string; // max 20 chars
  variant: "primary" | "secondary" | "destructive";
}

export type HUDAnchorType = "screen-space" | "world-space";

export type HUDAutoAnchor = "face" | "surface" | "gaze";

export interface HUDCardMetadata {
  // === AR ANCHORING ===

  /**
   * Anchor type
   * - "screen-space": card follows camera (billboard), uses position enum
   * - "world-space": card fixed in 3D space, uses worldPosition
   * @default "screen-space"
   */
  anchorType?: HUDAnchorType;

  /**
   * World-space position [x, y, z] in meters
   * Only used when anchorType = "world-space"
   * @example [0, 1.5, -2] // 2m in front, 1.5m high
   */
  worldPosition?: [number, number, number];

  /**
   * World-space rotation [x, y, z] in radians
   * Only used when anchorType = "world-space"
   * @example [0, 0, 0] // no rotation
   */
  worldRotation?: [number, number, number];

  /**
   * Auto-anchor mode (for world-space cards)
   * - "face": anchor in front of user's face (at spawn time)
   * - "surface": anchor on detected surface (hit-test)
   * - "gaze": anchor where user is looking (raycast from center)
   * @default undefined (use explicit worldPosition)
   */
  autoAnchor?: HUDAutoAnchor;

  /**
   * Distance for auto-anchor modes (in meters)
   * @default 0.5 (50cm)
   */
  autoAnchorDistance?: number;

  /**
   * Z-index for screen-space rendering
   * @deprecated Use priority instead
   */
  zIndex?: number;
}

export interface HUDCard {
  // === REQUIRED ===
  id: string; // unique identifier (AI should generate UUID-like)

  title: string; // max 60 chars

  content: string; // max 200 chars (enforced by validator)

  // === OPTIONAL (with safe defaults) ===
  variant?: HUDCardVariant; // default: "neutral"

  priority?: HUDCardPriority; // default: 3

  position?: HUDCardPosition; // default: "top-right"

  icon?: HUDCardIcon; // default: "none"

  autoHideAfterSeconds?: number | null;
  // default: null (manual dismiss only)
  // if set: 3-30 seconds (enforced by validator)
  // if priority >= 4: autoHide is ignored

  dismissible?: boolean; // default: true
  // if priority >= 4: dismissible forced to false

  actions?: HUDCardAction[];
  // max 2 actions (enforced by validator)
  // default: []

  // === AR / FUTURE ===
  metadata?: HUDCardMetadata;
}
