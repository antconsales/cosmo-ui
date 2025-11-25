import type { DirectionArrow as DirectionArrowType } from "@cosmo/core-schema";

export interface DirectionArrowProps {
  arrow: DirectionArrowType;
  onNavigate?: () => void;
}

const SIZE_STYLES = {
  small: { size: 80, arrowSize: 32, fontSize: "12px" },
  medium: { size: 120, arrowSize: 48, fontSize: "14px" },
  large: { size: 160, arrowSize: 64, fontSize: "16px" },
};

const COLOR_MAP: Record<string, string> = {
  blue: "#3b82f6",
  green: "#10b981",
  orange: "#f97316",
  red: "#ef4444",
};

const MODE_ICONS: Record<string, string> = {
  walking: "🚶",
  driving: "🚗",
  cycling: "🚴",
  transit: "🚌",
};

function formatDistance(distance: number, unit: string = "meters"): string {
  if (unit === "meters" || unit === "feet") {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)} ${unit === "meters" ? "km" : "mi"}`;
    }
    return `${Math.round(distance)} ${unit === "meters" ? "m" : "ft"}`;
  }
  return `${distance.toFixed(1)} ${unit}`;
}

function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function DirectionArrow({ arrow, onNavigate }: DirectionArrowProps) {
  if (!arrow) return null;

  const variant = arrow.variant || "default";
  const size = arrow.size || "medium";
  const sizeStyle = SIZE_STYLES[size];
  const color = COLOR_MAP[arrow.color || "blue"];

  return (
    <div
      data-cosmo-component="direction-arrow"
      onClick={onNavigate}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px",
        backgroundColor: variant === "glass" || variant === "ar"
          ? "rgba(31, 41, 55, 0.85)"
          : variant === "minimal"
          ? "transparent"
          : "#1f2937",
        border: variant === "minimal" ? "none" : "1px solid #374151",
        borderRadius: "16px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        cursor: onNavigate ? "pointer" : "default",
        ...(variant === "glass" && { backdropFilter: "blur(10px)" }),
        ...(variant === "ar" && { boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" }),
      }}
    >
      {/* Compass/Arrow Container */}
      <div
        style={{
          position: "relative",
          width: sizeStyle.size,
          height: sizeStyle.size,
        }}
      >
        {/* Compass Ring */}
        {arrow.showCompass && (
          <svg width={sizeStyle.size} height={sizeStyle.size}>
            <circle
              cx={sizeStyle.size / 2}
              cy={sizeStyle.size / 2}
              r={sizeStyle.size / 2 - 4}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            {/* Cardinal directions */}
            {["N", "E", "S", "W"].map((dir, idx) => {
              const angle = idx * 90 - 90;
              const rad = (angle * Math.PI) / 180;
              const x = sizeStyle.size / 2 + (sizeStyle.size / 2 - 16) * Math.cos(rad);
              const y = sizeStyle.size / 2 + (sizeStyle.size / 2 - 16) * Math.sin(rad);
              return (
                <text
                  key={dir}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={dir === "N" ? "#ef4444" : "#6b7280"}
                  fontSize="10"
                  fontWeight={dir === "N" ? "bold" : "normal"}
                >
                  {dir}
                </text>
              );
            })}
          </svg>
        )}

        {/* Arrow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) rotate(${arrow.bearing}deg)`,
            width: sizeStyle.arrowSize,
            height: sizeStyle.arrowSize,
            transition: "transform 0.3s ease",
          }}
        >
          <svg viewBox="0 0 24 24" width="100%" height="100%">
            <path
              d="M12 2L4 20L12 16L20 20L12 2Z"
              fill={color}
              stroke={color}
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Pulse effect for close destinations */}
        {arrow.pulse && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: sizeStyle.arrowSize + 20,
              height: sizeStyle.arrowSize + 20,
              borderRadius: "50%",
              border: `2px solid ${color}`,
              opacity: 0.5,
              animation: "pulse 1.5s infinite",
            }}
          />
        )}
      </div>

      {/* Distance */}
      <div
        style={{
          marginTop: "12px",
          fontSize: size === "large" ? "24px" : "20px",
          fontWeight: 600,
          color: "#f9fafb",
        }}
      >
        {formatDistance(arrow.distance, arrow.distanceUnit)}
      </div>

      {/* Destination */}
      <div
        style={{
          marginTop: "4px",
          fontSize: sizeStyle.fontSize,
          color: "#9ca3af",
          textAlign: "center",
          maxWidth: "200px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {arrow.destination.name}
      </div>

      {/* ETA */}
      {arrow.showETA !== false && arrow.estimatedTime && (
        <div
          style={{
            marginTop: "8px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            color: "#6b7280",
          }}
        >
          {arrow.mode && MODE_ICONS[arrow.mode]}
          <span>{formatTime(arrow.estimatedTime)}</span>
        </div>
      )}

      {/* Current Instruction */}
      {arrow.instruction && variant !== "minimal" && (
        <div
          style={{
            marginTop: "12px",
            padding: "8px 16px",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#93c5fd",
            textAlign: "center",
          }}
        >
          {arrow.instruction}
        </div>
      )}

      {/* Next Instruction */}
      {arrow.nextInstruction && variant === "detailed" && (
        <div
          style={{
            marginTop: "8px",
            fontSize: "11px",
            color: "#6b7280",
          }}
        >
          Then: {arrow.nextInstruction}
        </div>
      )}

      {/* Pulse animation keyframes */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
            100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}
