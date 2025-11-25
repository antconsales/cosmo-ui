/**
 * ProgressRing v0.1 - AI-first schema
 * A circular progress indicator for displaying completion percentage
 * Perfect for loading states, progress tracking, and completion feedback
 */

export type ProgressRingVariant =
  | "neutral"   // default, gray
  | "info"      // informational, blue
  | "success"   // positive/complete, green
  | "warning"   // attention, yellow
  | "error";    // critical/failed, red

export type ProgressRingPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ProgressRingAnchorType = "screen-space" | "world-space";

export type ProgressRingAutoAnchor = "face" | "surface" | "gaze";

export interface ProgressRingMetadata {
  /**
   * Anchor type
   * - "screen-space": ring follows camera (billboard), uses position enum
   * - "world-space": ring fixed in 3D space, uses worldPosition
   * @default "screen-space"
   */
  anchorType?: ProgressRingAnchorType;

  /**
   * World-space position [x, y, z] in meters
   * Only used when anchorType = "world-space"
   * @example [0, 1.5, -1] // 1m in front at chest level
   */
  worldPosition?: [number, number, number];

  /**
   * World-space rotation [x, y, z] in radians
   * Only used when anchorType = "world-space"
   * @example [0, 0, 0] // facing forward
   */
  worldRotation?: [number, number, number];

  /**
   * Auto-anchor mode (for world-space rings)
   * - "face": anchor in front of user's face
   * - "surface": anchor on detected surface (hit-test)
   * - "gaze": anchor where user is looking
   * @default undefined (use explicit worldPosition)
   */
  autoAnchor?: ProgressRingAutoAnchor;

  /**
   * Distance for auto-anchor modes (in meters)
   * @default 0.4 (40cm)
   */
  autoAnchorDistance?: number;
}

export interface ProgressRing {
  // === REQUIRED ===

  /**
   * Unique identifier
   * AI should generate UUID-like or semantic IDs
   */
  id: string;

  /**
   * Progress value (0-100)
   * Clamped to valid range by validator
   * @min 0
   * @max 100
   */
  value: number;

  // === OPTIONAL (with safe defaults) ===

  /**
   * Ring size in pixels (Web) or centimeters (AR)
   * @default 48
   * @min 24
   * @max 200
   */
  size?: number;

  /**
   * Ring stroke thickness in pixels (Web) or millimeters (AR)
   * @default 6
   * @min 2
   * @max 20
   */
  thickness?: number;

  /**
   * Semantic variant (color scheme)
   * @default "neutral"
   */
  variant?: ProgressRingVariant;

  /**
   * Enable smooth animation when value changes
   * @default true
   */
  animated?: boolean;

  /**
   * Show percentage text in center
   * @default false
   */
  showValue?: boolean;

  /**
   * Optional label below the ring
   * @maxLength 30
   */
  label?: string;

  /**
   * Screen position (for screen-space rendering)
   * @default "center"
   */
  position?: ProgressRingPosition;

  /**
   * AR/spatial metadata
   */
  metadata?: ProgressRingMetadata;
}
