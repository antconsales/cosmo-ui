/**
 * Cosmo UI Theme System v1.0
 *
 * A comprehensive theming system designed for cross-reality interfaces.
 * Supports light/dark modes, glass morphism, and adaptive theming based on context.
 */

// ============================================================================
// COLOR PRIMITIVES
// ============================================================================

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export const PRIMITIVE_COLORS = {
  // Neutral palette
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },

  // Semantic colors
  blue: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },

  green: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16",
  },

  amber: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#451a03",
  },

  red: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    950: "#450a0a",
  },

  purple: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7",
    600: "#9333ea",
    700: "#7e22ce",
    800: "#6b21a8",
    900: "#581c87",
    950: "#3b0764",
  },

  pink: {
    50: "#fdf2f8",
    100: "#fce7f3",
    200: "#fbcfe8",
    300: "#f9a8d4",
    400: "#f472b6",
    500: "#ec4899",
    600: "#db2777",
    700: "#be185d",
    800: "#9d174d",
    900: "#831843",
    950: "#500724",
  },

  cyan: {
    50: "#ecfeff",
    100: "#cffafe",
    200: "#a5f3fc",
    300: "#67e8f9",
    400: "#22d3ee",
    500: "#06b6d4",
    600: "#0891b2",
    700: "#0e7490",
    800: "#155e75",
    900: "#164e63",
    950: "#083344",
  },
} as const;

// ============================================================================
// DESIGN TOKENS
// ============================================================================

export interface SpacingTokens {
  xxs: number;  // 2px
  xs: number;   // 4px
  sm: number;   // 8px
  md: number;   // 12px
  lg: number;   // 16px
  xl: number;   // 24px
  xxl: number;  // 32px
  xxxl: number; // 48px
}

export const SPACING: SpacingTokens = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export interface RadiusTokens {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export const RADIUS: RadiusTokens = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export interface ShadowTokens {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  glow: string;
  inner: string;
}

export const SHADOWS: ShadowTokens = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  glow: "0 0 20px rgba(59, 130, 246, 0.5)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
} as const;

// ============================================================================
// ANIMATION TOKENS
// ============================================================================

export interface AnimationTokens {
  duration: {
    instant: number;   // 0ms
    fast: number;      // 100ms
    normal: number;    // 200ms
    slow: number;      // 300ms
    slower: number;    // 500ms
    slowest: number;   // 1000ms
  };
  easing: {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    spring: string;
    bounce: string;
  };
}

export const ANIMATION: AnimationTokens = {
  duration: {
    instant: 0,
    fast: 100,
    normal: 200,
    slow: 300,
    slower: 500,
    slowest: 1000,
  },
  easing: {
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export interface TypographyTokens {
  fontFamily: {
    sans: string;
    mono: string;
  };
  fontSize: {
    xs: number;    // 10px
    sm: number;    // 12px
    md: number;    // 14px
    lg: number;    // 16px
    xl: number;    // 18px
    xxl: number;   // 24px
    xxxl: number;  // 32px
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export const TYPOGRAPHY: TypographyTokens = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  },
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
    xxxl: 32,
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// ============================================================================
// GLASS MORPHISM
// ============================================================================

export interface GlassTokens {
  blur: {
    sm: number;   // 4px
    md: number;   // 8px
    lg: number;   // 16px
    xl: number;   // 24px
  };
  opacity: {
    subtle: number;    // 0.1
    light: number;     // 0.3
    medium: number;    // 0.5
    heavy: number;     // 0.7
    solid: number;     // 0.9
  };
  saturation: number;  // backdrop saturate
}

export const GLASS: GlassTokens = {
  blur: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
  },
  opacity: {
    subtle: 0.1,
    light: 0.3,
    medium: 0.5,
    heavy: 0.7,
    solid: 0.9,
  },
  saturation: 1.8,
} as const;

// ============================================================================
// THEME DEFINITION
// ============================================================================

export type ThemeMode = "light" | "dark" | "system";

export interface SemanticColors {
  // Backgrounds
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
    overlay: string;
  };

  // Text
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
    link: string;
  };

  // Borders
  border: {
    default: string;
    muted: string;
    strong: string;
  };

  // Semantic states
  semantic: {
    info: { bg: string; border: string; text: string; icon: string };
    success: { bg: string; border: string; text: string; icon: string };
    warning: { bg: string; border: string; text: string; icon: string };
    error: { bg: string; border: string; text: string; icon: string };
    neutral: { bg: string; border: string; text: string; icon: string };
  };

  // Interactive
  interactive: {
    primary: string;
    primaryHover: string;
    primaryActive: string;
    secondary: string;
    secondaryHover: string;
    destructive: string;
    destructiveHover: string;
  };
}

export interface CosmoTheme {
  name: string;
  mode: ThemeMode;
  colors: SemanticColors;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  shadows: ShadowTokens;
  animation: AnimationTokens;
  typography: TypographyTokens;
  glass: GlassTokens;
}

// ============================================================================
// LIGHT THEME
// ============================================================================

export const lightTheme: CosmoTheme = {
  name: "cosmo-light",
  mode: "light",
  colors: {
    background: {
      primary: "#ffffff",
      secondary: PRIMITIVE_COLORS.slate[50],
      tertiary: PRIMITIVE_COLORS.slate[100],
      elevated: "#ffffff",
      overlay: "rgba(0, 0, 0, 0.5)",
    },
    text: {
      primary: PRIMITIVE_COLORS.slate[900],
      secondary: PRIMITIVE_COLORS.slate[700],
      muted: PRIMITIVE_COLORS.slate[500],
      inverse: "#ffffff",
      link: PRIMITIVE_COLORS.blue[600],
    },
    border: {
      default: PRIMITIVE_COLORS.slate[200],
      muted: PRIMITIVE_COLORS.slate[100],
      strong: PRIMITIVE_COLORS.slate[300],
    },
    semantic: {
      info: {
        bg: PRIMITIVE_COLORS.blue[50],
        border: PRIMITIVE_COLORS.blue[200],
        text: PRIMITIVE_COLORS.blue[800],
        icon: PRIMITIVE_COLORS.blue[500],
      },
      success: {
        bg: PRIMITIVE_COLORS.green[50],
        border: PRIMITIVE_COLORS.green[200],
        text: PRIMITIVE_COLORS.green[800],
        icon: PRIMITIVE_COLORS.green[500],
      },
      warning: {
        bg: PRIMITIVE_COLORS.amber[50],
        border: PRIMITIVE_COLORS.amber[200],
        text: PRIMITIVE_COLORS.amber[800],
        icon: PRIMITIVE_COLORS.amber[500],
      },
      error: {
        bg: PRIMITIVE_COLORS.red[50],
        border: PRIMITIVE_COLORS.red[200],
        text: PRIMITIVE_COLORS.red[800],
        icon: PRIMITIVE_COLORS.red[500],
      },
      neutral: {
        bg: "#ffffff",
        border: PRIMITIVE_COLORS.slate[200],
        text: PRIMITIVE_COLORS.slate[800],
        icon: PRIMITIVE_COLORS.slate[500],
      },
    },
    interactive: {
      primary: PRIMITIVE_COLORS.blue[500],
      primaryHover: PRIMITIVE_COLORS.blue[600],
      primaryActive: PRIMITIVE_COLORS.blue[700],
      secondary: PRIMITIVE_COLORS.slate[100],
      secondaryHover: PRIMITIVE_COLORS.slate[200],
      destructive: PRIMITIVE_COLORS.red[500],
      destructiveHover: PRIMITIVE_COLORS.red[600],
    },
  },
  spacing: SPACING,
  radius: RADIUS,
  shadows: SHADOWS,
  animation: ANIMATION,
  typography: TYPOGRAPHY,
  glass: GLASS,
};

// ============================================================================
// DARK THEME
// ============================================================================

export const darkTheme: CosmoTheme = {
  name: "cosmo-dark",
  mode: "dark",
  colors: {
    background: {
      primary: PRIMITIVE_COLORS.slate[950],
      secondary: PRIMITIVE_COLORS.slate[900],
      tertiary: PRIMITIVE_COLORS.slate[800],
      elevated: PRIMITIVE_COLORS.slate[800],
      overlay: "rgba(0, 0, 0, 0.7)",
    },
    text: {
      primary: PRIMITIVE_COLORS.slate[50],
      secondary: PRIMITIVE_COLORS.slate[300],
      muted: PRIMITIVE_COLORS.slate[400],
      inverse: PRIMITIVE_COLORS.slate[900],
      link: PRIMITIVE_COLORS.blue[400],
    },
    border: {
      default: PRIMITIVE_COLORS.slate[700],
      muted: PRIMITIVE_COLORS.slate[800],
      strong: PRIMITIVE_COLORS.slate[600],
    },
    semantic: {
      info: {
        bg: "rgba(59, 130, 246, 0.15)",
        border: PRIMITIVE_COLORS.blue[700],
        text: PRIMITIVE_COLORS.blue[300],
        icon: PRIMITIVE_COLORS.blue[400],
      },
      success: {
        bg: "rgba(34, 197, 94, 0.15)",
        border: PRIMITIVE_COLORS.green[700],
        text: PRIMITIVE_COLORS.green[300],
        icon: PRIMITIVE_COLORS.green[400],
      },
      warning: {
        bg: "rgba(245, 158, 11, 0.15)",
        border: PRIMITIVE_COLORS.amber[700],
        text: PRIMITIVE_COLORS.amber[300],
        icon: PRIMITIVE_COLORS.amber[400],
      },
      error: {
        bg: "rgba(239, 68, 68, 0.15)",
        border: PRIMITIVE_COLORS.red[700],
        text: PRIMITIVE_COLORS.red[300],
        icon: PRIMITIVE_COLORS.red[400],
      },
      neutral: {
        bg: PRIMITIVE_COLORS.slate[800],
        border: PRIMITIVE_COLORS.slate[700],
        text: PRIMITIVE_COLORS.slate[200],
        icon: PRIMITIVE_COLORS.slate[400],
      },
    },
    interactive: {
      primary: PRIMITIVE_COLORS.blue[500],
      primaryHover: PRIMITIVE_COLORS.blue[400],
      primaryActive: PRIMITIVE_COLORS.blue[300],
      secondary: PRIMITIVE_COLORS.slate[700],
      secondaryHover: PRIMITIVE_COLORS.slate[600],
      destructive: PRIMITIVE_COLORS.red[500],
      destructiveHover: PRIMITIVE_COLORS.red[400],
    },
  },
  spacing: SPACING,
  radius: RADIUS,
  shadows: {
    ...SHADOWS,
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)",
    glow: "0 0 20px rgba(59, 130, 246, 0.3)",
  },
  animation: ANIMATION,
  typography: TYPOGRAPHY,
  glass: {
    ...GLASS,
    opacity: {
      subtle: 0.15,
      light: 0.25,
      medium: 0.4,
      heavy: 0.6,
      solid: 0.85,
    },
  },
};

// ============================================================================
// AR-OPTIMIZED THEME (High contrast for outdoor/glasses)
// ============================================================================

export const arTheme: CosmoTheme = {
  name: "cosmo-ar",
  mode: "dark",
  colors: {
    background: {
      primary: "rgba(0, 0, 0, 0.7)",
      secondary: "rgba(0, 0, 0, 0.5)",
      tertiary: "rgba(0, 0, 0, 0.3)",
      elevated: "rgba(0, 0, 0, 0.8)",
      overlay: "rgba(0, 0, 0, 0.9)",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.9)",
      muted: "rgba(255, 255, 255, 0.7)",
      inverse: "#000000",
      link: PRIMITIVE_COLORS.cyan[400],
    },
    border: {
      default: "rgba(255, 255, 255, 0.2)",
      muted: "rgba(255, 255, 255, 0.1)",
      strong: "rgba(255, 255, 255, 0.4)",
    },
    semantic: {
      info: {
        bg: "rgba(6, 182, 212, 0.25)",
        border: PRIMITIVE_COLORS.cyan[400],
        text: "#ffffff",
        icon: PRIMITIVE_COLORS.cyan[400],
      },
      success: {
        bg: "rgba(74, 222, 128, 0.25)",
        border: PRIMITIVE_COLORS.green[400],
        text: "#ffffff",
        icon: PRIMITIVE_COLORS.green[400],
      },
      warning: {
        bg: "rgba(251, 191, 36, 0.25)",
        border: PRIMITIVE_COLORS.amber[400],
        text: "#ffffff",
        icon: PRIMITIVE_COLORS.amber[400],
      },
      error: {
        bg: "rgba(248, 113, 113, 0.25)",
        border: PRIMITIVE_COLORS.red[400],
        text: "#ffffff",
        icon: PRIMITIVE_COLORS.red[400],
      },
      neutral: {
        bg: "rgba(255, 255, 255, 0.1)",
        border: "rgba(255, 255, 255, 0.3)",
        text: "#ffffff",
        icon: "rgba(255, 255, 255, 0.8)",
      },
    },
    interactive: {
      primary: PRIMITIVE_COLORS.cyan[400],
      primaryHover: PRIMITIVE_COLORS.cyan[300],
      primaryActive: PRIMITIVE_COLORS.cyan[200],
      secondary: "rgba(255, 255, 255, 0.15)",
      secondaryHover: "rgba(255, 255, 255, 0.25)",
      destructive: PRIMITIVE_COLORS.red[400],
      destructiveHover: PRIMITIVE_COLORS.red[300],
    },
  },
  spacing: SPACING,
  radius: RADIUS,
  shadows: {
    none: "none",
    sm: "0 0 4px rgba(0, 0, 0, 0.5)",
    md: "0 0 8px rgba(0, 0, 0, 0.5)",
    lg: "0 0 16px rgba(0, 0, 0, 0.5)",
    xl: "0 0 24px rgba(0, 0, 0, 0.5)",
    glow: "0 0 16px rgba(6, 182, 212, 0.5)",
    inner: "inset 0 0 4px rgba(0, 0, 0, 0.5)",
  },
  animation: {
    ...ANIMATION,
    // Faster animations for AR to reduce motion sickness
    duration: {
      instant: 0,
      fast: 50,
      normal: 100,
      slow: 150,
      slower: 250,
      slowest: 500,
    },
  },
  typography: {
    ...TYPOGRAPHY,
    // Larger fonts for AR readability
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 22,
      xxl: 28,
      xxxl: 36,
    },
  },
  glass: {
    blur: {
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    opacity: {
      subtle: 0.2,
      light: 0.35,
      medium: 0.5,
      heavy: 0.65,
      solid: 0.8,
    },
    saturation: 1.5,
  },
};

// ============================================================================
// THEME UTILITIES
// ============================================================================

export type ThemeName = "light" | "dark" | "ar" | "custom";

export const themes: Record<Exclude<ThemeName, "custom">, CosmoTheme> = {
  light: lightTheme,
  dark: darkTheme,
  ar: arTheme,
};

export function getTheme(name: ThemeName): CosmoTheme {
  if (name === "custom") {
    return lightTheme; // Fallback
  }
  return themes[name];
}

/**
 * Create a custom theme by merging with a base theme
 */
export function createTheme(
  base: ThemeName,
  overrides: Partial<CosmoTheme>
): CosmoTheme {
  const baseTheme = getTheme(base);
  return {
    ...baseTheme,
    ...overrides,
    colors: {
      ...baseTheme.colors,
      ...(overrides.colors ?? {}),
    },
  } as CosmoTheme;
}

/**
 * Generate CSS variables from theme
 */
export function themeToCSSVariables(theme: CosmoTheme): Record<string, string> {
  const vars: Record<string, string> = {};

  // Colors
  vars["--cosmo-bg-primary"] = theme.colors.background.primary;
  vars["--cosmo-bg-secondary"] = theme.colors.background.secondary;
  vars["--cosmo-bg-tertiary"] = theme.colors.background.tertiary;
  vars["--cosmo-bg-elevated"] = theme.colors.background.elevated;
  vars["--cosmo-bg-overlay"] = theme.colors.background.overlay;

  vars["--cosmo-text-primary"] = theme.colors.text.primary;
  vars["--cosmo-text-secondary"] = theme.colors.text.secondary;
  vars["--cosmo-text-muted"] = theme.colors.text.muted;
  vars["--cosmo-text-inverse"] = theme.colors.text.inverse;
  vars["--cosmo-text-link"] = theme.colors.text.link;

  vars["--cosmo-border-default"] = theme.colors.border.default;
  vars["--cosmo-border-muted"] = theme.colors.border.muted;
  vars["--cosmo-border-strong"] = theme.colors.border.strong;

  // Semantic colors
  for (const [key, value] of Object.entries(theme.colors.semantic)) {
    vars[`--cosmo-${key}-bg`] = value.bg;
    vars[`--cosmo-${key}-border`] = value.border;
    vars[`--cosmo-${key}-text`] = value.text;
    vars[`--cosmo-${key}-icon`] = value.icon;
  }

  // Interactive colors
  vars["--cosmo-interactive-primary"] = theme.colors.interactive.primary;
  vars["--cosmo-interactive-primary-hover"] = theme.colors.interactive.primaryHover;
  vars["--cosmo-interactive-secondary"] = theme.colors.interactive.secondary;
  vars["--cosmo-interactive-destructive"] = theme.colors.interactive.destructive;

  // Spacing
  for (const [key, value] of Object.entries(theme.spacing)) {
    vars[`--cosmo-spacing-${key}`] = `${value}px`;
  }

  // Radius
  for (const [key, value] of Object.entries(theme.radius)) {
    vars[`--cosmo-radius-${key}`] = value === 9999 ? "9999px" : `${value}px`;
  }

  // Shadows
  for (const [key, value] of Object.entries(theme.shadows)) {
    vars[`--cosmo-shadow-${key}`] = value;
  }

  // Animation
  for (const [key, value] of Object.entries(theme.animation.duration)) {
    vars[`--cosmo-duration-${key}`] = `${value}ms`;
  }
  for (const [key, value] of Object.entries(theme.animation.easing)) {
    vars[`--cosmo-easing-${key}`] = value;
  }

  // Typography
  vars["--cosmo-font-sans"] = theme.typography.fontFamily.sans;
  vars["--cosmo-font-mono"] = theme.typography.fontFamily.mono;

  // Glass
  vars["--cosmo-glass-blur-sm"] = `${theme.glass.blur.sm}px`;
  vars["--cosmo-glass-blur-md"] = `${theme.glass.blur.md}px`;
  vars["--cosmo-glass-blur-lg"] = `${theme.glass.blur.lg}px`;
  vars["--cosmo-glass-saturation"] = `${theme.glass.saturation}`;

  return vars;
}

/**
 * Get semantic color for a variant
 */
export function getSemanticColor(
  theme: CosmoTheme,
  variant: "neutral" | "info" | "success" | "warning" | "error"
): { bg: string; border: string; text: string; icon: string } {
  return theme.colors.semantic[variant];
}
