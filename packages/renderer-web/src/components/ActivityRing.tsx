import type { ActivityRing as ActivityRingType } from "@cosmo/core-schema";

export interface ActivityRingProps {
  ring: ActivityRingType;
  onRingClick?: (ringId: string) => void;
}

const COLOR_MAP: Record<string, string> = {
  red: "#ef4444",
  green: "#10b981",
  blue: "#3b82f6",
  yellow: "#f59e0b",
  purple: "#8b5cf6",
  orange: "#f97316",
  pink: "#ec4899",
};

const SIZE_STYLES = {
  small: { size: 120, strokeWidth: 8, innerRadius: 36 },
  medium: { size: 160, strokeWidth: 10, innerRadius: 48 },
  large: { size: 200, strokeWidth: 12, innerRadius: 60 },
};

const ICON_MAP: Record<string, string> = {
  move: "🔥",
  exercise: "🏃",
  stand: "🧍",
  steps: "👟",
  heart: "❤️",
  calories: "🔥",
  distance: "📏",
  custom: "⚡",
};

export function ActivityRing({ ring, onRingClick }: ActivityRingProps) {
  if (!ring || !ring.rings) return null;

  const variant = ring.variant || "default";
  const size = ring.size || "medium";
  const sizeStyle = SIZE_STYLES[size];
  const strokeWidth = ring.strokeWidth || sizeStyle.strokeWidth;

  // Calculate ring positions (outer to inner)
  const centerX = sizeStyle.size / 2;
  const centerY = sizeStyle.size / 2;
  const rings = ring.rings.slice(0, 4); // Max 4 rings
  const ringGap = strokeWidth + 4;

  return (
    <div
      data-cosmo-component="activity-ring"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "16px",
        backgroundColor: variant === "glass" ? "rgba(31, 41, 55, 0.9)" : "transparent",
        borderRadius: variant === "glass" ? "16px" : 0,
        ...(variant === "glass" && { backdropFilter: "blur(10px)" }),
      }}
    >
      {/* Title */}
      {ring.title && (
        <div
          style={{
            marginBottom: "4px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#f9fafb",
          }}
        >
          {ring.title}
        </div>
      )}

      {/* Subtitle */}
      {ring.subtitle && (
        <div
          style={{
            marginBottom: "12px",
            fontSize: "12px",
            color: "#6b7280",
          }}
        >
          {ring.subtitle}
        </div>
      )}

      {/* Rings SVG */}
      <div style={{ position: "relative", width: sizeStyle.size, height: sizeStyle.size }}>
        <svg width={sizeStyle.size} height={sizeStyle.size}>
          {rings.map((ringData, idx) => {
            const radius = sizeStyle.size / 2 - strokeWidth / 2 - idx * ringGap;
            const circumference = 2 * Math.PI * radius;
            const progress = Math.min((ringData.current / ringData.goal) * 100, 100);
            const strokeDashoffset = circumference - (progress / 100) * circumference;
            const color = COLOR_MAP[ringData.color] || "#3b82f6";

            return (
              <g key={ringData.id}>
                {/* Background */}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth={strokeWidth}
                />
                {/* Progress */}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={radius}
                  fill="none"
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform={`rotate(-90 ${centerX} ${centerY})`}
                  style={{
                    transition: ring.animated !== false ? "stroke-dashoffset 0.5s ease" : "none",
                    cursor: onRingClick ? "pointer" : "default",
                  }}
                  onClick={() => onRingClick?.(ringData.id)}
                />
              </g>
            );
          })}
        </svg>

        {/* Center Content */}
        {ring.showLabels && rings.length === 1 && rings[0] && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "28px" }}>
              {ICON_MAP[rings[0].icon || "custom"]}
            </div>
            {ring.showPercentage && (
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: COLOR_MAP[rings[0].color],
                }}
              >
                {Math.round((rings[0].current / rings[0].goal) * 100)}%
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ring Labels */}
      {(ring.showLabels || ring.showGoals) && (
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            width: "100%",
          }}
        >
          {rings.map((ringData) => {
            const progress = Math.min((ringData.current / ringData.goal) * 100, 100);
            const color = COLOR_MAP[ringData.color] || "#3b82f6";

            return (
              <div
                key={ringData.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: color,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: "13px", color: "#f9fafb" }}>
                      {ICON_MAP[ringData.icon || "custom"]} {ringData.label}
                    </span>
                    {ring.showPercentage && (
                      <span style={{ fontSize: "13px", fontWeight: 600, color }}>
                        {Math.round(progress)}%
                      </span>
                    )}
                  </div>
                  {ring.showGoals && (
                    <div style={{ fontSize: "11px", color: "#6b7280" }}>
                      {ringData.current.toLocaleString()} / {ringData.goal.toLocaleString()}
                      {ringData.unit && ` ${ringData.unit}`}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
