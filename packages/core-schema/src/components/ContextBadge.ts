/**
 * ContextBadge v0.1 - AI-first schema
 * A lightweight, glanceable badge for displaying contextual information
 * Smaller and simpler than HUDCard - perfect for quick status updates
 */

export type ContextBadgeVariant =
  | "neutral"   // default, gray
  | "info"      // informational, blue
  | "success"   // positive, green
  | "warning"   // attention, yellow
  | "error";    // critical, red

export type ContextBadgePosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ContextBadgeIcon =
  | "none"
  | "info"
  | "check"
  | "alert"
  | "error"
  | "bell"
  | "clock"
  | "star"
  | "user"
  | "wifi"
  | "battery";

export type ContextBadgeAnchorType = "screen-space" | "world-space";

export type ContextBadgeAutoAnchor = "face" | "surface" | "gaze";

export interface ContextBadgeMetadata {
  /**
   * Anchor type
   * - "screen-space": badge follows camera (billboard), uses position enum
   * - "world-space": badge fixed in 3D space, uses worldPosition
   * @default "screen-space"
   */
  anchorType?: ContextBadgeAnchorType;

  /**
   * World-space position [x, y, z] in meters
   * Only used when anchorType = "world-space"
   * @example [0, 1.6, -1] // 1m in front at eye level
   */
  worldPosition?: [number, number, number];

  /**
   * World-space rotation [x, y, z] in radians
   * Only used when anchorType = "world-space"
   * @example [0, 0, 0] // facing forward
   */
  worldRotation?: [number, number, number];

  /**
   * Auto-anchor mode (for world-space badges)
   * - "face": anchor in front of user's face
   * - "surface": anchor on detected surface (hit-test)
   * - "gaze": anchor where user is looking
   * @default undefined (use explicit worldPosition)
   */
  autoAnchor?: ContextBadgeAutoAnchor;

  /**
   * Distance for auto-anchor modes (in meters)
   * @default 0.3 (30cm - closer than HUDCard)
   */
  autoAnchorDistance?: number;

  /**
   * If true, badge follows a target element/object
   * For web: CSS selector or element ID
   * For AR: object name or anchor ID
   */
  followTarget?: string;
}

export interface ContextBadge {
  // === REQUIRED ===

  /**
   * Unique identifier
   * AI should generate UUID-like or semantic IDs
   */
  id: string;

  /**
   * Badge label text
   * Should be very concise (max 30 chars)
   * @example "Online", "3 new", "Processing..."
   */
  label: string;

  // === OPTIONAL (with safe defaults) ===

  /**
   * Semantic variant (color scheme)
   * @default "neutral"
   */
  variant?: ContextBadgeVariant;

  /**
   * Icon to display before label
   * @default "none"
   */
  icon?: ContextBadgeIcon;

  /**
   * Screen position (for screen-space rendering)
   * @default "top-right"
   */
  position?: ContextBadgePosition;

  /**
   * Custom contextual color (hex)
   * Overrides variant color if provided
   * @example "#8b5cf6" // purple for custom branding
   */
  contextualColor?: string;

  /**
   * Auto-dismiss after milliseconds
   * null = persistent (manual dismiss only)
   * @default null
   * @min 1000 (1 second)
   * @max 30000 (30 seconds)
   */
  autoDismissMs?: number | null;

  /**
   * Whether badge can be dismissed by user
   * @default true
   */
  dismissible?: boolean;

  /**
   * Pulsing animation for attention
   * @default false
   */
  pulse?: boolean;

  /**
   * AR/spatial metadata
   */
  metadata?: ContextBadgeMetadata;
}
