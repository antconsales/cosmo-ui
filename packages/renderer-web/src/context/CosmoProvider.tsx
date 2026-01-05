/**
 * Cosmo UI Provider v1.0
 *
 * Main provider component that combines all Cosmo UI contexts.
 * Provides theme, adaptive behavior, and spatial layout management.
 */

import { type ReactNode } from "react";
import { ThemeProvider } from "./ThemeContext";
import { AdaptiveProvider } from "./AdaptiveContext";
import type { ThemeName, CosmoTheme, UserActivity, ComplexityLevel } from "@cosmo/core-schema";

// ============================================================================
// COMBINED PROVIDER
// ============================================================================

export interface CosmoProviderProps {
  children: ReactNode;

  // Theme options
  theme?: {
    /** Default theme name */
    default?: ThemeName;
    /** Custom theme */
    custom?: CosmoTheme;
    /** Storage key for persistence */
    storageKey?: string;
    /** Inject CSS variables */
    injectCSS?: boolean;
    /** Detect system dark mode */
    detectSystem?: boolean;
  };

  // Adaptive options
  adaptive?: {
    /** Default activity */
    activity?: UserActivity;
    /** Default complexity override */
    complexity?: ComplexityLevel;
    /** Detect device capabilities */
    detectCapabilities?: boolean;
    /** Detect reduced motion */
    detectReducedMotion?: boolean;
  };
}

/**
 * CosmoProvider - Main provider for Cosmo UI
 *
 * Wraps your app to provide:
 * - Theme management (light/dark/AR modes)
 * - Adaptive UI behavior
 * - Spatial layout management
 *
 * @example
 * ```tsx
 * <CosmoProvider
 *   theme={{ default: "dark", detectSystem: true }}
 *   adaptive={{ activity: "stationary" }}
 * >
 *   <App />
 * </CosmoProvider>
 * ```
 */
export function CosmoProvider({
  children,
  theme = {},
  adaptive = {},
}: CosmoProviderProps) {
  return (
    <ThemeProvider
      defaultTheme={theme.default}
      customTheme={theme.custom}
      storageKey={theme.storageKey}
      injectCSS={theme.injectCSS}
      detectSystemTheme={theme.detectSystem}
    >
      <AdaptiveProvider
        defaultActivity={adaptive.activity}
        defaultComplexity={adaptive.complexity}
        detectCapabilities={adaptive.detectCapabilities}
        detectReducedMotion={adaptive.detectReducedMotion}
      >
        {children}
      </AdaptiveProvider>
    </ThemeProvider>
  );
}

// ============================================================================
// RE-EXPORTS
// ============================================================================

// Theme exports
export {
  ThemeProvider,
  useTheme,
  useThemeColors,
  useVariantColor,
  useIsDark,
  useAnimationTokens,
  useSpacingTokens,
} from "./ThemeContext";

export type { ThemeContextValue, ThemeProviderProps } from "./ThemeContext";

// Adaptive exports
export {
  AdaptiveProvider,
  useAdaptive,
  useComplexity,
  useFeature,
  useAnimationSettings,
  useSafetyMode,
  useEmotionalState,
} from "./AdaptiveContext";

export type { AdaptiveContextValue, AdaptiveProviderProps } from "./AdaptiveContext";
