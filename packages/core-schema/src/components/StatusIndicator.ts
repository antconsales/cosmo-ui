/**
 * StatusIndicator Component Schema
 *
 * Minimal dot/icon indicator for showing system or connection status.
 * Smallest and most lightweight UI element in the Cosmo UI system.
 *
 * Use cases:
 * - Online/offline status
 * - Connection quality indicators
 * - Recording/streaming status
 * - System health indicators
 * - Microphone/camera state
 */

/**
 * Status states - semantic meanings
 */
export type StatusIndicatorState =
  | "idle"      // Gray - inactive, standby
  | "active"    // Blue - working, connected
  | "loading"   // Blue pulsing - processing, connecting
  | "success"   // Green - completed, healthy
  | "warning"   // Yellow - attention needed
  | "error";    // Red - failed, disconnected

/**
 * Position on screen (9-grid + center)
 */
export type StatusIndicatorPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

/**
 * AR anchor type
 */
export type StatusIndicatorAnchorType = "screen-space" | "world-space";

/**
 * Auto-anchor modes for AR
 */
export type StatusIndicatorAutoAnchor = "face" | "surface" | "gaze";

/**
 * AR-specific metadata
 */
export interface StatusIndicatorMetadata {
  /** Anchoring mode */
  anchorType?: StatusIndicatorAnchorType;

  /** World position [x, y, z] in meters */
  worldPosition?: [number, number, number];

  /** World rotation [x, y, z] in radians */
  worldRotation?: [number, number, number];

  /** Auto-anchor to face, surface, or gaze direction */
  autoAnchor?: StatusIndicatorAutoAnchor;

  /** Distance for auto-anchor (meters) */
  autoAnchorDistance?: number;
}

/**
 * StatusIndicator - Minimal status dot
 */
export interface StatusIndicator {
  /** Unique identifier (required) */
  id: string;

  /** Current state (required) */
  state: StatusIndicatorState;

  /** Optional label (max 20 chars) */
  label?: string;

  /** Size in pixels (8-32, default 12) */
  size?: number;

  /** Enable pulse animation for active/loading states */
  pulse?: boolean;

  /** Show glow effect */
  glow?: boolean;

  /** Screen position */
  position?: StatusIndicatorPosition;

  /** AR metadata */
  metadata?: StatusIndicatorMetadata;
}
