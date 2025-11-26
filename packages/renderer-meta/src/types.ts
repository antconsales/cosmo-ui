/**
 * Meta Ray-Ban Display types for Cosmo UI
 *
 * Based on Meta Wearables Device Access Toolkit specifications
 * Ready for when Display API becomes available (expected 2026)
 */

// ============================================
// Display Configuration
// ============================================

export interface MetaDisplayConfig {
  /** Display position in field of view */
  position: "top-right" | "top-left" | "center" | "bottom-right" | "bottom-left";

  /** Display size constraint (the Ray-Ban display is small) */
  maxWidth: number; // in display units
  maxHeight: number;

  /** Brightness level (0-1) */
  brightness: number;

  /** Auto-dim in bright environments */
  autoDim: boolean;

  /** Transparency level (0-1, for AR overlay) */
  transparency: number;
}

export const DEFAULT_DISPLAY_CONFIG: MetaDisplayConfig = {
  position: "top-right",
  maxWidth: 200,
  maxHeight: 100,
  brightness: 0.8,
  autoDim: true,
  transparency: 0.9,
};

// ============================================
// Neural Band Gestures
// ============================================

export type NeuralBandGesture =
  | "pinch" // Thumb + index finger
  | "double-pinch" // Quick double pinch
  | "fist" // Close hand
  | "open-palm" // Open hand
  | "swipe-left" // Wrist rotation left
  | "swipe-right" // Wrist rotation right
  | "hold" // Sustained pinch
  | "release"; // Release any gesture

export interface GestureEvent {
  gesture: NeuralBandGesture;
  confidence: number; // 0-1
  duration?: number; // ms, for "hold" gestures
  timestamp: number;
}

export interface GestureMapping {
  /** Gesture to trigger primary action (e.g., dismiss, confirm) */
  primaryAction: NeuralBandGesture;
  /** Gesture to trigger secondary action */
  secondaryAction?: NeuralBandGesture;
  /** Gesture to dismiss/close */
  dismiss: NeuralBandGesture;
  /** Gesture to navigate to next item */
  next?: NeuralBandGesture;
  /** Gesture to navigate to previous item */
  previous?: NeuralBandGesture;
}

export const DEFAULT_GESTURE_MAPPING: GestureMapping = {
  primaryAction: "pinch",
  secondaryAction: "double-pinch",
  dismiss: "swipe-right",
  next: "swipe-right",
  previous: "swipe-left",
};

// ============================================
// Audio Feedback
// ============================================

export type AudioFeedbackType =
  | "notification" // Short chime
  | "success" // Positive tone
  | "error" // Warning tone
  | "tap" // Subtle click
  | "voice"; // TTS output

export interface AudioFeedback {
  type: AudioFeedbackType;
  /** Volume level (0-1) */
  volume: number;
  /** For voice type: text to speak */
  text?: string;
  /** For voice type: speech rate (0.5-2) */
  speechRate?: number;
}

// ============================================
// Render Context
// ============================================

export interface MetaRenderContext {
  /** Display configuration */
  display: MetaDisplayConfig;

  /** Current gesture mapping */
  gestures: GestureMapping;

  /** Whether the display is currently visible */
  isDisplayActive: boolean;

  /** Current ambient light level (0-1) */
  ambientLight: number;

  /** Whether user is currently looking at display area */
  isUserFocused: boolean;

  /** Battery level (0-1) */
  batteryLevel: number;

  /** Connected to companion app */
  isConnected: boolean;
}

// ============================================
// Component Render Output
// ============================================

export interface MetaRenderOutput {
  /** Serialized display data for Meta SDK */
  displayData: unknown; // Will be typed when SDK is available

  /** Audio feedback to play */
  audio?: AudioFeedback;

  /** Gesture handlers */
  onGesture?: (event: GestureEvent) => void;

  /** Auto-dismiss timeout (ms) */
  autoDismissAfter?: number;

  /** Priority for display queue */
  priority: number;
}
