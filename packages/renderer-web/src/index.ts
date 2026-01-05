/**
 * @cosmo/renderer-web
 * React renderer for Cosmo UI components (Web)
 *
 * v1.0 - 16 Components for Wearable-Ready UI
 */

// ============================================
// CORE COMPONENTS (Original 6)
// ============================================

// HUDCard
export { HUDCard } from "./components/HUDCard";
export type { HUDCardProps } from "./components/HUDCard";

export {
  HUDCardManager,
  useHUDCardManager,
} from "./components/HUDCardManager";
export type { HUDCardManagerProps } from "./components/HUDCardManager";

// ContextBadge
export { ContextBadge } from "./components/ContextBadge";
export type { ContextBadgeProps } from "./components/ContextBadge";

export {
  ContextBadgeManager,
  useContextBadgeManager,
} from "./components/ContextBadgeManager";
export type { ContextBadgeManagerProps } from "./components/ContextBadgeManager";

// ProgressRing
export { ProgressRing } from "./components/ProgressRing";
export type { ProgressRingProps } from "./components/ProgressRing";

export {
  ProgressRingManager,
  useProgressRingManager,
} from "./components/ProgressRingManager";
export type { ProgressRingManagerProps } from "./components/ProgressRingManager";

// StatusIndicator
export { StatusIndicator } from "./components/StatusIndicator";
export type { StatusIndicatorProps } from "./components/StatusIndicator";

export {
  StatusIndicatorManager,
  useStatusIndicatorManager,
} from "./components/StatusIndicatorManager";
export type { StatusIndicatorManagerProps } from "./components/StatusIndicatorManager";

// ActionBar
export { ActionBar } from "./components/ActionBar";
export type { ActionBarProps } from "./components/ActionBar";

// Tooltip
export { Tooltip } from "./components/Tooltip";
export type { TooltipProps } from "./components/Tooltip";

// ============================================
// MEDIA COMPONENTS (New)
// ============================================

// MediaCard
export { MediaCard } from "./components/MediaCard";
export type { MediaCardProps } from "./components/MediaCard";

// MiniPlayer
export { MiniPlayer } from "./components/MiniPlayer";
export type { MiniPlayerProps } from "./components/MiniPlayer";

// Timer
export { Timer } from "./components/Timer";
export type { TimerProps } from "./components/Timer";

// ============================================
// COMMUNICATION COMPONENTS (New)
// ============================================

// MessagePreview
export { MessagePreview } from "./components/MessagePreview";
export type { MessagePreviewProps } from "./components/MessagePreview";

// ContactCard
export { ContactCard } from "./components/ContactCard";
export type { ContactCardProps } from "./components/ContactCard";

// ============================================
// PRODUCTIVITY COMPONENTS (New)
// ============================================

// EventCard
export { EventCard } from "./components/EventCard";
export type { EventCardProps } from "./components/EventCard";

// WeatherWidget
export { WeatherWidget } from "./components/WeatherWidget";
export type { WeatherWidgetProps } from "./components/WeatherWidget";

// ============================================
// SYSTEM COMPONENTS (New)
// ============================================

// QuickSettings
export { QuickSettings } from "./components/QuickSettings";
export type { QuickSettingsProps } from "./components/QuickSettings";

// ActivityRing
export { ActivityRing } from "./components/ActivityRing";
export type { ActivityRingProps } from "./components/ActivityRing";

// ============================================
// NAVIGATION COMPONENTS (New)
// ============================================

// DirectionArrow
export { DirectionArrow } from "./components/DirectionArrow";
export type { DirectionArrowProps } from "./components/DirectionArrow";

// ============================================
// UTILS
// ============================================

export {
  getPositionStyle,
  getPositionTransform,
  getZIndex,
} from "./utils/positioning";
export type { PositionStyle } from "./utils/positioning";

// ============================================
// CONTEXT & PROVIDERS (New)
// ============================================

// Main provider
export {
  CosmoProvider,
  type CosmoProviderProps,
} from "./context";

// Theme context
export {
  ThemeProvider,
  useTheme,
  useThemeColors,
  useVariantColor,
  useIsDark,
  useAnimationTokens,
  useSpacingTokens,
  lightTheme,
  darkTheme,
  arTheme,
  getTheme,
  createTheme,
  type ThemeContextValue,
  type ThemeProviderProps,
} from "./context";

// Adaptive context
export {
  AdaptiveProvider,
  useAdaptive,
  useComplexity,
  useFeature,
  useAnimationSettings,
  useSafetyMode,
  useEmotionalState,
  type AdaptiveContextValue,
  type AdaptiveProviderProps,
} from "./context";

// ============================================
// HOOKS (Advanced Features)
// ============================================

// Spatial Layout
export {
  useSpatialLayout,
  useSpatialIntent,
  ZONE_TO_POSITION,
  type SpatialLayoutItem,
  type SpatialLayoutContext,
  type SpatialLayoutOptions,
  type UseSpatialLayoutReturn,
} from "./hooks";

// Voice Commands
export {
  useVoiceCommands,
  useVoiceAction,
  useTextToSpeech,
  type VoiceCommandsOptions,
  type VoiceCommandsState,
  type UseVoiceCommandsReturn,
  type SpeakOptions,
} from "./hooks";
