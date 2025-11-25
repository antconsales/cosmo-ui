import type { WeatherWidget as WeatherWidgetType, WeatherCondition } from "@cosmo/core-schema";

export interface WeatherWidgetProps {
  weather: WeatherWidgetType;
  onRefresh?: () => void;
}

const VARIANT_STYLES = {
  default: { width: "240px", padding: "16px" },
  compact: { width: "180px", padding: "12px" },
  detailed: { width: "320px", padding: "20px" },
  glass: { width: "240px", padding: "16px" },
};

const CONDITION_ICONS: Record<WeatherCondition, string> = {
  clear: "☀️",
  "partly-cloudy": "⛅",
  cloudy: "☁️",
  rain: "🌧️",
  "heavy-rain": "⛈️",
  thunderstorm: "🌩️",
  snow: "🌨️",
  sleet: "🌧️",
  fog: "🌫️",
  windy: "💨",
  hail: "🌨️",
};

export function WeatherWidget({ weather, onRefresh }: WeatherWidgetProps) {
  if (!weather) return null;

  const variant = weather.variant || "default";
  const size = weather.size || "medium";
  const variantStyle = VARIANT_STYLES[variant];
  const unit = weather.unit || "celsius";
  const unitSymbol = unit === "celsius" ? "°C" : "°F";

  return (
    <div
      data-cosmo-component="weather-widget"
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
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: "13px", color: "#9ca3af" }}>
          📍 {weather.location}
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#6b7280",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ↻
          </button>
        )}
      </div>

      {/* Main */}
      <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ fontSize: size === "small" ? "36px" : "48px" }}>
          {CONDITION_ICONS[weather.condition]}
        </div>
        <div>
          <div
            style={{
              fontSize: size === "small" ? "32px" : "42px",
              fontWeight: 600,
              color: "#f9fafb",
              lineHeight: 1,
            }}
          >
            {Math.round(weather.temperature)}{unitSymbol}
          </div>
          {weather.feelsLike !== undefined && (
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              Feels like {Math.round(weather.feelsLike)}{unitSymbol}
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      {variant !== "compact" && (
        <div
          style={{
            marginTop: "16px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
          }}
        >
          {weather.humidity !== undefined && (
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>
              💧 {weather.humidity}%
            </div>
          )}
          {weather.windSpeed !== undefined && (
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>
              💨 {weather.windSpeed} km/h
            </div>
          )}
          {weather.uvIndex !== undefined && (
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>
              ☀️ UV {weather.uvIndex}
            </div>
          )}
          {weather.airQuality !== undefined && (
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>
              🌬️ AQI {weather.airQuality}
            </div>
          )}
        </div>
      )}

      {/* Hourly Forecast */}
      {variant === "detailed" && weather.hourlyForecast && weather.hourlyForecast.length > 0 && (
        <div
          style={{
            marginTop: "16px",
            paddingTop: "16px",
            borderTop: "1px solid #374151",
          }}
        >
          <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "8px" }}>
            HOURLY
          </div>
          <div style={{ display: "flex", gap: "12px", overflowX: "auto" }}>
            {weather.hourlyForecast.slice(0, 5).map((hour, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: "40px",
                }}
              >
                <div style={{ fontSize: "11px", color: "#6b7280" }}>{hour.time}</div>
                <div style={{ fontSize: "20px", margin: "4px 0" }}>
                  {CONDITION_ICONS[hour.condition]}
                </div>
                <div style={{ fontSize: "13px", fontWeight: 500, color: "#f9fafb" }}>
                  {Math.round(hour.temperature)}°
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Forecast */}
      {variant === "detailed" && weather.dailyForecast && weather.dailyForecast.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "8px" }}>
            THIS WEEK
          </div>
          {weather.dailyForecast.slice(0, 4).map((day, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 0",
              }}
            >
              <div style={{ fontSize: "13px", color: "#9ca3af", width: "60px" }}>
                {day.date}
              </div>
              <div style={{ fontSize: "18px" }}>{CONDITION_ICONS[day.condition]}</div>
              <div style={{ fontSize: "13px", color: "#f9fafb" }}>
                {Math.round(day.high)}° / {Math.round(day.low)}°
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sunrise/Sunset */}
      {variant !== "compact" && (weather.sunrise || weather.sunset) && (
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            fontSize: "11px",
            color: "#6b7280",
          }}
        >
          {weather.sunrise && <span>🌅 {weather.sunrise}</span>}
          {weather.sunset && <span>🌇 {weather.sunset}</span>}
        </div>
      )}

      {/* Updated */}
      {weather.updatedAt && (
        <div
          style={{
            marginTop: "12px",
            fontSize: "10px",
            color: "#4b5563",
            textAlign: "center",
          }}
        >
          Updated {weather.updatedAt}
        </div>
      )}
    </div>
  );
}
