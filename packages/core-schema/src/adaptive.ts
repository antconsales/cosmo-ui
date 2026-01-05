/**
 * Cosmo UI Adaptive System v1.0
 *
 * Components that automatically adapt their complexity, style, and behavior
 * based on user context, activity, environment, and cognitive load.
 */

// ============================================================================
// ADAPTIVE COMPLEXITY
// ============================================================================

/**
 * Complexity levels for UI adaptation
 */
export type ComplexityLevel = "minimal" | "reduced" | "standard" | "enhanced" | "full";

/**
 * Activity-based complexity recommendations
 */
export type UserActivity =
  | "stationary"   // Full complexity allowed
  | "walking"      // Reduced complexity
  | "running"      // Minimal complexity
  | "driving"      // Critical only
  | "cycling"      // Critical only
  | "exercising"   // Minimal, fitness-focused
  | "sleeping"     // Do not disturb
  | "meeting"      // Minimal, important only
  | "focused";     // Minimal, relevant only

/**
 * Environment types affecting UI presentation
 */
export type EnvironmentType =
  | "indoor-home"
  | "indoor-office"
  | "indoor-public"
  | "outdoor-urban"
  | "outdoor-nature"
  | "transit"
  | "vehicle"
  | "unknown";

/**
 * Lighting conditions
 */
export type LightingCondition =
  | "bright-sunlight"
  | "bright-indoor"
  | "normal"
  | "dim"
  | "dark"
  | "variable";

/**
 * Cognitive load estimate
 */
export type CognitiveLoad = "low" | "medium" | "high" | "overloaded";

/**
 * Complete adaptive context
 */
export interface AdaptiveContext {
  // User activity
  activity: UserActivity;

  // Environment
  environment: EnvironmentType;

  // Lighting
  lighting: LightingCondition;

  // Estimated cognitive load
  cognitiveLoad: CognitiveLoad;

  // Time context
  timeContext: {
    timeOfDay: "morning" | "afternoon" | "evening" | "night";
    isWeekend: boolean;
    isHoliday?: boolean;
  };

  // Device capabilities
  device: {
    type: "phone" | "tablet" | "desktop" | "ar-glasses" | "smartwatch";
    hasHaptics: boolean;
    hasAudio: boolean;
    batteryLevel?: number;
    isLowPowerMode?: boolean;
  };

  // User preferences
  preferences: {
    reducedMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
    voiceFirst: boolean;
    minimalistMode: boolean;
  };

  // Safety mode (driving, etc.)
  safetyMode: boolean;
}

/**
 * Adaptive configuration for components
 */
export interface AdaptiveConfig {
  /** Target complexity level */
  complexity: ComplexityLevel;

  /** Features to enable/disable */
  features: {
    showActions: boolean;
    showIcons: boolean;
    showAnimations: boolean;
    showDetails: boolean;
    enableDismiss: boolean;
    enableInteraction: boolean;
    enableSound: boolean;
    enableHaptics: boolean;
    enableVoice: boolean;
  };

  /** Text adaptations */
  text: {
    maxTitleLength: number;
    maxContentLength: number;
    fontSize: "small" | "normal" | "large" | "xlarge";
    truncate: boolean;
  };

  /** Visual adaptations */
  visual: {
    contrast: "normal" | "high" | "ultra";
    brightness: number; // 0-2 multiplier
    opacity: number;    // 0-1
    blur: boolean;
    shadows: boolean;
  };

  /** Timing adaptations */
  timing: {
    autoHideMultiplier: number;  // 1.0 = normal, 2.0 = double time
    animationSpeed: number;      // 1.0 = normal, 0.5 = half speed
    delayBeforeShow: number;     // ms
  };
}

// ============================================================================
// COMPLEXITY PRESETS
// ============================================================================

export const COMPLEXITY_PRESETS: Record<ComplexityLevel, Partial<AdaptiveConfig>> = {
  minimal: {
    complexity: "minimal",
    features: {
      showActions: false,
      showIcons: true,
      showAnimations: false,
      showDetails: false,
      enableDismiss: true,
      enableInteraction: false,
      enableSound: false,
      enableHaptics: true,
      enableVoice: true,
    },
    text: {
      maxTitleLength: 30,
      maxContentLength: 50,
      fontSize: "large",
      truncate: true,
    },
    visual: {
      contrast: "high",
      brightness: 1.2,
      opacity: 0.95,
      blur: false,
      shadows: false,
    },
    timing: {
      autoHideMultiplier: 0.5,
      animationSpeed: 2.0,
      delayBeforeShow: 0,
    },
  },

  reduced: {
    complexity: "reduced",
    features: {
      showActions: true,
      showIcons: true,
      showAnimations: false,
      showDetails: false,
      enableDismiss: true,
      enableInteraction: true,
      enableSound: false,
      enableHaptics: true,
      enableVoice: true,
    },
    text: {
      maxTitleLength: 45,
      maxContentLength: 100,
      fontSize: "normal",
      truncate: true,
    },
    visual: {
      contrast: "high",
      brightness: 1.1,
      opacity: 0.9,
      blur: false,
      shadows: true,
    },
    timing: {
      autoHideMultiplier: 0.75,
      animationSpeed: 1.5,
      delayBeforeShow: 0,
    },
  },

  standard: {
    complexity: "standard",
    features: {
      showActions: true,
      showIcons: true,
      showAnimations: true,
      showDetails: true,
      enableDismiss: true,
      enableInteraction: true,
      enableSound: true,
      enableHaptics: true,
      enableVoice: true,
    },
    text: {
      maxTitleLength: 60,
      maxContentLength: 200,
      fontSize: "normal",
      truncate: false,
    },
    visual: {
      contrast: "normal",
      brightness: 1.0,
      opacity: 1.0,
      blur: true,
      shadows: true,
    },
    timing: {
      autoHideMultiplier: 1.0,
      animationSpeed: 1.0,
      delayBeforeShow: 0,
    },
  },

  enhanced: {
    complexity: "enhanced",
    features: {
      showActions: true,
      showIcons: true,
      showAnimations: true,
      showDetails: true,
      enableDismiss: true,
      enableInteraction: true,
      enableSound: true,
      enableHaptics: true,
      enableVoice: true,
    },
    text: {
      maxTitleLength: 80,
      maxContentLength: 300,
      fontSize: "normal",
      truncate: false,
    },
    visual: {
      contrast: "normal",
      brightness: 1.0,
      opacity: 1.0,
      blur: true,
      shadows: true,
    },
    timing: {
      autoHideMultiplier: 1.25,
      animationSpeed: 1.0,
      delayBeforeShow: 100,
    },
  },

  full: {
    complexity: "full",
    features: {
      showActions: true,
      showIcons: true,
      showAnimations: true,
      showDetails: true,
      enableDismiss: true,
      enableInteraction: true,
      enableSound: true,
      enableHaptics: true,
      enableVoice: true,
    },
    text: {
      maxTitleLength: 100,
      maxContentLength: 500,
      fontSize: "normal",
      truncate: false,
    },
    visual: {
      contrast: "normal",
      brightness: 1.0,
      opacity: 1.0,
      blur: true,
      shadows: true,
    },
    timing: {
      autoHideMultiplier: 1.5,
      animationSpeed: 0.8,
      delayBeforeShow: 200,
    },
  },
};

// ============================================================================
// ACTIVITY-BASED RULES
// ============================================================================

export const ACTIVITY_COMPLEXITY: Record<UserActivity, ComplexityLevel> = {
  stationary: "full",
  walking: "standard",
  running: "minimal",
  driving: "minimal",
  cycling: "minimal",
  exercising: "reduced",
  sleeping: "minimal",
  meeting: "reduced",
  focused: "reduced",
};

export const ACTIVITY_RULES: Record<UserActivity, Partial<AdaptiveConfig["features"]>> = {
  stationary: {},
  walking: { showAnimations: false },
  running: { showActions: false, showDetails: false, enableSound: false },
  driving: {
    showActions: false,
    showDetails: false,
    enableInteraction: false,
    enableSound: false,
    enableVoice: true,
  },
  cycling: {
    showActions: false,
    showDetails: false,
    enableInteraction: false,
    enableSound: false,
  },
  exercising: { showDetails: false },
  sleeping: {
    showActions: false,
    showAnimations: false,
    enableSound: false,
    enableHaptics: false,
  },
  meeting: { enableSound: false, enableHaptics: false },
  focused: { showAnimations: false, enableSound: false },
};

// ============================================================================
// ADAPTIVE RESOLVER
// ============================================================================

/**
 * Compute adaptive configuration from context
 */
export function computeAdaptiveConfig(context: AdaptiveContext): AdaptiveConfig {
  // Start with activity-based complexity
  let complexity = ACTIVITY_COMPLEXITY[context.activity];

  // Adjust for cognitive load
  if (context.cognitiveLoad === "overloaded") {
    complexity = "minimal";
  } else if (context.cognitiveLoad === "high") {
    complexity = complexity === "full" ? "enhanced" : complexity;
  }

  // Safety mode override
  if (context.safetyMode) {
    complexity = "minimal";
  }

  // Get base config
  const baseConfig = COMPLEXITY_PRESETS[complexity]!;

  // Apply activity rules
  const activityRules = ACTIVITY_RULES[context.activity];
  const features = { ...baseConfig.features!, ...activityRules };

  // Apply user preferences
  if (context.preferences.reducedMotion) {
    features.showAnimations = false;
  }
  if (context.preferences.minimalistMode) {
    features.showDetails = false;
  }
  if (context.preferences.voiceFirst) {
    features.enableVoice = true;
    features.enableSound = true;
  }

  // Apply device constraints
  if (!context.device.hasHaptics) {
    features.enableHaptics = false;
  }
  if (!context.device.hasAudio) {
    features.enableSound = false;
    features.enableVoice = false;
  }
  if (context.device.isLowPowerMode) {
    features.showAnimations = false;
  }

  // Compute visual adjustments
  const visual = { ...baseConfig.visual! };
  if (context.preferences.highContrast) {
    visual.contrast = "ultra";
  }
  if (context.lighting === "bright-sunlight") {
    visual.brightness = 1.5;
    visual.contrast = "high";
  } else if (context.lighting === "dark") {
    visual.brightness = 0.8;
  }

  // Compute text adjustments
  const text = { ...baseConfig.text! };
  if (context.preferences.largeText) {
    text.fontSize = "xlarge";
  }
  if (context.device.type === "smartwatch") {
    text.maxTitleLength = 20;
    text.maxContentLength = 40;
    text.fontSize = "large";
  }

  return {
    complexity,
    features,
    text,
    visual,
    timing: baseConfig.timing!,
  };
}

// ============================================================================
// EMOTIONAL VARIANTS
// ============================================================================

/**
 * Emotional variants for UI - beyond just success/error
 */
export type EmotionalVariant =
  | "neutral"      // Default, no emotional context
  | "calm"         // Soothing, no urgency
  | "focused"      // Minimal distraction, clean
  | "energetic"    // Motivational, celebratory
  | "playful"      // Fun, gamification
  | "serious"      // Important, professional
  | "urgent"       // Time-sensitive
  | "celebratory"  // Achievement, success
  | "supportive"   // Encouraging, helpful
  | "warning"      // Caution, attention
  | "error";       // Problem, failure

/**
 * Emotional configuration
 */
export interface EmotionalConfig {
  /** Primary color hue shift */
  hueShift: number;

  /** Saturation multiplier */
  saturation: number;

  /** Animation style */
  animationStyle: "none" | "subtle" | "smooth" | "bouncy" | "energetic";

  /** Icon style */
  iconStyle: "outlined" | "filled" | "animated";

  /** Sound type */
  soundType?: "none" | "subtle" | "confirmation" | "celebration" | "alert";

  /** Haptic pattern */
  hapticPattern?: "none" | "light" | "medium" | "strong" | "success" | "error";

  /** Typography weight adjustment */
  fontWeight: "normal" | "medium" | "bold";
}

export const EMOTIONAL_CONFIGS: Record<EmotionalVariant, EmotionalConfig> = {
  neutral: {
    hueShift: 0,
    saturation: 1.0,
    animationStyle: "subtle",
    iconStyle: "outlined",
    fontWeight: "normal",
  },
  calm: {
    hueShift: 180,  // Cyan/teal
    saturation: 0.7,
    animationStyle: "smooth",
    iconStyle: "outlined",
    soundType: "subtle",
    hapticPattern: "light",
    fontWeight: "normal",
  },
  focused: {
    hueShift: 220,  // Blue
    saturation: 0.5,
    animationStyle: "none",
    iconStyle: "outlined",
    fontWeight: "medium",
  },
  energetic: {
    hueShift: 30,   // Orange
    saturation: 1.3,
    animationStyle: "bouncy",
    iconStyle: "filled",
    soundType: "confirmation",
    hapticPattern: "medium",
    fontWeight: "bold",
  },
  playful: {
    hueShift: 280,  // Purple/pink
    saturation: 1.2,
    animationStyle: "bouncy",
    iconStyle: "animated",
    soundType: "celebration",
    hapticPattern: "success",
    fontWeight: "medium",
  },
  serious: {
    hueShift: 0,
    saturation: 0.8,
    animationStyle: "subtle",
    iconStyle: "outlined",
    fontWeight: "bold",
  },
  urgent: {
    hueShift: 0,    // Red
    saturation: 1.4,
    animationStyle: "energetic",
    iconStyle: "filled",
    soundType: "alert",
    hapticPattern: "strong",
    fontWeight: "bold",
  },
  celebratory: {
    hueShift: 50,   // Gold/yellow
    saturation: 1.5,
    animationStyle: "energetic",
    iconStyle: "animated",
    soundType: "celebration",
    hapticPattern: "success",
    fontWeight: "bold",
  },
  supportive: {
    hueShift: 120,  // Green
    saturation: 0.9,
    animationStyle: "smooth",
    iconStyle: "outlined",
    soundType: "subtle",
    hapticPattern: "light",
    fontWeight: "normal",
  },
  warning: {
    hueShift: 45,   // Amber
    saturation: 1.2,
    animationStyle: "subtle",
    iconStyle: "filled",
    soundType: "alert",
    hapticPattern: "medium",
    fontWeight: "medium",
  },
  error: {
    hueShift: 0,    // Red
    saturation: 1.3,
    animationStyle: "subtle",
    iconStyle: "filled",
    soundType: "alert",
    hapticPattern: "error",
    fontWeight: "bold",
  },
};

/**
 * Get emotional config for variant
 */
export function getEmotionalConfig(variant: EmotionalVariant): EmotionalConfig {
  return EMOTIONAL_CONFIGS[variant];
}

/**
 * Suggest emotional variant based on content analysis
 */
export function suggestEmotionalVariant(
  content: string,
  context?: { isAchievement?: boolean; isError?: boolean; isReminder?: boolean }
): EmotionalVariant {
  // Achievement detection
  if (context?.isAchievement) return "celebratory";
  if (context?.isError) return "error";
  if (context?.isReminder) return "supportive";

  // Simple keyword analysis
  const lowerContent = content.toLowerCase();

  if (
    lowerContent.includes("congratulation") ||
    lowerContent.includes("achieved") ||
    lowerContent.includes("complete")
  ) {
    return "celebratory";
  }

  if (
    lowerContent.includes("error") ||
    lowerContent.includes("failed") ||
    lowerContent.includes("problem")
  ) {
    return "error";
  }

  if (
    lowerContent.includes("warning") ||
    lowerContent.includes("caution") ||
    lowerContent.includes("attention")
  ) {
    return "warning";
  }

  if (
    lowerContent.includes("urgent") ||
    lowerContent.includes("immediately") ||
    lowerContent.includes("critical")
  ) {
    return "urgent";
  }

  if (
    lowerContent.includes("relax") ||
    lowerContent.includes("breathe") ||
    lowerContent.includes("calm")
  ) {
    return "calm";
  }

  return "neutral";
}

// ============================================================================
// COMBINED ADAPTIVE + EMOTIONAL
// ============================================================================

export interface FullAdaptiveState {
  adaptive: AdaptiveConfig;
  emotional: EmotionalConfig;
  complexity: ComplexityLevel;
  variant: EmotionalVariant;
}

export function computeFullAdaptiveState(
  context: AdaptiveContext,
  emotionalVariant: EmotionalVariant = "neutral"
): FullAdaptiveState {
  const adaptive = computeAdaptiveConfig(context);
  const emotional = getEmotionalConfig(emotionalVariant);

  // Emotional variant might override some adaptive features
  if (emotionalVariant === "calm") {
    adaptive.features.showAnimations = true; // Calm animations are ok
    adaptive.timing.animationSpeed = 0.7;    // Slower, smoother
  }

  if (emotionalVariant === "urgent" || emotionalVariant === "error") {
    // Override safety restrictions for critical info
    if (context.safetyMode && context.activity !== "driving") {
      adaptive.features.enableSound = true;
      adaptive.features.enableHaptics = true;
    }
  }

  return {
    adaptive,
    emotional,
    complexity: adaptive.complexity,
    variant: emotionalVariant,
  };
}
