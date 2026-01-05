/**
 * Cosmo UI Adaptive Context v1.0
 *
 * React context provider for adaptive UI behavior.
 * Automatically adjusts UI complexity based on user context.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import {
  type AdaptiveContext as AdaptiveContextType,
  type AdaptiveConfig,
  type ComplexityLevel,
  type UserActivity,
  type EmotionalVariant,
  type FullAdaptiveState,
  computeAdaptiveConfig,
  computeFullAdaptiveState,
  COMPLEXITY_PRESETS,
} from "@cosmo/core-schema";

// ============================================================================
// CONTEXT TYPES
// ============================================================================

export interface AdaptiveContextValue {
  /** Current adaptive context */
  context: AdaptiveContextType;

  /** Current adaptive config */
  config: AdaptiveConfig;

  /** Current complexity level */
  complexity: ComplexityLevel;

  /** Update user activity */
  setActivity: (activity: UserActivity) => void;

  /** Update cognitive load */
  setCognitiveLoad: (load: "low" | "medium" | "high" | "overloaded") => void;

  /** Enable/disable safety mode */
  setSafetyMode: (enabled: boolean) => void;

  /** Set emotional variant for current UI */
  setEmotionalVariant: (variant: EmotionalVariant) => void;

  /** Current emotional variant */
  emotionalVariant: EmotionalVariant;

  /** Full adaptive state */
  fullState: FullAdaptiveState;

  /** Whether animations are enabled */
  animationsEnabled: boolean;

  /** Whether sounds are enabled */
  soundsEnabled: boolean;

  /** Whether haptics are enabled */
  hapticsEnabled: boolean;

  /** Get text length limit for current complexity */
  getMaxTextLength: (field: "title" | "content" | "label") => number;

  /** Check if feature is enabled */
  isFeatureEnabled: (feature: keyof AdaptiveConfig["features"]) => boolean;
}

// ============================================================================
// CONTEXT
// ============================================================================

const AdaptiveContext = createContext<AdaptiveContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

export interface AdaptiveProviderProps {
  children: ReactNode;

  /** Initial activity state */
  defaultActivity?: UserActivity;

  /** Initial complexity override */
  defaultComplexity?: ComplexityLevel;

  /** Whether to detect device capabilities automatically */
  detectCapabilities?: boolean;

  /** Whether to detect motion preference */
  detectReducedMotion?: boolean;

  /** Custom context overrides */
  contextOverrides?: Partial<AdaptiveContextType>;
}

export function AdaptiveProvider({
  children,
  defaultActivity = "stationary",
  defaultComplexity,
  detectCapabilities = true,
  detectReducedMotion = true,
  contextOverrides,
}: AdaptiveProviderProps) {
  // Initialize context
  const [context, setContext] = useState<AdaptiveContextType>(() => {
    const baseContext: AdaptiveContextType = {
      activity: defaultActivity,
      environment: "unknown",
      lighting: "normal",
      cognitiveLoad: "medium",
      timeContext: {
        timeOfDay: getTimeOfDay(),
        isWeekend: isWeekend(),
      },
      device: {
        type: "desktop",
        hasHaptics: false,
        hasAudio: true,
      },
      preferences: {
        reducedMotion: false,
        highContrast: false,
        largeText: false,
        voiceFirst: false,
        minimalistMode: false,
      },
      safetyMode: false,
      ...contextOverrides,
    };

    return baseContext;
  });

  const [emotionalVariant, setEmotionalVariant] = useState<EmotionalVariant>("neutral");

  // Detect device capabilities
  useEffect(() => {
    if (!detectCapabilities || typeof window === "undefined") return;

    const detectDevice = () => {
      const ua = navigator.userAgent.toLowerCase();
      let type: AdaptiveContextType["device"]["type"] = "desktop";

      if (/mobile|android|iphone|ipad|ipod/.test(ua)) {
        type = /ipad|tablet/.test(ua) ? "tablet" : "phone";
      }

      const hasHaptics = "vibrate" in navigator;
      const hasAudio = "AudioContext" in window || "webkitAudioContext" in window;

      setContext((prev) => ({
        ...prev,
        device: {
          ...prev.device,
          type,
          hasHaptics,
          hasAudio,
        },
      }));
    };

    detectDevice();
  }, [detectCapabilities]);

  // Detect reduced motion preference
  useEffect(() => {
    if (!detectReducedMotion || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setContext((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          reducedMotion: e.matches,
        },
      }));
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [detectReducedMotion]);

  // Compute adaptive config
  const config = useMemo(() => {
    if (defaultComplexity) {
      return {
        ...computeAdaptiveConfig(context),
        complexity: defaultComplexity,
        ...COMPLEXITY_PRESETS[defaultComplexity],
      };
    }
    return computeAdaptiveConfig(context);
  }, [context, defaultComplexity]);

  // Compute full state with emotional variant
  const fullState = useMemo(
    () => computeFullAdaptiveState(context, emotionalVariant),
    [context, emotionalVariant]
  );

  // Setters
  const setActivity = useCallback((activity: UserActivity) => {
    setContext((prev) => ({ ...prev, activity }));
  }, []);

  const setCognitiveLoad = useCallback(
    (cognitiveLoad: "low" | "medium" | "high" | "overloaded") => {
      setContext((prev) => ({ ...prev, cognitiveLoad }));
    },
    []
  );

  const setSafetyMode = useCallback((safetyMode: boolean) => {
    setContext((prev) => ({ ...prev, safetyMode }));
  }, []);

  // Utility functions
  const getMaxTextLength = useCallback(
    (field: "title" | "content" | "label") => {
      const lengths: Record<typeof field, keyof AdaptiveConfig["text"]> = {
        title: "maxTitleLength",
        content: "maxContentLength",
        label: "maxTitleLength", // Use title length for labels
      };
      return config.text[lengths[field]] as number;
    },
    [config]
  );

  const isFeatureEnabled = useCallback(
    (feature: keyof AdaptiveConfig["features"]) => {
      return config.features[feature];
    },
    [config]
  );

  const value: AdaptiveContextValue = useMemo(
    () => ({
      context,
      config,
      complexity: config.complexity,
      setActivity,
      setCognitiveLoad,
      setSafetyMode,
      setEmotionalVariant,
      emotionalVariant,
      fullState,
      animationsEnabled: config.features.showAnimations,
      soundsEnabled: config.features.enableSound,
      hapticsEnabled: config.features.enableHaptics,
      getMaxTextLength,
      isFeatureEnabled,
    }),
    [
      context,
      config,
      setActivity,
      setCognitiveLoad,
      setSafetyMode,
      emotionalVariant,
      fullState,
      getMaxTextLength,
      isFeatureEnabled,
    ]
  );

  return (
    <AdaptiveContext.Provider value={value}>{children}</AdaptiveContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useAdaptive(): AdaptiveContextValue {
  const context = useContext(AdaptiveContext);

  if (!context) {
    throw new Error("useAdaptive must be used within an AdaptiveProvider");
  }

  return context;
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Get current complexity level
 */
export function useComplexity() {
  const { complexity } = useAdaptive();
  return complexity;
}

/**
 * Check if feature is enabled
 */
export function useFeature(feature: keyof AdaptiveConfig["features"]) {
  const { isFeatureEnabled } = useAdaptive();
  return isFeatureEnabled(feature);
}

/**
 * Get animation settings
 */
export function useAnimationSettings() {
  const { config, animationsEnabled } = useAdaptive();
  return {
    enabled: animationsEnabled,
    speed: config.timing.animationSpeed,
    duration: Math.round(200 / config.timing.animationSpeed),
  };
}

/**
 * Check if in safety mode
 */
export function useSafetyMode() {
  const { context } = useAdaptive();
  return context.safetyMode;
}

/**
 * Get current emotional state
 */
export function useEmotionalState() {
  const { emotionalVariant, fullState } = useAdaptive();
  return {
    variant: emotionalVariant,
    config: fullState.emotional,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}
