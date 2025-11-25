import type { EventCard as EventCardType } from "@cosmo/core-schema";

export interface EventCardProps {
  event: EventCardType;
  onAction?: (eventId: string, actionType: string) => void;
}

const VARIANT_STYLES = {
  default: { width: "300px" },
  compact: { width: "260px" },
  detailed: { width: "360px" },
  glass: { width: "300px" },
};

const COLOR_MAP: Record<string, string> = {
  blue: "#3b82f6",
  green: "#10b981",
  red: "#ef4444",
  yellow: "#f59e0b",
  purple: "#8b5cf6",
  orange: "#f97316",
};

const TYPE_ICONS: Record<string, string> = {
  meeting: "👥",
  reminder: "⏰",
  task: "✓",
  birthday: "🎂",
  travel: "✈️",
  other: "📅",
};

const ACTION_ICONS: Record<string, string> = {
  join: "🔗",
  snooze: "⏰",
  dismiss: "✕",
  directions: "📍",
  call: "📞",
};

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

export function EventCard({ event, onAction }: EventCardProps) {
  if (!event) return null;

  const variant = event.variant || "default";
  const variantStyle = VARIANT_STYLES[variant];
  const color = COLOR_MAP[event.color || "blue"];
  const status = event.status || "upcoming";

  return (
    <div
      data-cosmo-component="event-card"
      style={{
        width: variantStyle.width,
        backgroundColor: variant === "glass" ? "rgba(31, 41, 55, 0.9)" : "#1f2937",
        border: `1px solid #374151`,
        borderLeft: `4px solid ${color}`,
        borderRadius: "12px",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
        ...(variant === "glass" && { backdropFilter: "blur(10px)" }),
        ...(status === "cancelled" && { opacity: 0.6 }),
      }}
    >
      <div style={{ padding: "16px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: `${color}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              flexShrink: 0,
            }}
          >
            {TYPE_ICONS[event.type || "other"]}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#f9fafb",
                ...(status === "cancelled" && { textDecoration: "line-through" }),
              }}
            >
              {event.title}
            </div>
            <div
              style={{
                marginTop: "4px",
                fontSize: "13px",
                color: "#9ca3af",
              }}
            >
              {event.allDay ? (
                formatDate(event.startTime)
              ) : (
                <>
                  {formatTime(event.startTime)}
                  {event.endTime && ` - ${formatTime(event.endTime)}`}
                </>
              )}
            </div>
          </div>

          {/* Minutes Until */}
          {event.minutesUntil !== undefined && status === "upcoming" && (
            <div
              style={{
                padding: "4px 8px",
                backgroundColor: event.minutesUntil <= 15 ? "#fef3c7" : "rgba(255,255,255,0.1)",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 600,
                color: event.minutesUntil <= 15 ? "#92400e" : "#9ca3af",
              }}
            >
              {event.minutesUntil <= 0 ? "Now" : `in ${event.minutesUntil}m`}
            </div>
          )}
        </div>

        {/* Description */}
        {event.description && variant !== "compact" && (
          <div
            style={{
              marginTop: "12px",
              fontSize: "13px",
              color: "#9ca3af",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {event.description}
          </div>
        )}

        {/* Location */}
        {event.location && (
          <div
            style={{
              marginTop: "12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              color: "#6b7280",
            }}
          >
            <span>{event.location.isVirtual ? "🔗" : "📍"}</span>
            <span>{event.location.name}</span>
          </div>
        )}

        {/* Attendees */}
        {event.attendees && event.attendees.length > 0 && variant === "detailed" && (
          <div
            style={{
              marginTop: "12px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", marginRight: "8px" }}>
              {event.attendees.slice(0, 4).map((attendee, idx) => (
                <div
                  key={idx}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: "#374151",
                    border: "2px solid #1f2937",
                    marginLeft: idx > 0 ? "-8px" : 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    color: "#9ca3af",
                    overflow: "hidden",
                  }}
                >
                  {attendee.avatar ? (
                    <img
                      src={attendee.avatar}
                      alt={attendee.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    attendee.name.charAt(0)
                  )}
                </div>
              ))}
            </div>
            {event.attendees.length > 4 && (
              <span style={{ fontSize: "12px", color: "#6b7280" }}>
                +{event.attendees.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        {event.actions && event.actions.length > 0 && (
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              gap: "8px",
            }}
          >
            {event.actions.map((action) => (
              <button
                key={action.id}
                onClick={() => onAction?.(event.id, action.type)}
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: action.type === "join" ? color : "rgba(255,255,255,0.05)",
                  border: "none",
                  borderRadius: "8px",
                  color: action.type === "join" ? "#fff" : "#9ca3af",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                {ACTION_ICONS[action.type]}
                {action.label || action.type}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
