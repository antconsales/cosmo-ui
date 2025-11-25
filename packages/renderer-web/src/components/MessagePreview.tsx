import type { MessagePreview as MessagePreviewType } from "@cosmo/core-schema";

export interface MessagePreviewProps {
  message: MessagePreviewType;
  onAction?: (messageId: string, actionId: string) => void;
  onDismiss?: (messageId: string) => void;
  onQuickReply?: (messageId: string, reply: string) => void;
}

const VARIANT_STYLES = {
  default: { width: "320px", padding: "16px" },
  compact: { width: "280px", padding: "12px" },
  expanded: { width: "380px", padding: "20px" },
  glass: { width: "320px", padding: "16px" },
};

const PRIORITY_COLORS = {
  low: "#6b7280",
  normal: "#3b82f6",
  high: "#f59e0b",
  urgent: "#ef4444",
};

const TYPE_ICONS = {
  text: "💬",
  image: "🖼",
  voice: "🎤",
  video: "🎥",
  file: "📎",
};

const ACTION_ICONS: Record<string, string> = {
  reply: "↩",
  archive: "📥",
  delete: "🗑",
  mute: "🔕",
  call: "📞",
  video: "🎥",
};

export function MessagePreview({
  message,
  onAction,
  onDismiss,
  onQuickReply,
}: MessagePreviewProps) {
  if (!message) return null;

  const variant = message.variant || "default";
  const priority = message.priority || "normal";
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <div
      data-cosmo-component="message-preview"
      style={{
        width: variantStyle.width,
        padding: variantStyle.padding,
        backgroundColor: variant === "glass" ? "rgba(31, 41, 55, 0.9)" : "#1f2937",
        border: `1px solid ${message.read ? "#374151" : PRIORITY_COLORS[priority]}`,
        borderRadius: "12px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        ...(variant === "glass" && { backdropFilter: "blur(10px)" }),
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        {/* Avatar */}
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            backgroundColor: "#374151",
            overflow: "hidden",
            position: "relative",
            flexShrink: 0,
          }}
        >
          {message.sender.avatar ? (
            <img
              src={message.sender.avatar}
              alt={message.sender.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                color: "#9ca3af",
              }}
            >
              {message.sender.name.charAt(0).toUpperCase()}
            </div>
          )}
          {/* Online indicator */}
          {message.sender.online && (
            <div
              style={{
                position: "absolute",
                bottom: "2px",
                right: "2px",
                width: "10px",
                height: "10px",
                backgroundColor: "#10b981",
                borderRadius: "50%",
                border: "2px solid #1f2937",
              }}
            />
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#f9fafb",
              }}
            >
              {message.sender.name}
            </span>
            {message.sender.verified && (
              <span style={{ color: "#3b82f6", fontSize: "12px" }}>✓</span>
            )}
            {message.app && (
              <span
                style={{
                  fontSize: "11px",
                  color: "#6b7280",
                  padding: "2px 6px",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderRadius: "4px",
                }}
              >
                {message.app}
              </span>
            )}
          </div>
          <div
            style={{
              marginTop: "4px",
              fontSize: "13px",
              color: "#d1d5db",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {TYPE_ICONS[message.type]} {message.content}
          </div>
          <div
            style={{
              marginTop: "6px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "11px",
              color: "#6b7280",
            }}
          >
            <span>{message.timestamp}</span>
            {message.unreadCount && message.unreadCount > 1 && (
              <span
                style={{
                  padding: "2px 6px",
                  backgroundColor: PRIORITY_COLORS[priority],
                  borderRadius: "10px",
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                {message.unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* Dismiss */}
        {onDismiss && (
          <button
            onClick={() => onDismiss(message.id)}
            style={{
              width: "24px",
              height: "24px",
              backgroundColor: "transparent",
              border: "none",
              borderRadius: "50%",
              color: "#6b7280",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Quick Replies */}
      {message.quickReplies && message.quickReplies.length > 0 && (
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {message.quickReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => onQuickReply?.(message.id, reply)}
              style={{
                padding: "6px 12px",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: "16px",
                color: "#3b82f6",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Actions */}
      {message.actions && message.actions.length > 0 && (
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            gap: "8px",
            borderTop: "1px solid #374151",
            paddingTop: "12px",
          }}
        >
          {message.actions.map((action) => (
            <button
              key={action.id}
              onClick={() => onAction?.(message.id, action.id)}
              style={{
                flex: 1,
                padding: "8px",
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "none",
                borderRadius: "8px",
                color: "#9ca3af",
                fontSize: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              {action.icon && ACTION_ICONS[action.icon]}
              {action.label || action.id}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
