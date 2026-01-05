/**
 * Cosmo UI Hooks
 *
 * React hooks for advanced Cosmo UI features:
 * - Spatial Layout (intent-based positioning)
 * - Voice Commands (speech recognition & synthesis)
 */

// Spatial Layout
export {
  useSpatialLayout,
  useSpatialIntent,
  ZONE_TO_POSITION,
  type SpatialLayoutItem,
  type SpatialLayoutContext,
  type SpatialLayoutOptions,
  type UseSpatialLayoutReturn,
} from "./useSpatialLayout";

// Voice Commands
export {
  useVoiceCommands,
  useVoiceAction,
  useTextToSpeech,
  type VoiceCommandsOptions,
  type VoiceCommandsState,
  type UseVoiceCommandsReturn,
  type SpeakOptions,
} from "./useVoiceCommands";
