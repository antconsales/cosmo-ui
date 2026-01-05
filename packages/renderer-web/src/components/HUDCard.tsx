/**
 * HUDCard Web Renderer v2.0
 *
 * Fully integrated with:
 * - Theme System (dynamic colors)
 * - Icon System (SVG icons)
 * - Adaptive Complexity (responsive to user context)
 * - Animation tokens
 */

import { useEffect, useState, useMemo, useCallback } from "react";
import type { HUDCard as HUDCardType, HUDCardVariant } from "@cosmo/core-schema";
import { getIcon, iconToSVG } from "@cosmo/core-schema";
import {
  getPositionStyle,
  getPositionTransform,
  getZIndex,
} from "../utils/positioning";
import { useTheme } from "../context/ThemeContext";
import { useAdaptive } from "../context/AdaptiveContext";

// ============================================================================
// TYPES
// ============================================================================

export interface HUDCardProps {
  card: HUDCardType;
  onDismiss?: (id: string) => void;
  onAction?: (cardId: string, actionId: string) => void;
  /** Override theme (for testing/storybook) */
  forceTheme?: "light" | "dark";
  /** Disable animations */
  disableAnimations?: boolean;
}

// ============================================================================
// ICON COMPONENT
// ============================================================================

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

function Icon({ name, size = 18, color = "currentColor" }: IconProps) {
  const iconDef = getIcon(name);

  if (!iconDef || name === "none") {
    return null;
  }

  const svg = iconToSVG(iconDef, size, color);

  return (
    <span
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

// ============================================================================
// HUDCARD COMPONENT
// ============================================================================

export function HUDCard({
  card,
  onDismiss,
  onAction,
  forceTheme: _forceTheme,
  disableAnimations = false,
}: HUDCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  // Get theme and adaptive context (with fallbacks for when not wrapped in provider)
  let theme, adaptive;

  try {
    theme = useTheme();
  } catch {
    // Not wrapped in ThemeProvider, use defaults
    theme = null;
  }

  try {
    adaptive = useAdaptive();
  } catch {
    // Not wrapped in AdaptiveProvider, use defaults
    adaptive = null;
  }

  // Guard against undefined card
  if (!card) return null;

  // Extract card properties with defaults
  const variant: HUDCardVariant = card.variant || "neutral";
  const priority = card.priority || 3;
  const position = card.position || "top-right";
  const icon = card.icon || "none";

  // Get colors from theme or fallback
  const colors = useMemo(() => {
    if (theme) {
      const semantic = theme.theme.colors.semantic[variant];
      return {
        bg: semantic.bg,
        border: semantic.border,
        text: semantic.text,
        icon: semantic.icon,
        textPrimary: theme.theme.colors.text.primary,
        textSecondary: theme.theme.colors.text.secondary,
        textMuted: theme.theme.colors.text.muted,
      };
    }

    // Fallback colors (light theme)
    const defaultFallback = { bg: "#ffffff", border: "#e5e7eb", icon: "#6b7280" };
    const fallbackColors: Record<string, { bg: string; border: string; icon: string }> = {
      neutral: defaultFallback,
      info: { bg: "#eff6ff", border: "#bfdbfe", icon: "#3b82f6" },
      success: { bg: "#f0fdf4", border: "#bbf7d0", icon: "#22c55e" },
      warning: { bg: "#fffbeb", border: "#fde68a", icon: "#f59e0b" },
      error: { bg: "#fef2f2", border: "#fecaca", icon: "#ef4444" },
    };

    const fallback = fallbackColors[variant] ?? defaultFallback;
    return {
      bg: fallback.bg,
      border: fallback.border,
      text: "#111827",
      icon: fallback.icon,
      textPrimary: "#111827",
      textSecondary: "#374151",
      textMuted: "#6b7280",
    };
  }, [theme, variant]);

  // Get animation settings
  const animation = useMemo(() => {
    if (disableAnimations) {
      return { duration: 0, easing: "linear" };
    }

    if (adaptive?.animationsEnabled === false) {
      return { duration: 0, easing: "linear" };
    }

    if (theme) {
      const speed = adaptive?.config.timing.animationSpeed ?? 1;
      return {
        duration: Math.round(theme.theme.animation.duration.normal / speed),
        easing: theme.theme.animation.easing.easeOut,
      };
    }

    return { duration: 200, easing: "cubic-bezier(0, 0, 0.2, 1)" };
  }, [theme, adaptive, disableAnimations]);

  // Get spacing from theme
  const spacing = useMemo(() => {
    if (theme) {
      return theme.theme.spacing;
    }
    return { sm: 8, md: 12, lg: 16 };
  }, [theme]);

  // Get radius from theme
  const radius = useMemo(() => {
    if (theme) {
      return theme.theme.radius.md;
    }
    return 8;
  }, [theme]);

  // Get shadow from theme
  const shadow = useMemo(() => {
    if (theme) {
      return theme.theme.shadows.md;
    }
    return "0 4px 6px rgba(0, 0, 0, 0.1)";
  }, [theme]);

  // Get interactive colors
  const interactiveColors = useMemo(() => {
    if (theme) {
      return theme.theme.colors.interactive;
    }
    return {
      primary: "#3b82f6",
      primaryHover: "#2563eb",
      secondary: "#f3f4f6",
      secondaryHover: "#e5e7eb",
      destructive: "#ef4444",
      destructiveHover: "#dc2626",
    };
  }, [theme]);

  // Check if we should show full content based on adaptive complexity
  const showActions = adaptive?.isFeatureEnabled("showActions") ?? true;
  const showIcons = adaptive?.isFeatureEnabled("showIcons") ?? true;

  // Truncate content based on adaptive settings
  const displayContent = useMemo(() => {
    if (adaptive) {
      const maxLength = adaptive.getMaxTextLength("content");
      if (card.content.length > maxLength) {
        return card.content.slice(0, maxLength - 3) + "...";
      }
    }
    return card.content;
  }, [card.content, adaptive]);

  const displayTitle = useMemo(() => {
    if (adaptive) {
      const maxLength = adaptive.getMaxTextLength("title");
      if (card.title.length > maxLength) {
        return card.title.slice(0, maxLength - 3) + "...";
      }
    }
    return card.title;
  }, [card.title, adaptive]);

  // Position styles
  const positionStyle = getPositionStyle(position);
  const transform = getPositionTransform(position);
  const zIndex = getZIndex(priority);

  // Fade in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Auto-hide timer
  useEffect(() => {
    if (card.autoHideAfterSeconds && priority < 4) {
      const multiplier = adaptive?.config.timing.autoHideMultiplier ?? 1;
      const hideTimer = setTimeout(() => {
        handleDismiss();
      }, card.autoHideAfterSeconds * 1000 * multiplier);

      return () => clearTimeout(hideTimer);
    }
  }, [card.autoHideAfterSeconds, priority, adaptive]);

  const handleDismiss = useCallback(() => {
    if (card.dismissible !== false && onDismiss) {
      setIsVisible(false);
      setTimeout(() => {
        setShouldRender(false);
        onDismiss(card.id);
      }, animation.duration);
    }
  }, [card.dismissible, card.id, onDismiss, animation.duration]);

  const handleAction = useCallback(
    (actionId: string) => {
      onAction?.(card.id, actionId);
    },
    [card.id, onAction]
  );

  if (!shouldRender) return null;

  return (
    <div
      data-cosmo-component="hud-card"
      data-variant={variant}
      data-position={position}
      data-priority={priority}
      role="alert"
      aria-live={priority >= 4 ? "assertive" : "polite"}
      style={{
        position: "fixed",
        ...positionStyle,
        transform,
        padding: `${spacing.lg}px`,
        borderRadius: `${radius}px`,
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        boxShadow: shadow,
        maxWidth: "320px",
        minWidth: "280px",
        zIndex,
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${animation.duration}ms ${animation.easing}`,
        pointerEvents: "auto",
        fontFamily: theme?.theme.typography.fontFamily.sans ?? "system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          marginBottom: `${spacing.sm}px`,
          gap: `${spacing.md}px`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: `${spacing.sm}px` }}>
          {showIcons && icon !== "none" && (
            <Icon name={icon} size={18} color={colors.icon} />
          )}
          <h3
            style={{
              margin: 0,
              fontSize: `${theme?.theme.typography.fontSize.lg ?? 16}px`,
              fontWeight: theme?.theme.typography.fontWeight.semibold ?? 600,
              color: colors.textPrimary,
              lineHeight: theme?.theme.typography.lineHeight.tight ?? 1.25,
            }}
          >
            {displayTitle}
          </h3>
        </div>
        {card.dismissible !== false && (
          <button
            onClick={handleDismiss}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "20px",
              lineHeight: 1,
              color: colors.textMuted,
              padding: 0,
              flexShrink: 0,
              opacity: 0.7,
              transition: `opacity ${animation.duration}ms ${animation.easing}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.7";
            }}
            aria-label="Dismiss notification"
          >
            <Icon name="x" size={18} color={colors.textMuted} />
          </button>
        )}
      </div>

      {/* Content */}
      <p
        style={{
          margin: 0,
          fontSize: `${theme?.theme.typography.fontSize.md ?? 14}px`,
          color: colors.textSecondary,
          lineHeight: theme?.theme.typography.lineHeight.normal ?? 1.5,
        }}
      >
        {displayContent}
      </p>

      {/* Actions */}
      {showActions && card.actions && card.actions.length > 0 && (
        <div
          style={{
            marginTop: `${spacing.md}px`,
            display: "flex",
            gap: `${spacing.sm}px`,
          }}
        >
          {card.actions.map((action) => {
            const isPrimary = action.variant === "primary";
            const isDestructive = action.variant === "destructive";

            const buttonBg = isPrimary
              ? interactiveColors.primary
              : isDestructive
              ? "transparent"
              : "transparent";

            const buttonBorder = isPrimary
              ? "none"
              : isDestructive
              ? `1px solid ${interactiveColors.destructive}`
              : `1px solid ${colors.border}`;

            const buttonColor = isPrimary
              ? "#ffffff"
              : isDestructive
              ? interactiveColors.destructive
              : colors.textSecondary;

            return (
              <button
                key={action.id}
                onClick={() => handleAction(action.id)}
                style={{
                  padding: `${spacing.sm}px ${spacing.md}px`,
                  borderRadius: `${radius - 2}px`,
                  border: buttonBorder,
                  backgroundColor: buttonBg,
                  color: buttonColor,
                  cursor: "pointer",
                  fontSize: `${theme?.theme.typography.fontSize.md ?? 14}px`,
                  fontWeight: theme?.theme.typography.fontWeight.medium ?? 500,
                  transition: `all ${animation.duration}ms ${animation.easing}`,
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  if (isPrimary) {
                    target.style.backgroundColor = interactiveColors.primaryHover;
                  } else if (isDestructive) {
                    target.style.backgroundColor = `${interactiveColors.destructive}15`;
                  } else {
                    target.style.backgroundColor = interactiveColors.secondary;
                  }
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.backgroundColor = buttonBg;
                }}
              >
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// THEMED HUDCARD (with required providers)
// ============================================================================

export interface ThemedHUDCardProps extends HUDCardProps {
  /** Theme mode override */
  themeMode?: "light" | "dark" | "ar";
}

/**
 * HUDCard with theme applied (for use outside CosmoProvider)
 */
export function ThemedHUDCard(props: ThemedHUDCardProps) {
  // This component requires being wrapped in providers
  // It's exported for cases where you want explicit theme control
  return <HUDCard {...props} />;
}
