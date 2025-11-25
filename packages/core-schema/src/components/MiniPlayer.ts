/**
 * MiniPlayer Component Schema
 * Compact audio/video controls - essential for wearable media control
 */

export type MiniPlayerState = "playing" | "paused" | "stopped" | "loading" | "buffering";

export type MiniPlayerVariant = "default" | "minimal" | "glass" | "floating";

export type MiniPlayerSize = "small" | "medium" | "large";

export interface MiniPlayerTrack {
  /** Track/video title */
  title: string;
  /** Artist/creator name */
  artist?: string;
  /** Album/collection name */
  album?: string;
  /** Artwork URL */
  artwork?: string;
  /** Duration in seconds */
  duration: number;
}

export interface MiniPlayerProgress {
  /** Current position in seconds */
  current: number;
  /** Buffered position in seconds */
  buffered?: number;
}

export interface MiniPlayer {
  /** Unique identifier */
  id: string;
  /** Current playback state */
  state: MiniPlayerState;
  /** Track information */
  track: MiniPlayerTrack;
  /** Playback progress */
  progress: MiniPlayerProgress;
  /** Volume level 0-100 */
  volume?: number;
  /** Whether shuffle is enabled */
  shuffle?: boolean;
  /** Repeat mode */
  repeat?: "off" | "one" | "all";
  /** Visual variant */
  variant?: MiniPlayerVariant;
  /** Size */
  size?: MiniPlayerSize;
  /** Show progress bar */
  showProgress?: boolean;
  /** Show volume control */
  showVolume?: boolean;
}
