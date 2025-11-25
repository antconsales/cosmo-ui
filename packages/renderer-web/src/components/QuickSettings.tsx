import type { QuickSettings as QuickSettingsType, QuickSettingType } from "@cosmo/core-schema";

export interface QuickSettingsProps {
  settings: QuickSettingsType;
  onToggle?: (settingId: string, enabled: boolean) => void;
}

const SETTING_ICONS: Record<QuickSettingType, string> = {
  wifi: "📶",
  bluetooth: "🔵",
  airplane: "✈️",
  dnd: "🔕",
  flashlight: "🔦",
  location: "📍",
  "battery-saver": "🔋",
  "dark-mode": "🌙",
  rotation: "🔄",
  hotspot: "📡",
  nfc: "📱",
  sync: "🔄",
  mute: "🔇",
  vibrate: "📳",
  brightness: "🔆",
  volume: "🔊",
  "screen-timeout": "💡",
  custom: "⚙️",
};

const SETTING_LABELS: Record<QuickSettingType, string> = {
  wifi: "Wi-Fi",
  bluetooth: "Bluetooth",
  airplane: "Airplane",
  dnd: "DND",
  flashlight: "Flashlight",
  location: "Location",
  "battery-saver": "Battery",
  "dark-mode": "Dark",
  rotation: "Rotation",
  hotspot: "Hotspot",
  nfc: "NFC",
  sync: "Sync",
  mute: "Mute",
  vibrate: "Vibrate",
  brightness: "Brightness",
  volume: "Volume",
  "screen-timeout": "Screen",
  custom: "Custom",
};

export function QuickSettings({ settings, onToggle }: QuickSettingsProps) {
  if (!settings || !settings.items) return null;

  const variant = settings.variant || "default";
  const layout = settings.layout || "grid";
  const columns = settings.columns || 4;

  return (
    <div
      data-cosmo-component="quick-settings"
      style={{
        width: layout === "list" ? "280px" : `${columns * 80 + (columns - 1) * 8 + 24}px`,
        padding: "12px",
        backgroundColor: variant === "glass" ? "rgba(31, 41, 55, 0.95)" : "#1f2937",
        border: "1px solid #374151",
        borderRadius: "16px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        ...(variant === "glass" && { backdropFilter: "blur(10px)" }),
      }}
    >
      {/* Header */}
      {(settings.title || settings.batteryLevel !== undefined) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
            paddingBottom: "12px",
            borderBottom: "1px solid #374151",
          }}
        >
          {settings.title && (
            <span style={{ fontSize: "14px", fontWeight: 500, color: "#f9fafb" }}>
              {settings.title}
            </span>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {settings.currentTime && (
              <span style={{ fontSize: "14px", color: "#9ca3af" }}>
                {settings.currentTime}
              </span>
            )}
            {settings.batteryLevel !== undefined && (
              <span
                style={{
                  fontSize: "12px",
                  color: settings.batteryLevel <= 20 ? "#ef4444" : "#9ca3af",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                🔋 {settings.batteryLevel}%
              </span>
            )}
          </div>
        </div>
      )}

      {/* Grid Layout */}
      {(layout === "grid" || layout === "row") && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: layout === "row" ? `repeat(${settings.items.length}, 1fr)` : `repeat(${columns}, 1fr)`,
            gap: "8px",
          }}
        >
          {settings.items.map((item) => (
            <button
              key={item.id}
              onClick={() => onToggle?.(item.id, !item.enabled)}
              disabled={item.available === false}
              style={{
                width: "72px",
                height: settings.showLabels !== false ? "76px" : "64px",
                padding: "8px 4px",
                backgroundColor: item.enabled ? "rgba(59, 130, 246, 0.2)" : "rgba(255,255,255,0.05)",
                border: item.enabled ? "1px solid rgba(59, 130, 246, 0.5)" : "1px solid transparent",
                borderRadius: "12px",
                cursor: item.available === false ? "not-allowed" : "pointer",
                opacity: item.available === false ? 0.4 : 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontSize: "24px" }}>
                {item.icon || SETTING_ICONS[item.type]}
              </span>
              {settings.showLabels !== false && (
                <span
                  style={{
                    fontSize: "10px",
                    color: item.enabled ? "#3b82f6" : "#9ca3af",
                    textAlign: "center",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "100%",
                  }}
                >
                  {item.label || SETTING_LABELS[item.type]}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* List Layout */}
      {layout === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {settings.items.map((item) => (
            <button
              key={item.id}
              onClick={() => onToggle?.(item.id, !item.enabled)}
              disabled={item.available === false}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                backgroundColor: item.enabled ? "rgba(59, 130, 246, 0.1)" : "transparent",
                border: "none",
                borderRadius: "8px",
                cursor: item.available === false ? "not-allowed" : "pointer",
                opacity: item.available === false ? 0.4 : 1,
                width: "100%",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "20px" }}>
                {item.icon || SETTING_ICONS[item.type]}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", color: "#f9fafb" }}>
                  {item.label || SETTING_LABELS[item.type]}
                </div>
                {item.subtitle && (
                  <div style={{ fontSize: "11px", color: "#6b7280" }}>
                    {item.subtitle}
                  </div>
                )}
              </div>
              <div
                style={{
                  width: "40px",
                  height: "24px",
                  backgroundColor: item.enabled ? "#3b82f6" : "#374151",
                  borderRadius: "12px",
                  position: "relative",
                  transition: "background-color 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "2px",
                    left: item.enabled ? "18px" : "2px",
                    transition: "left 0.15s ease",
                  }}
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
