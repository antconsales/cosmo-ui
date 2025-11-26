/**
 * @cosmo/renderer-meta
 *
 * Meta Ray-Ban Display renderer for Cosmo UI
 *
 * This package provides a renderer optimized for Meta's smart glasses
 * with HUD display, designed for the Ray-Ban Meta Display with Neural Band.
 *
 * Status: PREVIEW
 * The Meta Wearables SDK Display API is not yet publicly available.
 * This renderer is ready to integrate when the API launches (expected 2026).
 *
 * Features:
 * - Optimized for small HUD display
 * - Neural Band gesture mapping
 * - Audio feedback integration
 * - Priority-based display queue
 * - Automatic text truncation for glanceability
 *
 * @see https://developers.meta.com/wearables/
 */

// Types
export type {
  MetaDisplayConfig,
  NeuralBandGesture,
  GestureEvent,
  GestureMapping,
  AudioFeedbackType,
  AudioFeedback,
  MetaRenderContext,
  MetaRenderOutput,
} from "./types";

// Constants
export {
  DEFAULT_DISPLAY_CONFIG,
  DEFAULT_GESTURE_MAPPING,
} from "./types";

// Renderer
export { MetaRenderer } from "./renderer";

// Re-export schema types for convenience
export type {
  HUDCard,
  ContextBadge,
  ProgressRing,
  StatusIndicator,
  MessagePreview,
  Timer,
} from "@cosmo/core-schema";
