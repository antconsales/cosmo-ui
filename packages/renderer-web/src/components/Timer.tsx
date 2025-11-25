import type { Timer as TimerType } from "@cosmo/core-schema";

export interface TimerProps {
  timer: TimerType;
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  onPreset?: (presetId: string) => void;
}

const SIZE_STYLES = {
  small: { size: 120, fontSize: "24px" },
  medium: { size: 160, fontSize: "32px" },
  large: { size: 200, fontSize: "40px" },
};

const COLOR_MAP = {
  neutral: "#6b7280",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
};

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function Timer({ timer, onStart, onPause, onReset }: TimerProps) {
  if (!timer) return null;

  const variant = timer.variant || "ring";
  const size = timer.size || "medium";
  const sizeStyle = SIZE_STYLES[size];
  const color = COLOR_MAP[timer.color || "info"];
  const progress = timer.mode === "countdown"
    ? (timer.remaining / timer.duration) * 100
    : ((timer.duration - timer.remaining) / timer.duration) * 100;

  const circumference = 2 * Math.PI * (sizeStyle.size / 2 - 8);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      data-cosmo-component="timer"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Label */}
      {timer.label && (
        <div
          style={{
            marginBottom: "8px",
            fontSize: "14px",
            color: "#9ca3af",
            fontWeight: 500,
          }}
        >
          {timer.label}
        </div>
      )}

      {/* Ring Timer */}
      {variant === "ring" && (
        <div
          style={{
            position: "relative",
            width: sizeStyle.size,
            height: sizeStyle.size,
          }}
        >
          <svg width={sizeStyle.size} height={sizeStyle.size}>
            {/* Background circle */}
            <circle
              cx={sizeStyle.size / 2}
              cy={sizeStyle.size / 2}
              r={sizeStyle.size / 2 - 8}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx={sizeStyle.size / 2}
              cy={sizeStyle.size / 2}
              r={sizeStyle.size / 2 - 8}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90 ${sizeStyle.size / 2} ${sizeStyle.size / 2})`}
              style={{ transition: "stroke-dashoffset 0.3s ease" }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: sizeStyle.fontSize,
              fontWeight: 600,
              color: "#f9fafb",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatTime(timer.remaining)}
          </div>
        </div>
      )}

      {/* Digital Timer */}
      {(variant === "digital" || variant === "minimal" || variant === "glass") && (
        <div
          style={{
            padding: "16px 32px",
            backgroundColor: variant === "glass" ? "rgba(31, 41, 55, 0.8)" : "#1f2937",
            borderRadius: "12px",
            ...(variant === "glass" && { backdropFilter: "blur(10px)" }),
          }}
        >
          <div
            style={{
              fontSize: sizeStyle.fontSize,
              fontWeight: 600,
              color: timer.state === "running" ? color : "#f9fafb",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatTime(timer.remaining)}
          </div>
        </div>
      )}

      {/* Controls */}
      {timer.showControls !== false && (
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            gap: "12px",
          }}
        >
          {timer.state === "running" ? (
            <button
              onClick={onPause}
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#374151",
                border: "none",
                borderRadius: "50%",
                color: "#fff",
                cursor: "pointer",
                fontSize: "20px",
              }}
            >
              ⏸
            </button>
          ) : (
            <button
              onClick={onStart}
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: color,
                border: "none",
                borderRadius: "50%",
                color: "#fff",
                cursor: "pointer",
                fontSize: "20px",
              }}
            >
              ▶
            </button>
          )}
          <button
            onClick={onReset}
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: "#374151",
              border: "none",
              borderRadius: "50%",
              color: "#fff",
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            ↻
          </button>
        </div>
      )}

      {/* State indicator */}
      {timer.state === "completed" && (
        <div
          style={{
            marginTop: "12px",
            padding: "8px 16px",
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            borderRadius: "8px",
            color: "#10b981",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          ✓ Complete!
        </div>
      )}
    </div>
  );
}
