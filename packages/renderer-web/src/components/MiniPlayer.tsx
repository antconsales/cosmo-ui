import type { MiniPlayer as MiniPlayerType } from "@cosmo/core-schema";

export interface MiniPlayerProps {
  player: MiniPlayerType;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onSeek?: (position: number) => void;
}

const VARIANT_STYLES = {
  default: { bg: "#1f2937", border: "#374151" },
  minimal: { bg: "transparent", border: "transparent" },
  glass: { bg: "rgba(31, 41, 55, 0.8)", border: "rgba(255,255,255,0.1)" },
  floating: { bg: "#1f2937", border: "#374151" },
};

const SIZE_STYLES = {
  small: { width: "280px", artwork: "48px" },
  medium: { width: "320px", artwork: "56px" },
  large: { width: "380px", artwork: "72px" },
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function MiniPlayer({
  player,
  onPlay,
  onPause,
  onNext,
  onPrev,
}: MiniPlayerProps) {
  if (!player) return null;

  const variant = player.variant || "default";
  const size = player.size || "medium";
  const variantStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.default;
  const sizeStyle = SIZE_STYLES[size];
  const progress = (player.progress.current / player.track.duration) * 100;

  return (
    <div
      data-cosmo-component="mini-player"
      style={{
        width: sizeStyle.width,
        backgroundColor: variantStyle.bg,
        border: `1px solid ${variantStyle.border}`,
        borderRadius: "12px",
        padding: "12px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        ...(variant === "glass" && { backdropFilter: "blur(10px)" }),
        ...(variant === "floating" && { boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Artwork */}
        {player.track.artwork && (
          <img
            src={player.track.artwork}
            alt={player.track.title}
            style={{
              width: sizeStyle.artwork,
              height: sizeStyle.artwork,
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
        )}

        {/* Track Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#f9fafb",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {player.track.title}
          </div>
          {player.track.artist && (
            <div
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {player.track.artist}
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={onPrev}
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "transparent",
              border: "none",
              borderRadius: "50%",
              color: "#9ca3af",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ⏮
          </button>
          <button
            onClick={player.state === "playing" ? onPause : onPlay}
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#3b82f6",
              border: "none",
              borderRadius: "50%",
              color: "#fff",
              cursor: "pointer",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {player.state === "playing" ? "⏸" : "▶"}
          </button>
          <button
            onClick={onNext}
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "transparent",
              border: "none",
              borderRadius: "50%",
              color: "#9ca3af",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ⏭
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {player.showProgress !== false && (
        <div style={{ marginTop: "12px" }}>
          <div
            style={{
              height: "4px",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: "#3b82f6",
                borderRadius: "2px",
                transition: "width 0.1s linear",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "4px",
              fontSize: "10px",
              color: "#6b7280",
            }}
          >
            <span>{formatTime(player.progress.current)}</span>
            <span>{formatTime(player.track.duration)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
