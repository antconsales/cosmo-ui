/**
 * Cosmo UI Web Context Exports
 */

// Main provider
export {
  CosmoProvider,
  type CosmoProviderProps,
} from "./CosmoProvider";

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
} from "./ThemeContext";

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
} from "./AdaptiveContext";
