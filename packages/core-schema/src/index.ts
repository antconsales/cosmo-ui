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

// ============================================
// THEME SYSTEM (New)
// ============================================

export {
  // Primitives
  PRIMITIVE_COLORS,
  SPACING,
  RADIUS,
  SHADOWS,
  ANIMATION,
  TYPOGRAPHY,
  GLASS,
  // Themes
  lightTheme,
  darkTheme,
  arTheme,
  themes,
  // Utilities
  getTheme,
  createTheme,
  themeToCSSVariables,
  getSemanticColor,
} from "./theme";

export type {
  ColorScale,
  SpacingTokens,
  RadiusTokens,
  ShadowTokens,
  AnimationTokens,
  TypographyTokens,
  GlassTokens,
  ThemeMode,
  SemanticColors,
  CosmoTheme,
  ThemeName,
} from "./theme";

// ============================================
// SPATIAL INTENT SYSTEM (New)
// ============================================

export {
  INTENT_DEFAULTS,
  ZONE_COORDINATES,
  resolveSpatialConfig,
  checkCollision,
  resolveCollision,
  createSpatialLayoutState,
  addToLayout,
  removeFromLayout,
  updateUserContext,
} from "./spatial";

export type {
  SpatialIntent,
  UrgencyLevel,
  SpatialZone,
  ARSpatialPreference,
  SpatialConfig,
  ViewingContext,
  UserContext,
  SpatialAnchor,
  SpatialLayoutState,
} from "./spatial";

// ============================================
// AI METADATA SYSTEM (New)
// ============================================

export {
  getConfidenceLevel,
  DEFAULT_MULTI_AGENT_CONFIG,
  canAgentAddComponent,
  resolveAgentConflict,
  createDefaultAIMetadata,
  calculateOverallConfidence,
  formatAIMetadataForDebug,
} from "./ai-metadata";

export type {
  AIConfidence,
  ConfidenceLevel,
  AIReasoning,
  AlternativeOption,
  AISource,
  AIGenerationContext,
  AIFeedback,
  AIMetadata,
  MultiAgentConfig,
  AgentUIRequest,
  AgentUIResponse,
  ActiveComponent,
} from "./ai-metadata";

// ============================================
// ADAPTIVE COMPLEXITY SYSTEM (New)
// ============================================

export {
  COMPLEXITY_PRESETS,
  ACTIVITY_COMPLEXITY,
  ACTIVITY_RULES,
  EMOTIONAL_CONFIGS,
  computeAdaptiveConfig,
  getEmotionalConfig,
  suggestEmotionalVariant,
  computeFullAdaptiveState,
} from "./adaptive";

export type {
  ComplexityLevel,
  UserActivity,
  EnvironmentType,
  LightingCondition,
  CognitiveLoad,
  AdaptiveContext,
  AdaptiveConfig,
  EmotionalVariant,
  EmotionalConfig,
  FullAdaptiveState,
} from "./adaptive";

// ============================================
// VOICE-FIRST ACTIONS (New)
// ============================================

export {
  BUILT_IN_VOICE_TRIGGERS,
  DEFAULT_VOICE_CONFIGS,
  generateAnnouncement,
  matchesTrigger,
  findMatchingAction,
  getAvailableCommands,
  generateVoiceHelpText,
} from "./voice";

export type {
  VoiceTrigger,
  VoiceAction,
  BuiltInVoiceAction,
  VoiceFeedbackType,
  EarconType,
  HapticPattern,
  VoiceFeedbackConfig,
  AnnouncementPriority,
  VoiceAnnouncement,
  ComponentVoiceConfig,
  VoiceContext,
  VoiceEventType,
  VoiceEvent,
} from "./voice";

// ============================================
// BIOMETRIC FEEDBACK (New)
// ============================================

export {
  DEFAULT_GAZE_CONFIG,
  BIOMETRIC_PRESETS,
  calculateAttentionScore,
  detectDrowsiness,
  calculateStressLevel,
  isGazingAtComponent,
} from "./biometric";

export type {
  EyeTrackingData,
  GazeFocusState,
  AttentionMetrics,
  HeartRateData,
  StressIndicators,
  ActivityState,
  BiometricContext,
  BiometricReaction,
  BiometricTrigger,
  BiometricAction,
  GazeInteractionConfig,
} from "./biometric";

// ============================================
// SEMANTIC RELATIONSHIPS (New)
// ============================================

export {
  createRelationshipGraph,
  addRelationship,
  removeRelationship,
  getRelationshipsFor,
  getCascadeDismissals,
  follows,
  replaces,
  groupsWith,
  expands,
  confirms,
  respondsTo,
  createConfirmationFlow,
  createProgressFlow,
} from "./relationships";

export type {
  RelationshipType,
  TimingRelation,
  PositionRelation,
  SemanticRelationship,
  RelationshipCondition,
  RelationshipAnimation,
  RelationshipBehavior,
  RelationshipGraph,
  UIFlow,
  UIFlowStep,
} from "./relationships";

// ============================================
// ICON SYSTEM (New)
// ============================================

export {
  ICON_REGISTRY,
  getIcon,
  getIconsByCategory,
  searchIcons,
  getAllIconNames,
  iconToSVG,
  iconToDataURL,
  isValidIconName,
} from "./icons";

export type {
  IconCategory,
  IconDefinition,
  IconName,
} from "./icons";

// ============================================
// PLUGIN ARCHITECTURE (New)
// ============================================

export {
  createPluginRegistry,
  registerPlugin,
  unregisterPlugin,
  getComponentSchema,
  getValidator,
  getRenderer,
  getAIAdapter,
  createPlugin,
  PluginBuilder,
  examplePlugin,
} from "./plugin";

export type {
  PluginMetadata,
  PluginComponentSchema,
  PluginValidator,
  ValidationResult,
  ValidationError,
  PluginRenderer,
  PluginAIAdapter,
  PluginThemeExtension,
  CosmoPlugin,
  PluginHooks,
  PluginRegistry,
} from "./plugin";
