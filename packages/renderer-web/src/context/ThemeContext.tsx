/**
 * Cosmo UI Theme Context v1.0
 *
 * React context provider for theme management.
 * Provides theme switching, CSS variables injection, and theme utilities.
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
  type CosmoTheme,
  type ThemeName,
  lightTheme,
  darkTheme,
  arTheme,
  getTheme,
  createTheme,
  themeToCSSVariables,
  getSemanticColor,
} from "@cosmo/core-schema";

// ============================================================================
// CONTEXT TYPES
// ============================================================================

export interface ThemeContextValue {
  /** Current theme */
  theme: CosmoTheme;

  /** Current theme name */
  themeName: ThemeName;

  /** Set theme by name */
  setTheme: (name: ThemeName) => void;

  /** Set custom theme */
  setCustomTheme: (theme: CosmoTheme) => void;

  /** Toggle between light and dark */
  toggleTheme: () => void;

  /** Get semantic colors for a variant */
  getVariantColors: (
    variant: "neutral" | "info" | "success" | "warning" | "error"
  ) => { bg: string; border: string; text: string; icon: string };

  /** Whether dark mode is active */
  isDark: boolean;

  /** Whether AR mode is active */
  isAR: boolean;

  /** CSS variables for current theme */
  cssVariables: Record<string, string>;
}

// ============================================================================
// CONTEXT
// ============================================================================

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

export interface ThemeProviderProps {
  children: ReactNode;

  /** Initial theme name */
  defaultTheme?: ThemeName;

  /** Custom theme (overrides defaultTheme) */
  customTheme?: CosmoTheme;

  /** Storage key for persisting theme preference */
  storageKey?: string;

  /** Whether to inject CSS variables into document */
  injectCSS?: boolean;

  /** CSS selector for injecting variables (default: :root) */
  cssSelector?: string;

  /** Whether to listen for system dark mode preference */
  detectSystemTheme?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  customTheme,
  storageKey = "cosmo-theme",
  injectCSS = true,
  cssSelector = ":root",
  detectSystemTheme = true,
}: ThemeProviderProps) {
  // Initialize theme from storage or default
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    if (typeof window === "undefined") return defaultTheme;

    const stored = localStorage.getItem(storageKey);
    if (stored && (stored === "light" || stored === "dark" || stored === "ar")) {
      return stored as ThemeName;
    }

    if (detectSystemTheme) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }

    return defaultTheme;
  });

  const [currentCustomTheme, setCurrentCustomTheme] = useState<CosmoTheme | undefined>(
    customTheme
  );

  // Get current theme
  const theme = useMemo(() => {
    if (currentCustomTheme) return currentCustomTheme;
    return getTheme(themeName);
  }, [themeName, currentCustomTheme]);

  // CSS variables
  const cssVariables = useMemo(() => themeToCSSVariables(theme), [theme]);

  // Inject CSS variables
  useEffect(() => {
    if (!injectCSS || typeof document === "undefined") return;

    const style = document.createElement("style");
    style.id = "cosmo-theme-variables";

    const cssRules = Object.entries(cssVariables)
      .map(([key, value]) => `  ${key}: ${value};`)
      .join("\n");

    style.textContent = `${cssSelector} {\n${cssRules}\n}`;

    // Remove existing style if present
    const existing = document.getElementById("cosmo-theme-variables");
    if (existing) {
      existing.remove();
    }

    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, [cssVariables, injectCSS, cssSelector]);

  // Persist theme preference
  useEffect(() => {
    if (typeof window === "undefined" || currentCustomTheme) return;
    localStorage.setItem(storageKey, themeName);
  }, [themeName, storageKey, currentCustomTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (!detectSystemTheme || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if no explicit preference stored
      const stored = localStorage.getItem(storageKey);
      if (!stored) {
        setThemeName(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [detectSystemTheme, storageKey]);

  // Theme setters
  const setTheme = useCallback((name: ThemeName) => {
    setCurrentCustomTheme(undefined);
    setThemeName(name);
  }, []);

  const setCustomTheme = useCallback((newTheme: CosmoTheme) => {
    setCurrentCustomTheme(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setCurrentCustomTheme(undefined);
    setThemeName((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  // Utility functions
  const getVariantColors = useCallback(
    (variant: "neutral" | "info" | "success" | "warning" | "error") => {
      return getSemanticColor(theme, variant);
    },
    [theme]
  );

  const value: ThemeContextValue = useMemo(
    () => ({
      theme,
      themeName: currentCustomTheme ? "custom" : themeName,
      setTheme,
      setCustomTheme,
      toggleTheme,
      getVariantColors,
      isDark: theme.mode === "dark",
      isAR: themeName === "ar",
      cssVariables,
    }),
    [
      theme,
      themeName,
      currentCustomTheme,
      setTheme,
      setCustomTheme,
      toggleTheme,
      getVariantColors,
      cssVariables,
    ]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ============================================================================
// HOOK
// ============================================================================

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Get current theme colors
 */
export function useThemeColors() {
  const { theme } = useTheme();
  return theme.colors;
}

/**
 * Get semantic color for variant
 */
export function useVariantColor(
  variant: "neutral" | "info" | "success" | "warning" | "error"
) {
  const { getVariantColors } = useTheme();
  return getVariantColors(variant);
}

/**
 * Check if dark mode is active
 */
export function useIsDark() {
  const { isDark } = useTheme();
  return isDark;
}

/**
 * Get animation tokens
 */
export function useAnimationTokens() {
  const { theme } = useTheme();
  return theme.animation;
}

/**
 * Get spacing tokens
 */
export function useSpacingTokens() {
  const { theme } = useTheme();
  return theme.spacing;
}

// ============================================================================
// EXPORTS
// ============================================================================

export { lightTheme, darkTheme, arTheme, getTheme, createTheme };
