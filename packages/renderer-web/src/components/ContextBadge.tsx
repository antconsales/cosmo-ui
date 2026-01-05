import { useEffect, useState } from "react";
import type { ContextBadge as ContextBadgeType, ContextBadgePosition } from "@cosmo/core-schema";
import {
  getPositionStyle,
  getPositionTransform,
  getZIndex,
} from "../utils/positioning";

export interface ContextBadgeProps {
  badge: ContextBadgeType;
  onDismiss?: (id: string) => void;
  /** Stack index for multiple badges at same position */
  stackIndex?: number;
}

/**
 * Variant color mapping
 * Minimal, pill-style colors
 */
const VARIANT_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  neutral: {
    bg: "#f3f4f6",
    text: "#374151",
    border: "#e5e7eb",
  },
  info: {
    bg: "#dbeafe",
    text: "#1d4ed8",
    border: "#93c5fd",
  },
  success: {
    bg: "#dcfce7",
    text: "#15803d",
    border: "#86efac",
  },
  warning: {
    bg: "#fef3c7",
    text: "#b45309",
    border: "#fcd34d",
  },
  error: {
    bg: "#fee2e2",
    text: "#dc2626",
    border: "#fca5a5",
  },
};

/**
 * Icon mapping (unicode symbols)
 */
const ICON_MAP: Record<string, string> = {
  none: "",
  info: "ℹ️",
  check: "✓",
  alert: "⚠️",
  error: "✕",
  bell: "🔔",
  clock: "🕐",
  star: "★",
  user: "👤",
  wifi: "📶",
  battery: "🔋",
};

/**
 * Pulse animation keyframes (injected once)
 */
const PULSE_KEYFRAMES = `
@keyframes cosmo-badge-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}
`;

let styleInjected = false;
function injectPulseStyle() {
  if (styleInjected || typeof document === "undefined") return;
  const style = document.createElement("style");
  style.textContent = PULSE_KEYFRAMES;
  document.head.appendChild(style);
  styleInjected = true;
}

/**
 * ContextBadge Web Renderer v0.1
 * - Lightweight pill-style badge
 * - Variant colors or custom contextualColor
 * - Optional icon
 * - Auto-dismiss support
 * - Pulse animation option
 */
export function ContextBadge({ badge, onDismiss, stackIndex = 0 }: ContextBadgeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  // Guard against undefined badge
  if (!badge) return null;

  const variant = badge.variant || "neutral";
  const position = badge.position || "top-right";
  const icon = badge.icon || "none";

  // Calculate stack offset (32px per badge - slightly larger for pill badges)
  const stackOffset = stackIndex * 32;

  // Get styles
  const variantStyle = VARIANT_STYLES[variant] ?? VARIANT_STYLES.neutral!;
  const positionStyle = getPositionStyle(position as ContextBadgePosition);
  const transform = getPositionTransform(position as ContextBadgePosition);

  // Determine stack direction based on position
  const isTopPosition = position.startsWith("top");
  const stackStyle = stackOffset > 0 ? (
    isTopPosition
      ? { marginTop: stackOffset }
      : { marginBottom: stackOffset }
  ) : {};

  // Custom color override
  const bgColor = badge.contextualColor || variantStyle.bg;
  const textColor = badge.contextualColor ? "#ffffff" : variantStyle.text;
  const borderColor = badge.contextualColor || variantStyle.border;

  // Inject pulse animation if needed
  useEffect(() => {
    if (badge.pulse) {
      injectPulseStyle();
    }
  }, [badge.pulse]);

  // Fade in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss timer
  useEffect(() => {
    if (badge.autoDismissMs && badge.autoDismissMs > 0) {
      const hideTimer = setTimeout(() => {
        handleDismiss();
      }, badge.autoDismissMs);

      return () => clearTimeout(hideTimer);
    }
  }, [badge.autoDismissMs]);

  const handleDismiss = () => {
    if (badge.dismissible !== false && onDismiss) {
      setIsVisible(false);
      setTimeout(() => {
        setShouldRender(false);
        onDismiss(badge.id);
      }, 150);
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      data-cosmo-component="context-badge"
      data-variant={variant}
      data-position={position}
      style={{
        position: "fixed",
        ...positionStyle,
        ...stackStyle,
        transform: badge.pulse
          ? `${transform !== "none" ? transform : ""}`
          : transform,
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        borderRadius: "9999px", // Pill shape
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        fontSize: "13px",
        fontWeight: 500,
        color: textColor,
        zIndex: getZIndex(3) - stackIndex,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.15s ease-in-out, margin 0.2s ease-in-out",
        pointerEvents: "auto",
        whiteSpace: "nowrap",
        animation: badge.pulse ? "cosmo-badge-pulse 2s ease-in-out infinite" : "none",
      }}
    >
      {/* Icon */}
      {icon !== "none" && (
        <span
          style={{
            fontSize: "12px",
            lineHeight: 1,
          }}
        >
          {ICON_MAP[icon] || ""}
        </span>
      )}

      {/* Label */}
      <span>{badge.label}</span>

      {/* Dismiss button */}
      {badge.dismissible !== false && (
        <button
          onClick={handleDismiss}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            lineHeight: 1,
            color: textColor,
            opacity: 0.6,
            padding: 0,
            marginLeft: "4px",
            display: "flex",
            alignItems: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.6";
          }}
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
}
