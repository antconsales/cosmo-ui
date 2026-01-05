/**
 * Cosmo UI Biometric Feedback System v1.0
 *
 * React to user's biometric signals from AR glasses and wearables:
 * eye tracking, attention, stress levels, heart rate, etc.
 */

// ============================================================================
// EYE TRACKING
// ============================================================================

/**
 * Eye tracking data point
 */
export interface EyeTrackingData {
  /** Gaze point in normalized screen coordinates (0-1) */
  gaze: {
    x: number;
    y: number;
  };

  /** Gaze point in world space (AR only) */
  worldGaze?: {
    x: number;
    y: number;
    z: number;
  };

  /** Gaze direction vector */
  direction?: {
    x: number;
    y: number;
    z: number;
  };

  /** Pupil dilation (normalized 0-1) */
  pupilDilation?: number;

  /** Blink state */
  blink?: {
    isBlinking: boolean;
    blinkRate: number;  // Blinks per minute
  };

  /** Eye openness (0-1, 0 = closed, 1 = fully open) */
  eyeOpenness?: {
    left: number;
    right: number;
  };

  /** Confidence in tracking (0-1) */
  confidence: number;

  /** Timestamp */
  timestamp: number;
}

/**
 * Gaze focus state
 */
export type GazeFocusState =
  | "focused"       // Looking at specific point
  | "scanning"      // Scanning the view
  | "distracted"    // Looking away
  | "drowsy"        // Eyes drooping
  | "unknown";

/**
 * Derived attention metrics
 */
export interface AttentionMetrics {
  /** Current focus state */
  focusState: GazeFocusState;

  /** Focus duration on current target (ms) */
  focusDuration: number;

  /** Attention score (0-1) */
  attentionScore: number;

  /** Engagement score (0-1) */
  engagementScore: number;

  /** Time since last blink (ms) */
  timeSinceLastBlink: number;

  /** Average blink rate (per minute) */
  averageBlinkRate: number;

  /** Fatigue indicator (0-1) */
  fatigueLevel: number;

  /** Component currently being looked at */
  focusedComponentId?: string;
}

// ============================================================================
// PHYSIOLOGICAL SIGNALS
// ============================================================================

/**
 * Heart rate data
 */
export interface HeartRateData {
  /** Current heart rate (BPM) */
  bpm: number;

  /** Heart rate variability (ms) */
  hrv?: number;

  /** Resting heart rate for comparison */
  restingBpm?: number;

  /** Zone classification */
  zone: "rest" | "fat-burn" | "cardio" | "peak";

  /** Trend over last minute */
  trend: "stable" | "increasing" | "decreasing";

  /** Confidence (0-1) */
  confidence: number;

  /** Timestamp */
  timestamp: number;
}

/**
 * Stress indicators
 */
export interface StressIndicators {
  /** Overall stress level (0-1) */
  level: number;

  /** Stress classification */
  classification: "relaxed" | "normal" | "elevated" | "high" | "very-high";

  /** Contributing factors */
  factors: {
    heartRateElevation: number;
    lowHRV: number;
    pupilDilation: number;
    blinkRateChange: number;
  };

  /** Recovery recommendation */
  recommendation?: "take-break" | "breathe" | "reduce-stimuli" | "none";

  /** Timestamp */
  timestamp: number;
}

/**
 * Physical activity state
 */
export interface ActivityState {
  /** Current activity type */
  type: "stationary" | "walking" | "running" | "cycling" | "driving" | "unknown";

  /** Steps in current session */
  steps?: number;

  /** Calories burned */
  calories?: number;

  /** Distance traveled (meters) */
  distance?: number;

  /** Movement intensity (0-1) */
  intensity: number;

  /** Confidence (0-1) */
  confidence: number;

  /** Timestamp */
  timestamp: number;
}

// ============================================================================
// BIOMETRIC CONTEXT
// ============================================================================

/**
 * Complete biometric context
 */
export interface BiometricContext {
  /** Eye tracking data */
  eyeTracking?: EyeTrackingData;

  /** Attention metrics */
  attention?: AttentionMetrics;

  /** Heart rate data */
  heartRate?: HeartRateData;

  /** Stress indicators */
  stress?: StressIndicators;

  /** Activity state */
  activity?: ActivityState;

  /** Device capabilities */
  capabilities: {
    hasEyeTracking: boolean;
    hasHeartRate: boolean;
    hasActivityTracking: boolean;
  };

  /** Data freshness (ms since last update) */
  dataAge: number;

  /** Last update timestamp */
  lastUpdate: number;
}

// ============================================================================
// BIOMETRIC-REACTIVE UI
// ============================================================================

/**
 * How UI should react to biometric signals
 */
export interface BiometricReaction {
  /** Trigger condition */
  trigger: BiometricTrigger;

  /** Action to take */
  action: BiometricAction;

  /** Cooldown between triggers (ms) */
  cooldown?: number;

  /** Minimum duration for trigger (ms) */
  minDuration?: number;

  /** Maximum triggers per session */
  maxTriggers?: number;
}

/**
 * Trigger conditions for biometric reactions
 */
export type BiometricTrigger =
  | { type: "attention-low"; threshold: number }
  | { type: "attention-high"; threshold: number }
  | { type: "stress-high"; threshold: number }
  | { type: "stress-low"; threshold: number }
  | { type: "fatigue-detected"; threshold: number }
  | { type: "gaze-on-component"; componentId: string; duration: number }
  | { type: "gaze-away"; duration: number }
  | { type: "heart-rate-elevated"; threshold: number }
  | { type: "blink-rate-low"; threshold: number }
  | { type: "drowsiness-detected" }
  | { type: "activity-change"; from?: string; to: string };

/**
 * Actions to take on biometric trigger
 */
export type BiometricAction =
  | { type: "highlight" }           // Highlight the component
  | { type: "dim" }                 // Dim the component
  | { type: "expand" }              // Expand for more info
  | { type: "collapse" }            // Collapse to reduce load
  | { type: "announce" }            // Voice announce
  | { type: "dismiss" }             // Auto-dismiss
  | { type: "priority-boost" }      // Increase priority
  | { type: "priority-reduce" }     // Decrease priority
  | { type: "simplify" }            // Reduce complexity
  | { type: "move"; zone: string }  // Move to different zone
  | { type: "haptic"; pattern: string }
  | { type: "custom"; callback: string };

// ============================================================================
// GAZE INTERACTION
// ============================================================================

/**
 * Gaze-based interaction config
 */
export interface GazeInteractionConfig {
  /** Enable gaze-to-focus */
  gazeToFocus: boolean;

  /** Dwell time for gaze activation (ms) */
  dwellTime: number;

  /** Gaze area padding (px or degrees) */
  gazePadding: number;

  /** Show gaze cursor/indicator */
  showGazeCursor: boolean;

  /** Gaze cursor style */
  gazeCursorStyle?: "dot" | "ring" | "highlight" | "none";

  /** Enable gaze scroll */
  gazeScroll?: boolean;

  /** Actions on gaze events */
  actions?: {
    onGazeEnter?: string;
    onGazeExit?: string;
    onGazeDwell?: string;
    onGazeLongDwell?: string;
  };
}

/**
 * Default gaze interaction config
 */
export const DEFAULT_GAZE_CONFIG: GazeInteractionConfig = {
  gazeToFocus: true,
  dwellTime: 800,
  gazePadding: 20,
  showGazeCursor: true,
  gazeCursorStyle: "ring",
  gazeScroll: false,
};

// ============================================================================
// BIOMETRIC-ADAPTIVE PRESETS
// ============================================================================

/**
 * Preset reactions for common scenarios
 */
export const BIOMETRIC_PRESETS: Record<string, BiometricReaction[]> = {
  /** For notifications - react to attention */
  notification: [
    {
      trigger: { type: "attention-low", threshold: 0.3 },
      action: { type: "highlight" },
      cooldown: 5000,
    },
    {
      trigger: { type: "gaze-on-component", componentId: "self", duration: 2000 },
      action: { type: "expand" },
    },
    {
      trigger: { type: "gaze-away", duration: 10000 },
      action: { type: "dismiss" },
      minDuration: 10000,
    },
  ],

  /** For alerts - ensure attention */
  alert: [
    {
      trigger: { type: "attention-low", threshold: 0.5 },
      action: { type: "announce" },
      cooldown: 10000,
    },
    {
      trigger: { type: "gaze-away", duration: 5000 },
      action: { type: "haptic", pattern: "attention" },
      cooldown: 5000,
    },
  ],

  /** For content - reduce cognitive load */
  content: [
    {
      trigger: { type: "stress-high", threshold: 0.7 },
      action: { type: "simplify" },
    },
    {
      trigger: { type: "fatigue-detected", threshold: 0.6 },
      action: { type: "collapse" },
    },
  ],

  /** For wellness - respond to stress */
  wellness: [
    {
      trigger: { type: "stress-high", threshold: 0.8 },
      action: { type: "priority-boost" },
    },
    {
      trigger: { type: "heart-rate-elevated", threshold: 120 },
      action: { type: "announce" },
    },
  ],
};

// ============================================================================
// BIOMETRIC UTILITIES
// ============================================================================

/**
 * Calculate attention score from eye tracking
 */
export function calculateAttentionScore(eyeData: EyeTrackingData): number {
  let score = 1.0;

  // Reduce for low confidence
  score *= eyeData.confidence;

  // Reduce for blinking
  if (eyeData.blink?.isBlinking) {
    score *= 0.5;
  }

  // Reduce for low eye openness
  if (eyeData.eyeOpenness) {
    const avgOpenness = (eyeData.eyeOpenness.left + eyeData.eyeOpenness.right) / 2;
    if (avgOpenness < 0.5) {
      score *= avgOpenness * 2;
    }
  }

  return Math.max(0, Math.min(1, score));
}

/**
 * Detect drowsiness from biometric data
 */
export function detectDrowsiness(
  eyeData: EyeTrackingData,
  blinkHistory: number[] // Array of blink rates over time
): number {
  let drowsinessScore = 0;

  // Check eye openness
  if (eyeData.eyeOpenness) {
    const avgOpenness = (eyeData.eyeOpenness.left + eyeData.eyeOpenness.right) / 2;
    if (avgOpenness < 0.6) {
      drowsinessScore += (0.6 - avgOpenness) * 2;
    }
  }

  // Check blink rate increase
  if (blinkHistory.length >= 2) {
    const recent = blinkHistory[blinkHistory.length - 1] ?? 0;
    const baseline = blinkHistory.slice(0, -1).reduce((a, b) => a + b, 0) / (blinkHistory.length - 1);
    if (recent > baseline * 1.5) {
      drowsinessScore += 0.3;
    }
  }

  // Very slow blinks indicate fatigue
  if (eyeData.blink && eyeData.blink.blinkRate < 10) {
    drowsinessScore += 0.2;
  }

  return Math.max(0, Math.min(1, drowsinessScore));
}

/**
 * Calculate stress level from multiple signals
 */
export function calculateStressLevel(
  heartRate?: HeartRateData,
  eyeData?: EyeTrackingData
): StressIndicators {
  const factors = {
    heartRateElevation: 0,
    lowHRV: 0,
    pupilDilation: 0,
    blinkRateChange: 0,
  };

  // Heart rate contribution
  if (heartRate) {
    const restingBpm = heartRate.restingBpm ?? 70;
    if (heartRate.bpm > restingBpm * 1.3) {
      factors.heartRateElevation = Math.min(1, (heartRate.bpm - restingBpm) / 40);
    }
    if (heartRate.hrv && heartRate.hrv < 30) {
      factors.lowHRV = (30 - heartRate.hrv) / 30;
    }
  }

  // Eye tracking contribution
  if (eyeData) {
    if (eyeData.pupilDilation && eyeData.pupilDilation > 0.6) {
      factors.pupilDilation = (eyeData.pupilDilation - 0.6) * 2.5;
    }
    if (eyeData.blink && eyeData.blink.blinkRate > 25) {
      factors.blinkRateChange = Math.min(1, (eyeData.blink.blinkRate - 25) / 20);
    }
  }

  // Calculate overall level
  const level =
    factors.heartRateElevation * 0.4 +
    factors.lowHRV * 0.3 +
    factors.pupilDilation * 0.2 +
    factors.blinkRateChange * 0.1;

  // Classify
  let classification: StressIndicators["classification"];
  let recommendation: StressIndicators["recommendation"];

  if (level < 0.2) {
    classification = "relaxed";
    recommendation = "none";
  } else if (level < 0.4) {
    classification = "normal";
    recommendation = "none";
  } else if (level < 0.6) {
    classification = "elevated";
    recommendation = "breathe";
  } else if (level < 0.8) {
    classification = "high";
    recommendation = "take-break";
  } else {
    classification = "very-high";
    recommendation = "reduce-stimuli";
  }

  return {
    level,
    classification,
    factors,
    recommendation,
    timestamp: Date.now(),
  };
}

/**
 * Check if component is being looked at
 */
export function isGazingAtComponent(
  eyeData: EyeTrackingData,
  componentBounds: { x: number; y: number; width: number; height: number },
  padding: number = 0.05
): boolean {
  if (eyeData.confidence < 0.5) return false;

  const { x, y } = eyeData.gaze;
  const bounds = {
    left: componentBounds.x - padding,
    right: componentBounds.x + componentBounds.width + padding,
    top: componentBounds.y - padding,
    bottom: componentBounds.y + componentBounds.height + padding,
  };

  return x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom;
}
