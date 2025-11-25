/**
 * @cosmo/core-schema
 * Type definitions and schemas for Cosmo UI components
 */

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

// Constraints
export { HUDCARD_CONSTRAINTS, CONTEXTBADGE_CONSTRAINTS, PROGRESSRING_CONSTRAINTS, STATUSINDICATOR_CONSTRAINTS, ACTIONBAR_CONSTRAINTS, TOOLTIP_CONSTRAINTS } from "./constraints";
export type { HUDCardConstraints, ContextBadgeConstraints, ProgressRingConstraints, StatusIndicatorConstraints, ActionBarConstraints, TooltipConstraints } from "./constraints";
