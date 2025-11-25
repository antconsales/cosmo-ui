/**
 * QuickSettings Component Schema
 * Toggle panel for system controls - essential for wearable UX
 */

export type QuickSettingsVariant = "default" | "compact" | "grid" | "glass";

export type QuickSettingsLayout = "row" | "grid" | "list";

export type QuickSettingType =
  | "wifi"
  | "bluetooth"
  | "airplane"
  | "dnd"
  | "flashlight"
  | "location"
  | "battery-saver"
  | "dark-mode"
  | "rotation"
  | "hotspot"
  | "nfc"
  | "sync"
  | "mute"
  | "vibrate"
  | "brightness"
  | "volume"
  | "screen-timeout"
  | "custom";

export interface QuickSettingItem {
  /** Unique identifier */
  id: string;
  /** Setting type */
  type: QuickSettingType;
  /** Custom label (for custom type) */
  label?: string;
  /** Current state */
  enabled: boolean;
  /** Secondary info (e.g., wifi network name) */
  subtitle?: string;
  /** Whether setting is available */
  available?: boolean;
  /** Custom icon name */
  icon?: string;
}

export interface QuickSettings {
  /** Unique identifier */
  id: string;
  /** Settings items */
  items: QuickSettingItem[];
  /** Layout style */
  layout?: QuickSettingsLayout;
  /** Visual variant */
  variant?: QuickSettingsVariant;
  /** Number of columns (for grid) */
  columns?: number;
  /** Show labels */
  showLabels?: boolean;
  /** Title */
  title?: string;
  /** Battery level (shown in header) */
  batteryLevel?: number;
  /** Current time (shown in header) */
  currentTime?: string;
}
