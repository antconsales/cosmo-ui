/**
 * ActionBar Component Schema
 * Bottom action bar with quick-access buttons
 * Optimized for AR interaction (large touch targets, clear icons)
 */

export type ActionBarPosition = "bottom" | "top" | "left" | "right";

export type ActionBarVariant = "solid" | "glass" | "minimal";

export type ActionBarIcon =
  | "none"
  | "home"
  | "back"
  | "forward"
  | "menu"
  | "close"
  | "settings"
  | "search"
  | "share"
  | "favorite"
  | "add"
  | "remove"
  | "edit"
  | "delete"
  | "refresh"
  | "camera"
  | "mic"
  | "speaker";

export interface ActionBarItem {
  /** Unique identifier for this action */
  id: string;
  /** Icon to display */
  icon: ActionBarIcon;
  /** Accessible label */
  label: string;
  /** Whether the action is disabled */
  disabled?: boolean;
  /** Whether this item is currently active/selected */
  active?: boolean;
  /** Badge count to show (e.g., notifications) */
  badge?: number;
}

export type ActionBarAnchorType = "screen-space" | "world-space";

export type ActionBarAutoAnchor = "face" | "surface" | "gaze";

export interface ActionBarMetadata {
  /** AR anchoring mode */
  anchorType?: ActionBarAnchorType;
  /** World position for world-space anchoring [x, y, z] */
  worldPosition?: [number, number, number];
  /** World rotation in radians [x, y, z] */
  worldRotation?: [number, number, number];
  /** Auto-anchor to detected surfaces/faces */
  autoAnchor?: ActionBarAutoAnchor;
  /** Distance for auto-anchor (meters) */
  autoAnchorDistance?: number;
  /** Whether bar follows user gaze */
  followGaze?: boolean;
}

export interface ActionBar {
  /** Unique identifier */
  id: string;
  /** Action items in the bar */
  items: ActionBarItem[];
  /** Position on screen */
  position: ActionBarPosition;
  /** Visual style variant */
  variant: ActionBarVariant;
  /** Whether to show labels under icons */
  showLabels?: boolean;
  /** Whether the bar is visible */
  visible?: boolean;
  /** AR-specific metadata */
  metadata?: ActionBarMetadata;
}
