import { useState, useEffect, useRef, useCallback } from "react";
import type { Tooltip as TooltipType } from "@cosmo/core-schema";

export interface TooltipProps {
  tooltip: TooltipType;
  children: React.ReactNode;
}

/**
 * Variant styles
 */
interface VariantStyle {
  bg: string;
  color: string;
  border: string;
}

const VARIANT_STYLES: Record<string, VariantStyle> = {
  dark: {
    bg: "rgba(17, 24, 39, 0.95)",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  light: {
    bg: "rgba(255, 255, 255, 0.95)",
    color: "#111827",
    border: "1px solid rgba(0, 0, 0, 0.1)",
  },
  info: {
    bg: "#3b82f6",
    color: "#fff",
    border: "none",
  },
  warning: {
    bg: "#f59e0b",
    color: "#fff",
    border: "none",
  },
  error: {
    bg: "#ef4444",
    color: "#fff",
    border: "none",
  },
};

/**
 * Get position offset styles
 */
const getPositionStyles = (position: TooltipType["position"]): React.CSSProperties => {
  const offset = "8px";
  switch (position) {
    case "top":
      return { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: offset };
    case "bottom":
      return { top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: offset };
    case "left":
      return { right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: offset };
    case "right":
      return { left: "100%", top: "50%", transform: "translateY(-50%)", marginLeft: offset };
    case "top-left":
      return { bottom: "100%", left: 0, marginBottom: offset };
    case "top-right":
      return { bottom: "100%", right: 0, marginBottom: offset };
    case "bottom-left":
      return { top: "100%", left: 0, marginTop: offset };
    case "bottom-right":
      return { top: "100%", right: 0, marginTop: offset };
    default:
      return { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: offset };
  }
};

/**
 * Get arrow styles
 */
const getArrowStyles = (position: TooltipType["position"], bg: string): React.CSSProperties => {
  const base: React.CSSProperties = {
    position: "absolute",
    width: 0,
    height: 0,
    borderStyle: "solid",
  };

  const arrowSize = "6px";

  switch (position) {
    case "top":
    case "top-left":
    case "top-right":
      return {
        ...base,
        bottom: `-${arrowSize}`,
        left: position === "top" ? "50%" : position === "top-left" ? "12px" : "auto",
        right: position === "top-right" ? "12px" : "auto",
        transform: position === "top" ? "translateX(-50%)" : "none",
        borderWidth: `${arrowSize} ${arrowSize} 0`,
        borderColor: `${bg} transparent transparent`,
      };
    case "bottom":
    case "bottom-left":
    case "bottom-right":
      return {
        ...base,
        top: `-${arrowSize}`,
        left: position === "bottom" ? "50%" : position === "bottom-left" ? "12px" : "auto",
        right: position === "bottom-right" ? "12px" : "auto",
        transform: position === "bottom" ? "translateX(-50%)" : "none",
        borderWidth: `0 ${arrowSize} ${arrowSize}`,
        borderColor: `transparent transparent ${bg}`,
      };
    case "left":
      return {
        ...base,
        right: `-${arrowSize}`,
        top: "50%",
        transform: "translateY(-50%)",
        borderWidth: `${arrowSize} 0 ${arrowSize} ${arrowSize}`,
        borderColor: `transparent transparent transparent ${bg}`,
      };
    case "right":
      return {
        ...base,
        left: `-${arrowSize}`,
        top: "50%",
        transform: "translateY(-50%)",
        borderWidth: `${arrowSize} ${arrowSize} ${arrowSize} 0`,
        borderColor: `transparent ${bg} transparent transparent`,
      };
    default:
      return base;
  }
};

/**
 * Tooltip Web Renderer
 * Info tooltip with hover/click/focus triggers
 */
export function Tooltip({ tooltip, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(tooltip.visible ?? false);
  const showTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  const variant = tooltip.variant || "dark";
  const variantStyle = VARIANT_STYLES[variant]!;
  const positionStyle = getPositionStyles(tooltip.position);
  const arrowStyle = getArrowStyles(tooltip.position, variantStyle.bg);

  const show = useCallback(() => {
    clearTimeout(hideTimeoutRef.current);
    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, tooltip.delayShow ?? 300);
  }, [tooltip.delayShow]);

  const hide = useCallback(() => {
    clearTimeout(showTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, tooltip.delayHide ?? 0);
  }, [tooltip.delayHide]);

  // Update visibility when controlled
  useEffect(() => {
    if (tooltip.trigger === "manual" && tooltip.visible !== undefined) {
      setIsVisible(tooltip.visible);
    }
  }, [tooltip.trigger, tooltip.visible]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      clearTimeout(showTimeoutRef.current);
      clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const triggerProps: Record<string, any> = {};

  if (tooltip.trigger === "hover") {
    triggerProps.onMouseEnter = show;
    triggerProps.onMouseLeave = hide;
  } else if (tooltip.trigger === "click") {
    triggerProps.onClick = () => setIsVisible((v) => !v);
  } else if (tooltip.trigger === "focus") {
    triggerProps.onFocus = show;
    triggerProps.onBlur = hide;
  }

  return (
    <div
      data-cosmo-component="tooltip-wrapper"
      style={{ position: "relative", display: "inline-block" }}
      {...triggerProps}
    >
      {children}

      {isVisible && (
        <div
          data-cosmo-component="tooltip"
          data-position={tooltip.position}
          data-variant={variant}
          role="tooltip"
          style={{
            position: "absolute",
            ...positionStyle,
            padding: "8px 12px",
            borderRadius: "6px",
            backgroundColor: variantStyle.bg,
            color: variantStyle.color,
            border: variantStyle.border,
            fontSize: "13px",
            lineHeight: 1.4,
            maxWidth: tooltip.maxWidth ?? 250,
            whiteSpace: "normal",
            wordWrap: "break-word",
            zIndex: 9999,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            pointerEvents: "none",
            opacity: 1,
            transition: "opacity 0.15s ease",
          }}
        >
          {tooltip.content}
          {tooltip.showArrow !== false && <div style={arrowStyle} />}
        </div>
      )}
    </div>
  );
}
