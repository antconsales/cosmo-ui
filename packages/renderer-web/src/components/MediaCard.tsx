import type { MediaCard as MediaCardType } from "@cosmo/core-schema";

export interface MediaCardProps {
  card: MediaCardType;
  onAction?: (cardId: string, actionId: string) => void;
  onDismiss?: (cardId: string) => void;
}

const SIZE_STYLES = {
  small: { width: "200px", imageHeight: "120px" },
  medium: { width: "300px", imageHeight: "180px" },
  large: { width: "400px", imageHeight: "240px" },
};

const VARIANT_STYLES = {
  default: { bg: "#1f2937", border: "#374151" },
  featured: { bg: "#1e1b4b", border: "#4f46e5" },
  minimal: { bg: "transparent", border: "transparent" },
  glass: { bg: "rgba(31, 41, 55, 0.8)", border: "rgba(255,255,255,0.1)" },
};

const ACTION_ICONS: Record<string, string> = {
  play: "▶",
  pause: "⏸",
  share: "↗",
  save: "🔖",
  open: "↗",
  download: "⬇",
  favorite: "❤",
};

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function MediaCard({ card, onAction, onDismiss }: MediaCardProps) {
  if (!card) return null;

  const size = card.size || "medium";
  const variant = card.variant || "default";
  const sizeStyle = SIZE_STYLES[size];
  const variantStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.default;

  return (
    <div
      data-cosmo-component="media-card"
      style={{
        width: sizeStyle.width,
        backgroundColor: variantStyle.bg,
        border: `1px solid ${variantStyle.border}`,
        borderRadius: "12px",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
        ...(variant === "glass" && { backdropFilter: "blur(10px)" }),
      }}
    >
      {/* Media */}
      <div
        style={{
          width: "100%",
          height: sizeStyle.imageHeight,
          backgroundColor: "#0a0a0a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {card.media.url && (
          <img
            src={card.type === "video" ? card.media.thumbnail || card.media.url : card.media.url}
            alt={card.media.alt || card.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}

        {/* Duration badge for video/audio */}
        {card.metadata?.duration && (
          <span
            style={{
              position: "absolute",
              bottom: "8px",
              right: "8px",
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            {formatDuration(card.metadata.duration)}
          </span>
        )}

        {/* Play button for video */}
        {card.type === "video" && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "48px",
              height: "48px",
              backgroundColor: "rgba(0,0,0,0.6)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "20px",
            }}
          >
            ▶
          </div>
        )}

        {/* Dismiss button */}
        {card.dismissible && onDismiss && (
          <button
            onClick={() => onDismiss(card.id)}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "24px",
              height: "24px",
              backgroundColor: "rgba(0,0,0,0.6)",
              border: "none",
              borderRadius: "50%",
              color: "#fff",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "12px" }}>
        <h3
          style={{
            margin: 0,
            fontSize: "14px",
            fontWeight: 600,
            color: "#f9fafb",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {card.title}
        </h3>

        {card.description && (
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "12px",
              color: "#9ca3af",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {card.description}
          </p>
        )}

        {/* Metadata */}
        {card.metadata && (
          <div
            style={{
              marginTop: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "11px",
              color: "#6b7280",
            }}
          >
            {card.metadata.source && <span>{card.metadata.source}</span>}
            {card.metadata.views !== undefined && (
              <span>{card.metadata.views.toLocaleString()} views</span>
            )}
            {card.metadata.timestamp && <span>{card.metadata.timestamp}</span>}
          </div>
        )}

        {/* Actions */}
        {card.actions && card.actions.length > 0 && (
          <div
            style={{
              marginTop: "12px",
              display: "flex",
              gap: "8px",
            }}
          >
            {card.actions.map((action) => (
              <button
                key={action.id}
                onClick={() => onAction?.(card.id, action.id)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: "6px",
                  color: "#f9fafb",
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {action.icon && ACTION_ICONS[action.icon]}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
