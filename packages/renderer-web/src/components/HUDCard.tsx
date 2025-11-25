import { useEffect, useState } from "react";
import type { HUDCard as HUDCardType } from "@cosmo/core-schema";
import {
  getPositionStyle,
  getPositionTransform,
  getZIndex,
} from "../utils/positioning";

export interface HUDCardProps {
  card: HUDCardType;
  onDismiss?: (id: string) => void;
  onAction?: (cardId: string, actionId: string) => void;
}

/**
 * Variant color mapping
 * Minimal, non-invasive colors
 */
const VARIANT_STYLES: Record<
  string,
  { bg: string; border: string; iconColor: string }
> = {
  neutral: {
    bg: "#ffffff",
    border: "#e5e7eb",
    iconColor: "#6b7280",
  },
  info: {
    bg: "#eff6ff",
    border: "#bfdbfe",
    iconColor: "#3b82f6",
  },
  success: {
    bg: "#f0fdf4",
    border: "#bbf7d0",
    iconColor: "#22c55e",
  },
  warning: {
    bg: "#fffbeb",
    border: "#fde68a",
    iconColor: "#f59e0b",
  },
  error: {
    bg: "#fef2f2",
    border: "#fecaca",
    iconColor: "#ef4444",
  },
};

/**
 * Simple icon mapping (unicode symbols)
 * TODO: Replace with proper icon system in future
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
};

/**
 * HUDCard Web Renderer v0.2
 * - Real positioning based on schema
 * - Auto-hide timer support
 * - Priority-based z-index
 * - Minimal fade animations
 * - Variant colors
 */
export function HUDCard({ card, onDismiss, onAction }: HUDCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  const variant = card.variant || "neutral";
  const priority = card.priority || 3;
  const position = card.position || "top-right";
  const icon = card.icon || "none";

  const variantStyle = VARIANT_STYLES[variant] ?? VARIANT_STYLES.neutral!;
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
      const hideTimer = setTimeout(() => {
        handleDismiss();
      }, card.autoHideAfterSeconds * 1000);

      return () => clearTimeout(hideTimer);
    }
  }, [card.autoHideAfterSeconds, priority]);

  const handleDismiss = () => {
    if (card.dismissible !== false && onDismiss) {
      // Fade out before dismissing
      setIsVisible(false);
      setTimeout(() => {
        setShouldRender(false);
        onDismiss(card.id);
      }, 200); // Match animation duration
    }
  };

  const handleAction = (actionId: string) => {
    if (onAction) {
      onAction(card.id, actionId);
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      data-aura-component="hud-card"
      data-variant={variant}
      data-position={position}
      data-priority={priority}
      style={{
        position: "fixed",
        ...positionStyle,
        transform,
        padding: "16px",
        borderRadius: "8px",
        backgroundColor: variantStyle.bg,
        border: `1px solid ${variantStyle.border}`,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth: "320px",
        minWidth: "280px",
        zIndex,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.2s ease-in-out",
        pointerEvents: "auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          marginBottom: "8px",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {icon !== "none" && (
            <span
              style={{
                fontSize: "18px",
                lineHeight: 1,
                color: variantStyle.iconColor,
              }}
            >
              {ICON_MAP[icon] || ""}
            </span>
          )}
          <h3
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            {card.title}
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
              color: "#9ca3af",
              padding: 0,
              flexShrink: 0,
            }}
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </div>

      {/* Content */}
      <p style={{ margin: 0, fontSize: "14px", color: "#6b7280", lineHeight: "1.5" }}>
        {card.content}
      </p>

      {/* Actions */}
      {card.actions && card.actions.length > 0 && (
        <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
          {card.actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border:
                  action.variant === "primary"
                    ? "none"
                    : action.variant === "destructive"
                    ? "1px solid #fca5a5"
                    : "1px solid #d1d5db",
                backgroundColor:
                  action.variant === "primary"
                    ? "#3b82f6"
                    : action.variant === "destructive"
                    ? "#fee2e2"
                    : "transparent",
                color:
                  action.variant === "primary"
                    ? "#fff"
                    : action.variant === "destructive"
                    ? "#dc2626"
                    : "#374151",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget;
                if (action.variant === "primary") {
                  target.style.backgroundColor = "#2563eb";
                } else if (action.variant === "destructive") {
                  target.style.backgroundColor = "#fecaca";
                } else {
                  target.style.backgroundColor = "#f3f4f6";
                }
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget;
                if (action.variant === "primary") {
                  target.style.backgroundColor = "#3b82f6";
                } else if (action.variant === "destructive") {
                  target.style.backgroundColor = "#fee2e2";
                } else {
                  target.style.backgroundColor = "transparent";
                }
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
