import { useEffect, useState, useRef } from "react";
import type { ProgressRing as ProgressRingType, ProgressRingPosition } from "@cosmo/core-schema";
import type { HUDCardPosition } from "@cosmo/core-schema";
import {
  getPositionStyle,
  getPositionTransform,
  getZIndex,
} from "../utils/positioning";

export interface ProgressRingProps {
  ring: ProgressRingType;
  onDismiss?: (id: string) => void;
  /** Stack index for multiple rings at same position */
  stackIndex?: number;
}

/**
 * Maps ProgressRingPosition to supported positions
 * Handles the "center" position specially
 */
function getRingPositionStyle(position: ProgressRingPosition): ReturnType<typeof getPositionStyle> {
  if (position === "center") {
    return {
      top: "50%",
      left: "50%",
    };
  }
  return getPositionStyle(position as HUDCardPosition);
}

function getRingTransform(position: ProgressRingPosition): string {
  if (position === "center") {
    return "translate(-50%, -50%)";
  }
  return getPositionTransform(position as HUDCardPosition);
}

/**
 * Variant color mapping
 * Consistent with HUDCard and ContextBadge
 */
const VARIANT_COLORS: Record<string, { track: string; progress: string; text: string }> = {
  neutral: {
    track: "#e5e7eb",
    progress: "#6b7280",
    text: "#374151",
  },
  info: {
    track: "#dbeafe",
    progress: "#3b82f6",
    text: "#1d4ed8",
  },
  success: {
    track: "#dcfce7",
    progress: "#22c55e",
    text: "#15803d",
  },
  warning: {
    track: "#fef3c7",
    progress: "#f59e0b",
    text: "#b45309",
  },
  error: {
    track: "#fee2e2",
    progress: "#ef4444",
    text: "#dc2626",
  },
};

/**
 * ProgressRing Web Renderer v0.1
 * - SVG-based circular progress indicator
 * - Smooth animation on value change
 * - Variant colors consistent with other components
 * - Optional center value display
 * - Optional label below ring
 */
export function ProgressRing({ ring, stackIndex = 0 }: ProgressRingProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayedValue, setDisplayedValue] = useState(ring?.value ?? 0);
  const prevValueRef = useRef(ring?.value ?? 0);

  // Guard against undefined ring
  if (!ring) return null;

  const variant = ring.variant || "neutral";
  const position = ring.position || "center";
  const size = ring.size ?? 48;
  const thickness = ring.thickness ?? 6;
  const animated = ring.animated ?? true;

  // Calculate stack offset (size + 16px gap per item)
  const stackOffset = stackIndex * (size + 16);

  // Get colors
  const colors = VARIANT_COLORS[variant] ?? VARIANT_COLORS.neutral!;

  // Position styles - use ring-specific helpers that handle "center"
  const positionStyle = getRingPositionStyle(position);
  const transform = getRingTransform(position);

  // SVG calculations
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.max(0, Math.min(100, displayedValue));
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  // Center point
  const center = size / 2;

  // Animate value changes
  useEffect(() => {
    if (!animated || ring.value === prevValueRef.current) {
      setDisplayedValue(ring.value);
      prevValueRef.current = ring.value;
      return;
    }

    const startValue = prevValueRef.current;
    const endValue = ring.value;
    const duration = 500; // ms
    const startTime = performance.now();

    const animateValue = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * eased;

      setDisplayedValue(Math.round(currentValue));

      if (progress < 1) {
        requestAnimationFrame(animateValue);
      }
    };

    requestAnimationFrame(animateValue);
    prevValueRef.current = ring.value;
  }, [ring.value, animated]);

  // Fade in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Calculate label font size based on ring size
  const valueFontSize = Math.max(10, size * 0.25);
  const labelFontSize = Math.max(10, size * 0.18);

  // Determine stack direction based on position
  const isTopPosition = position.startsWith("top") || position === "center";
  const stackStyle = stackOffset > 0 ? (
    isTopPosition
      ? { marginTop: stackOffset }
      : { marginBottom: stackOffset }
  ) : {};

  return (
    <div
      data-cosmo-component="progress-ring"
      data-variant={variant}
      data-position={position}
      style={{
        position: "fixed",
        ...positionStyle,
        ...stackStyle,
        transform,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        zIndex: getZIndex(3) - stackIndex,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.2s ease-in-out, margin 0.2s ease-in-out",
        pointerEvents: "auto",
      }}
    >
      {/* SVG Ring */}
      <div style={{ position: "relative", width: size, height: size }}>
        <svg
          width={size}
          height={size}
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={colors.track}
            strokeWidth={thickness}
          />

          {/* Progress arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={colors.progress}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: animated ? "stroke-dashoffset 0.5s ease-out" : "none",
            }}
          />
        </svg>

        {/* Center value */}
        {ring.showValue && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: `${valueFontSize}px`,
              fontWeight: 600,
              color: colors.text,
            }}
          >
            {Math.round(clampedValue)}%
          </div>
        )}
      </div>

      {/* Label below ring */}
      {ring.label && (
        <span
          style={{
            fontSize: `${labelFontSize}px`,
            fontWeight: 500,
            color: colors.text,
            textAlign: "center",
            maxWidth: size * 1.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {ring.label}
        </span>
      )}
    </div>
  );
}
