/**
 * @cosmo/core-schema
 * Type definitions and schemas for Cosmo UI components
 *
 * v1.0 - 16 Components for Wearable-Ready UI
 */

// ============================================
// CORE COMPONENTS (Original 6)
// ============================================

// HUDCard component
export type {
  HUDCard,
  HUDCardVariant,
  HUDCardPosition,
  HUDCardPriority,
  HUDCardIcon,
  HUDCardAction,
  HUDCardMetadata,
  HUDAnchorType,
  HUDAutoAnchor,
} from "./components/HUDCard";

// ContextBadge component
export type {
  ContextBadge,
  ContextBadgeVariant,
  ContextBadgePosition,
  ContextBadgeIcon,
  ContextBadgeMetadata,
  ContextBadgeAnchorType,
  ContextBadgeAutoAnchor,
} from "./components/ContextBadge";

// ProgressRing component
export type {
  ProgressRing,
  ProgressRingVariant,
  ProgressRingPosition,
  ProgressRingMetadata,
  ProgressRingAnchorType,
  ProgressRingAutoAnchor,
} from "./components/ProgressRing";

// StatusIndicator component
export type {
  StatusIndicator,
  StatusIndicatorState,
  StatusIndicatorPosition,
  StatusIndicatorMetadata,
  StatusIndicatorAnchorType,
  StatusIndicatorAutoAnchor,
} from "./components/StatusIndicator";

// ActionBar component
export type {
  ActionBar,
  ActionBarItem,
  ActionBarPosition,
  ActionBarVariant,
  ActionBarIcon,
  ActionBarMetadata,
  ActionBarAnchorType,
  ActionBarAutoAnchor,
} from "./components/ActionBar";

// Tooltip component
export type {
  Tooltip,
  TooltipPosition,
  TooltipTrigger,
  TooltipVariant,
  TooltipMetadata,
  TooltipAnchorType,
  TooltipAutoAnchor,
} from "./components/Tooltip";

// ============================================
// MEDIA COMPONENTS (New)
// ============================================

// MediaCard component
export type {
  MediaCard,
  MediaCardType,
  MediaCardSize,
  MediaCardVariant,
  MediaCardSource,
  MediaCardMetadata,
  MediaCardAction,
} from "./components/MediaCard";

// MiniPlayer component
export type {
  MiniPlayer,
  MiniPlayerState,
  MiniPlayerVariant,
  MiniPlayerSize,
  MiniPlayerTrack,
  MiniPlayerProgress,
} from "./components/MiniPlayer";

// Timer component
export type {
  Timer,
  TimerMode,
  TimerState,
  TimerVariant,
  TimerSize,
  TimerPreset,
} from "./components/Timer";

// ============================================
// COMMUNICATION COMPONENTS (New)
// ============================================

// MessagePreview component
export type {
  MessagePreview,
  MessagePreviewType,
  MessagePreviewVariant,
  MessagePreviewPriority,
  MessagePreviewSender,
  MessagePreviewAction,
} from "./components/MessagePreview";

// ContactCard component
export type {
  ContactCard,
  ContactCardVariant,
  ContactCardStatus,
  ContactCardAction,
} from "./components/ContactCard";

// ============================================
// PRODUCTIVITY COMPONENTS (New)
// ============================================

// EventCard component
export type {
  EventCard,
  EventCardVariant,
  EventCardStatus,
  EventCardType,
  EventCardLocation,
  EventCardAttendee,
  EventCardAction,
} from "./components/EventCard";

// WeatherWidget component
export type {
  WeatherWidget,
  WeatherCondition,
  WeatherWidgetVariant,
  WeatherWidgetSize,
  WeatherForecastHour,
  WeatherForecastDay,
} from "./components/WeatherWidget";

// ============================================
// SYSTEM COMPONENTS (New)
// ============================================

// QuickSettings component
export type {
  QuickSettings,
  QuickSettingsVariant,
  QuickSettingsLayout,
  QuickSettingType,
  QuickSettingItem,
} from "./components/QuickSettings";

// ActivityRing component
export type {
  ActivityRing,
  ActivityRingVariant,
  ActivityRingSize,
  ActivityRingData,
} from "./components/ActivityRing";

// ============================================
// NAVIGATION COMPONENTS (New)
// ============================================

// DirectionArrow component
export type {
  DirectionArrow,
  DirectionArrowVariant,
  DirectionArrowSize,
  DirectionArrowMode,
  DirectionArrowDestination,
} from "./components/DirectionArrow";

// ============================================
// CONSTRAINTS
// ============================================

export {
  HUDCARD_CONSTRAINTS,
  CONTEXTBADGE_CONSTRAINTS,
  PROGRESSRING_CONSTRAINTS,
  STATUSINDICATOR_CONSTRAINTS,
  ACTIONBAR_CONSTRAINTS,
  TOOLTIP_CONSTRAINTS
} from "./constraints";

export type {
  HUDCardConstraints,
  ContextBadgeConstraints,
  ProgressRingConstraints,
  StatusIndicatorConstraints,
  ActionBarConstraints,
  TooltipConstraints
} from "./constraints";
