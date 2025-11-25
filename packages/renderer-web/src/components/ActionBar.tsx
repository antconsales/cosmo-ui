import type { ActionBar as ActionBarType, ActionBarIcon } from "@cosmo/core-schema";

export interface ActionBarProps {
  bar: ActionBarType;
  onAction?: (itemId: string) => void;
}

/**
 * Icon mapping (simple unicode/emoji for now)
 */
const ICON_MAP: Record<ActionBarIcon, string> = {
  none: "",
  home: "🏠",
  back: "←",
  forward: "→",
  menu: "☰",
  close: "✕",
  settings: "⚙️",
  search: "🔍",
  share: "↗",
  favorite: "★",
  add: "+",
  remove: "−",
  edit: "✎",
  delete: "🗑",
  refresh: "↻",
  camera: "📷",
  mic: "🎤",
  speaker: "🔊",
};

/**
 * Variant styles
 */
interface VariantStyle {
  bg: string;
  border: string;
  shadow: string;
  backdropFilter?: string;
}

const VARIANT_STYLES: Record<string, VariantStyle> = {
  solid: {
    bg: "rgba(255, 255, 255, 0.95)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    shadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
  },
  glass: {
    bg: "rgba(255, 255, 255, 0.7)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    shadow: "0 -2px 20px rgba(0, 0, 0, 0.15)",
    backdropFilter: "blur(10px)",
  },
  minimal: {
    bg: "transparent",
    border: "none",
    shadow: "none",
  },
};

/**
 * Position styles
 */
const getPositionStyles = (position: ActionBarType["position"]): React.CSSProperties => {
  const base: React.CSSProperties = {
    position: "fixed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px 16px",
    zIndex: 1000,
  };

  switch (position) {
    case "bottom":
      return { ...base, bottom: 0, left: 0, right: 0, flexDirection: "row" };
    case "top":
      return { ...base, top: 0, left: 0, right: 0, flexDirection: "row" };
    case "left":
      return { ...base, left: 0, top: 0, bottom: 0, flexDirection: "column", width: "auto" };
    case "right":
      return { ...base, right: 0, top: 0, bottom: 0, flexDirection: "column", width: "auto" };
    default:
      return { ...base, bottom: 0, left: 0, right: 0, flexDirection: "row" };
  }
};

/**
 * ActionBar Web Renderer
 * Bottom/side action bar with quick-access buttons
 */
export function ActionBar({ bar, onAction }: ActionBarProps) {
  if (bar.visible === false) return null;

  const variant = bar.variant || "solid";
  const variantStyle = VARIANT_STYLES[variant]!;
  const positionStyle = getPositionStyles(bar.position);

  const handleClick = (itemId: string, disabled?: boolean) => {
    if (!disabled && onAction) {
      onAction(itemId);
    }
  };

  return (
    <div
      data-cosmo-component="action-bar"
      data-position={bar.position}
      data-variant={variant}
      style={{
        ...positionStyle,
        backgroundColor: variantStyle.bg,
        border: variantStyle.border,
        boxShadow: variantStyle.shadow,
        ...(variantStyle.backdropFilter && { backdropFilter: variantStyle.backdropFilter }),
      }}
    >
      {bar.items.map((item) => (
        <button
          key={item.id}
          onClick={() => handleClick(item.id, item.disabled)}
          disabled={item.disabled}
          aria-label={item.label}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            padding: "12px 16px",
            minWidth: "56px",
            minHeight: "56px",
            border: "none",
            borderRadius: "12px",
            backgroundColor: item.active ? "rgba(59, 130, 246, 0.1)" : "transparent",
            cursor: item.disabled ? "not-allowed" : "pointer",
            opacity: item.disabled ? 0.5 : 1,
            transition: "all 0.15s ease",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            if (!item.disabled && !item.active) {
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
            }
          }}
          onMouseLeave={(e) => {
            if (!item.disabled) {
              e.currentTarget.style.backgroundColor = item.active
                ? "rgba(59, 130, 246, 0.1)"
                : "transparent";
            }
          }}
        >
          {/* Icon */}
          <span
            style={{
              fontSize: "24px",
              lineHeight: 1,
              color: item.active ? "#3b82f6" : "#374151",
            }}
          >
            {ICON_MAP[item.icon] || "•"}
          </span>

          {/* Label (optional) */}
          {bar.showLabels && (
            <span
              style={{
                fontSize: "10px",
                fontWeight: 500,
                color: item.active ? "#3b82f6" : "#6b7280",
                maxWidth: "60px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </span>
          )}

          {/* Badge */}
          {item.badge !== undefined && item.badge > 0 && (
            <span
              style={{
                position: "absolute",
                top: "4px",
                right: "4px",
                minWidth: "18px",
                height: "18px",
                padding: "0 5px",
                borderRadius: "9px",
                backgroundColor: "#ef4444",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.badge > 99 ? "99+" : item.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
