import { useEffect, useState } from "react";
import type { StatusIndicator as StatusIndicatorType, StatusIndicatorPosition } from "@cosmo/core-schema";
import type { HUDCardPosition } from "@cosmo/core-schema";
import {
  getPositionStyle,
  getPositionTransform,
  getZIndex,
} from "../utils/positioning";

export interface StatusIndicatorProps {
  indicator: StatusIndicatorType;
  onDismiss?: (id: string) => void;
}

/**
 * Maps StatusIndicatorPosition to supported positions
 * Handles the "center" position specially
 */
function getIndicatorPositionStyle(position: StatusIndicatorPosition): ReturnType<typeof getPositionStyle> {
  if (position === "center") {
    return {
      top: "50%",
      left: "50%",
    };
  }
  return getPositionStyle(position as HUDCardPosition);
}

function getIndicatorTransform(position: StatusIndicatorPosition): string {
  if (position === "center") {
    return "translate(-50%, -50%)";
  }
  return getPositionTransform(position as HUDCardPosition);
}

/**
 * State color mapping
 * Maps semantic states to visual colors
 */
const STATE_COLORS: Record<string, { main: string; glow: string }> = {
  idle: {
    main: "#9ca3af",  // Gray-400
    glow: "rgba(156, 163, 175, 0.5)",
  },
  active: {
    main: "#3b82f6",  // Blue-500
    glow: "rgba(59, 130, 246, 0.5)",
  },
  loading: {
    main: "#3b82f6",  // Blue-500 (with pulse)
    glow: "rgba(59, 130, 246, 0.5)",
  },
  success: {
    main: "#22c55e",  // Green-500
    glow: "rgba(34, 197, 94, 0.5)",
  },
  warning: {
    main: "#f59e0b",  // Amber-500
    glow: "rgba(245, 158, 11, 0.5)",
  },
  error: {
    main: "#ef4444",  // Red-500
    glow: "rgba(239, 68, 68, 0.5)",
  },
};

/**
 * Pulse animation keyframes (injected once)
 */
const PULSE_KEYFRAMES = `
@keyframes cosmo-indicator-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.15); }
}

@keyframes cosmo-indicator-glow-pulse {
  0%, 100% { box-shadow: 0 0 4px 2px var(--glow-color); }
  50% { box-shadow: 0 0 8px 4px var(--glow-color); }
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
 * StatusIndicator Web Renderer v0.1
 * - Minimal dot indicator for status display
 * - State-based colors (idle, active, loading, success, warning, error)
 * - Pulse animation for loading/active states
 * - Optional glow effect
 * - Optional label next to indicator
 */
export function StatusIndicator({ indicator }: StatusIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Guard against undefined indicator
  if (!indicator) return null;

  const state = indicator.state || "idle";
  const position = indicator.position || "top-right";
  const size = indicator.size ?? 12;
  const shouldPulse = indicator.pulse ?? (state === "loading");
  const showGlow = indicator.glow ?? false;

  // Get colors
  const colors = STATE_COLORS[state] ?? STATE_COLORS.idle!;

  // Position styles - use indicator-specific helpers that handle "center"
  const positionStyle = getIndicatorPositionStyle(position);
  const transform = getIndicatorTransform(position);

  // Inject pulse animation if needed
  useEffect(() => {
    if (shouldPulse || showGlow) {
      injectPulseStyle();
    }
  }, [shouldPulse, showGlow]);

  // Fade in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Calculate label font size based on indicator size
  const labelFontSize = Math.max(10, size * 0.9);

  return (
    <div
      data-cosmo-component="status-indicator"
      data-state={state}
      data-position={position}
      style={{
        position: "fixed",
        ...positionStyle,
        transform,
        display: "inline-flex",
        alignItems: "center",
        gap: `${size * 0.5}px`,
        zIndex: getZIndex(2),
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.2s ease-in-out",
        pointerEvents: "auto",
      }}
    >
      {/* Indicator dot */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: colors.main,
          boxShadow: showGlow ? `0 0 ${size * 0.5}px ${size * 0.25}px ${colors.glow}` : "none",
          animation: shouldPulse ? "cosmo-indicator-pulse 1.5s ease-in-out infinite" : "none",
          // CSS custom property for glow animation
          ["--glow-color" as string]: colors.glow,
        }}
      />

      {/* Optional label */}
      {indicator.label && (
        <span
          style={{
            fontSize: `${labelFontSize}px`,
            fontWeight: 500,
            color: "#374151", // Gray-700
            whiteSpace: "nowrap",
          }}
        >
          {indicator.label}
        </span>
      )}
    </div>
  );
}
