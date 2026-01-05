/**
 * @cosmo/renderer-ar
 * WebXR + Three.js renderer for Cosmo UI
 *
 * AI-first AR UI framework
 * Same schema, same validator, cross-reality rendering
 *
 * v0.3: ContextBadge support
 */

// HUDCard Components
export { ARHUDCard } from "./components/ARHUDCard";
export type { ARHUDCardProps } from "./components/ARHUDCard";

export {
  ARHUDCardManager,
  useARHUDCardManager,
  useHUDCardManager, // Alias for API consistency
} from "./components/ARHUDCardManager";
export type { ARHUDCardManagerProps } from "./components/ARHUDCardManager";

// ContextBadge Components
export { ARContextBadge } from "./components/ARContextBadge";
export type { ARContextBadgeProps } from "./components/ARContextBadge";

export {
  ARContextBadgeManager,
  useARContextBadgeManager,
  useContextBadgeManager, // Alias for API consistency
} from "./components/ARContextBadgeManager";
export type { ARContextBadgeManagerProps } from "./components/ARContextBadgeManager";

// ProgressRing Components
export { ARProgressRing } from "./components/ARProgressRing";
export type { ARProgressRingProps } from "./components/ARProgressRing";

export {
  ARProgressRingManager,
  useARProgressRingManager,
  useProgressRingManager, // Alias for API consistency
} from "./components/ARProgressRingManager";
export type { ARProgressRingManagerProps } from "./components/ARProgressRingManager";

// StatusIndicator Components
export { ARStatusIndicator } from "./components/ARStatusIndicator";
export type { ARStatusIndicatorProps } from "./components/ARStatusIndicator";

export {
  ARStatusIndicatorManager,
  useARStatusIndicatorManager,
  useStatusIndicatorManager, // Alias for API consistency
} from "./components/ARStatusIndicatorManager";
export type { ARStatusIndicatorManagerProps } from "./components/ARStatusIndicatorManager";

// Utils - Positioning
export {
  getARPosition,
  getARCardSize,
  getARStackOffset,
  getPriorityZOffset,
} from "./utils/positioning";
export type { ARPosition } from "./utils/positioning";

// Utils - Styling
export {
  getVariantColors,
  createBackgroundMaterial,
  createBorderMaterial,
  getIconEmoji,
} from "./utils/styling";
export type { ARCardColors } from "./utils/styling";

// Utils - Anchoring
export {
  getAnchorFromMetadata,
  isWorldSpaceCard,
  getDefaultAnchorDistance,
  eulerToQuaternion,
} from "./utils/anchoring";
export type { WorldAnchor } from "./utils/anchoring";

// Hooks
export { useHitTest, useHitTestOnce } from "./hooks/useHitTest";
export type { HitTestResult } from "./hooks/useHitTest";

// AR Text Rendering (troika-three-text)
export {
  ARText,
  ARTitle,
  ARBody,
  ARCaption,
  ARLabel,
  ARBadge,
  ARHUDText,
  AR_FONTS,
  AR_TEXT_PRESETS,
  calculateARFontSize,
  calculateARMaxWidth,
  getContrastingColor,
} from "./components/ARText";
export type { ARTextProps } from "./components/ARText";

// Re-export core schema for convenience
export type {
  HUDCard,
  HUDCardVariant,
  HUDCardPosition,
  HUDCardIcon,
  HUDCardAction,
  HUDCardMetadata,
  HUDAnchorType,
  HUDAutoAnchor,
  ContextBadge,
  ContextBadgeVariant,
  ContextBadgePosition,
  ContextBadgeIcon,
  ContextBadgeMetadata,
  ContextBadgeAnchorType,
  ContextBadgeAutoAnchor,
  ProgressRing,
  ProgressRingVariant,
  ProgressRingPosition,
  ProgressRingMetadata,
  ProgressRingAnchorType,
  ProgressRingAutoAnchor,
  StatusIndicator,
  StatusIndicatorState,
  StatusIndicatorPosition,
  StatusIndicatorMetadata,
  StatusIndicatorAnchorType,
  StatusIndicatorAutoAnchor,
} from "@cosmo/core-schema";
