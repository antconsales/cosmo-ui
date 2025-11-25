/**
 * Timer Component Schema
 * Visual countdown/stopwatch - crucial for wearable productivity
 */

export type TimerMode = "countdown" | "stopwatch" | "pomodoro";

export type TimerState = "idle" | "running" | "paused" | "completed";

export type TimerVariant = "ring" | "digital" | "minimal" | "glass";

export type TimerSize = "small" | "medium" | "large";

export interface TimerPreset {
  id: string;
  label: string;
  seconds: number;
}

export interface Timer {
  /** Unique identifier */
  id: string;
  /** Timer mode */
  mode: TimerMode;
  /** Current state */
  state: TimerState;
  /** Label/name for the timer */
  label?: string;
  /** Total duration in seconds (for countdown) */
  duration: number;
  /** Remaining/elapsed time in seconds */
  remaining: number;
  /** Visual variant */
  variant?: TimerVariant;
  /** Size */
  size?: TimerSize;
  /** Color when running */
  color?: "neutral" | "success" | "warning" | "error" | "info";
  /** Show controls (play/pause/reset) */
  showControls?: boolean;
  /** Vibrate on complete (for wearables) */
  vibrateOnComplete?: boolean;
  /** Sound alert on complete */
  alertOnComplete?: boolean;
  /** Quick presets */
  presets?: TimerPreset[];
}
