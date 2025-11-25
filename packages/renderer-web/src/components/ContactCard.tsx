import type { ContactCard as ContactCardType } from "@cosmo/core-schema";

export interface ContactCardProps {
  contact: ContactCardType;
  onAction?: (contactId: string, actionType: string) => void;
}

const VARIANT_STYLES = {
  default: { width: "280px", padding: "16px" },
  compact: { width: "240px", padding: "12px" },
  detailed: { width: "320px", padding: "20px" },
  glass: { width: "280px", padding: "16px" },
};

const STATUS_COLORS = {
  online: "#10b981",
  offline: "#6b7280",
  busy: "#ef4444",
  away: "#f59e0b",
  dnd: "#ef4444",
};

const ACTION_ICONS: Record<string, string> = {
  call: "📞",
  message: "💬",
  video: "🎥",
  email: "✉️",
  location: "📍",
  favorite: "⭐",
};

export function ContactCard({ contact, onAction }: ContactCardProps) {
  if (!contact) return null;

  const variant = contact.variant || "default";
  const variantStyle = VARIANT_STYLES[variant];
  const statusColor = contact.status ? STATUS_COLORS[contact.status] : STATUS_COLORS.offline;

  return (
    <div
      data-cosmo-component="contact-card"
      style={{
        width: variantStyle.width,
        padding: variantStyle.padding,
        backgroundColor: variant === "glass" ? "rgba(31, 41, 55, 0.9)" : "#1f2937",
        border: "1px solid #374151",
        borderRadius: "16px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        ...(variant === "glass" && { backdropFilter: "blur(10px)" }),
      }}
    >
      {/* Avatar & Basic Info */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: variant === "detailed" ? "64px" : "48px",
            height: variant === "detailed" ? "64px" : "48px",
            borderRadius: "50%",
            backgroundColor: "#374151",
            overflow: "hidden",
            position: "relative",
            flexShrink: 0,
          }}
        >
          {contact.avatar ? (
            <img
              src={contact.avatar}
              alt={contact.name}
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
                fontSize: variant === "detailed" ? "24px" : "20px",
                color: "#9ca3af",
                fontWeight: 600,
              }}
            >
              {contact.name.charAt(0).toUpperCase()}
            </div>
          )}
          {/* Status indicator */}
          {contact.status && (
            <div
              style={{
                position: "absolute",
                bottom: "2px",
                right: "2px",
                width: "12px",
                height: "12px",
                backgroundColor: statusColor,
                borderRadius: "50%",
                border: "2px solid #1f2937",
              }}
            />
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#f9fafb",
              }}
            >
              {contact.name}
            </span>
            {contact.favorite && (
              <span style={{ color: "#fbbf24", fontSize: "14px" }}>⭐</span>
            )}
          </div>
          {contact.title && (
            <div style={{ fontSize: "13px", color: "#9ca3af" }}>
              {contact.title}
            </div>
          )}
          {contact.organization && (
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              {contact.organization}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Info */}
      {variant === "detailed" && (
        <div style={{ marginTop: "16px", fontSize: "13px" }}>
          {contact.phone && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ color: "#6b7280" }}>📞</span>
              <span style={{ color: "#d1d5db" }}>{contact.phone}</span>
            </div>
          )}
          {contact.email && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ color: "#6b7280" }}>✉️</span>
              <span style={{ color: "#d1d5db" }}>{contact.email}</span>
            </div>
          )}
          {contact.location && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#6b7280" }}>📍</span>
              <span style={{ color: "#d1d5db" }}>{contact.location}</span>
            </div>
          )}
        </div>
      )}

      {/* Last Seen */}
      {contact.lastSeen && (
        <div
          style={{
            marginTop: "12px",
            fontSize: "11px",
            color: "#6b7280",
          }}
        >
          Last seen: {contact.lastSeen}
        </div>
      )}

      {/* Actions */}
      {contact.actions && contact.actions.length > 0 && (
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            gap: "8px",
            justifyContent: "center",
          }}
        >
          {contact.actions.map((action) => (
            <button
              key={action.id}
              onClick={() => onAction?.(contact.id, action.type)}
              title={action.label || action.type}
              style={{
                width: "44px",
                height: "44px",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: "12px",
                color: "#3b82f6",
                cursor: "pointer",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {ACTION_ICONS[action.type] || "•"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
