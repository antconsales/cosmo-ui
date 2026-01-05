/**
 * Cosmo UI Voice-First Actions v1.0
 *
 * Voice commands and audio feedback for hands-free interaction,
 * especially important for AR glasses and accessibility.
 */

// ============================================================================
// VOICE COMMANDS
// ============================================================================

/**
 * Voice trigger configuration
 */
export interface VoiceTrigger {
  /** Phrases that trigger this action */
  phrases: string[];

  /** Language/locale (BCP 47 format) */
  locale?: string;

  /** Whether partial matches are allowed */
  fuzzyMatch?: boolean;

  /** Confidence threshold (0-1) */
  confidenceThreshold?: number;

  /** Whether to require wake word first */
  requireWakeWord?: boolean;
}

/**
 * Voice action definition
 */
export interface VoiceAction {
  /** Action identifier */
  id: string;

  /** Voice trigger configuration */
  trigger: VoiceTrigger;

  /** Feedback type when triggered */
  feedback: VoiceFeedbackType;

  /** Custom feedback message (for speech) */
  feedbackMessage?: string;

  /** Haptic feedback pattern */
  hapticPattern?: HapticPattern;

  /** Whether action requires confirmation */
  requireConfirmation?: boolean;

  /** Confirmation prompt */
  confirmationPrompt?: string;

  /** Timeout for listening (ms) */
  listenTimeout?: number;
}

/**
 * Built-in voice action types
 */
export type BuiltInVoiceAction =
  | "dismiss"      // "dismiss", "close", "go away"
  | "confirm"      // "yes", "confirm", "ok"
  | "cancel"       // "no", "cancel", "nevermind"
  | "read"         // "read it", "what does it say"
  | "snooze"       // "snooze", "remind me later"
  | "expand"       // "show more", "expand", "details"
  | "collapse"     // "show less", "collapse", "hide"
  | "next"         // "next", "skip"
  | "previous"     // "previous", "back", "go back"
  | "select"       // "select", "choose", "pick this"
  | "help";        // "help", "what can I say"

/**
 * Predefined voice triggers for common actions
 */
export const BUILT_IN_VOICE_TRIGGERS: Record<BuiltInVoiceAction, VoiceTrigger> = {
  dismiss: {
    phrases: ["dismiss", "close", "go away", "hide", "remove", "clear"],
    fuzzyMatch: true,
    confidenceThreshold: 0.7,
  },
  confirm: {
    phrases: ["yes", "confirm", "ok", "okay", "sure", "do it", "proceed", "accept"],
    fuzzyMatch: true,
    confidenceThreshold: 0.8,
  },
  cancel: {
    phrases: ["no", "cancel", "nevermind", "stop", "abort", "don't"],
    fuzzyMatch: true,
    confidenceThreshold: 0.8,
  },
  read: {
    phrases: ["read it", "what does it say", "read aloud", "tell me"],
    fuzzyMatch: true,
    confidenceThreshold: 0.7,
  },
  snooze: {
    phrases: ["snooze", "remind me later", "later", "not now"],
    fuzzyMatch: true,
    confidenceThreshold: 0.7,
  },
  expand: {
    phrases: ["show more", "expand", "details", "more info", "tell me more"],
    fuzzyMatch: true,
    confidenceThreshold: 0.7,
  },
  collapse: {
    phrases: ["show less", "collapse", "hide details", "less"],
    fuzzyMatch: true,
    confidenceThreshold: 0.7,
  },
  next: {
    phrases: ["next", "skip", "forward", "continue"],
    fuzzyMatch: true,
    confidenceThreshold: 0.8,
  },
  previous: {
    phrases: ["previous", "back", "go back", "before"],
    fuzzyMatch: true,
    confidenceThreshold: 0.8,
  },
  select: {
    phrases: ["select", "choose", "pick this", "this one"],
    fuzzyMatch: true,
    confidenceThreshold: 0.7,
  },
  help: {
    phrases: ["help", "what can I say", "voice commands", "options"],
    fuzzyMatch: true,
    confidenceThreshold: 0.7,
  },
};

// ============================================================================
// VOICE FEEDBACK
// ============================================================================

/**
 * Types of voice/audio feedback
 */
export type VoiceFeedbackType =
  | "none"           // No feedback
  | "beep"           // Simple confirmation beep
  | "speech"         // Text-to-speech response
  | "earcon"         // Short audio icon/earcon
  | "haptic"         // Vibration only
  | "combined";      // Speech + haptic

/**
 * Earcon types for audio feedback
 */
export type EarconType =
  | "confirm"
  | "cancel"
  | "error"
  | "notification"
  | "success"
  | "warning"
  | "attention"
  | "navigation";

/**
 * Haptic patterns for feedback
 */
export type HapticPattern =
  | "none"
  | "light"          // Single light tap
  | "medium"         // Single medium tap
  | "strong"         // Single strong tap
  | "double"         // Double tap
  | "success"        // Success pattern (ascending)
  | "error"          // Error pattern (descending)
  | "notification"   // Notification pattern
  | "attention"      // Attention pattern (urgent)
  | "selection";     // Selection feedback

/**
 * Voice feedback configuration
 */
export interface VoiceFeedbackConfig {
  /** Primary feedback type */
  type: VoiceFeedbackType;

  /** Earcon to play */
  earcon?: EarconType;

  /** Haptic pattern */
  haptic?: HapticPattern;

  /** Speech message (for TTS) */
  speechMessage?: string;

  /** Speech rate (0.5 - 2.0) */
  speechRate?: number;

  /** Speech pitch (0.5 - 2.0) */
  speechPitch?: number;

  /** Volume (0 - 1) */
  volume?: number;

  /** Delay before feedback (ms) */
  delay?: number;
}

// ============================================================================
// VOICE ANNOUNCEMENTS
// ============================================================================

/**
 * Announcement priority levels
 */
export type AnnouncementPriority =
  | "low"        // Can be interrupted
  | "medium"     // Normal priority
  | "high"       // Important, queue ahead
  | "critical";  // Immediate, interrupt anything

/**
 * Voice announcement for component content
 */
export interface VoiceAnnouncement {
  /** Text to announce */
  text: string;

  /** Priority level */
  priority: AnnouncementPriority;

  /** Whether to interrupt current speech */
  interrupt?: boolean;

  /** Delay before announcement (ms) */
  delay?: number;

  /** Whether to persist in queue if dismissed */
  persist?: boolean;

  /** Language/locale */
  locale?: string;

  /** Custom speech settings */
  speech?: {
    rate?: number;
    pitch?: number;
    volume?: number;
  };
}

/**
 * Generate announcement from component
 */
export function generateAnnouncement(
  title: string,
  content: string,
  variant?: string,
  priority: AnnouncementPriority = "medium"
): VoiceAnnouncement {
  let prefix = "";

  switch (variant) {
    case "error":
      prefix = "Error: ";
      break;
    case "warning":
      prefix = "Warning: ";
      break;
    case "success":
      prefix = "Success: ";
      break;
    case "info":
      prefix = "Info: ";
      break;
  }

  const text = content
    ? `${prefix}${title}. ${content}`
    : `${prefix}${title}`;

  return {
    text,
    priority,
    interrupt: priority === "critical",
  };
}

// ============================================================================
// VOICE COMPONENT CONFIG
// ============================================================================

/**
 * Voice configuration for any component
 */
export interface ComponentVoiceConfig {
  /** Whether component is voice-enabled */
  enabled: boolean;

  /** Voice actions available */
  actions?: VoiceAction[];

  /** Built-in actions to enable */
  builtInActions?: BuiltInVoiceAction[];

  /** Announcement configuration */
  announcement?: VoiceAnnouncement;

  /** Auto-announce on display */
  autoAnnounce?: boolean;

  /** Read full content on request */
  readableContent?: string;

  /** Voice shortcuts (number keys) */
  shortcuts?: Record<string, string>;  // "1" -> "dismiss", "2" -> "confirm"
}

/**
 * Default voice config for common scenarios
 */
export const DEFAULT_VOICE_CONFIGS: Record<string, Partial<ComponentVoiceConfig>> = {
  notification: {
    enabled: true,
    builtInActions: ["dismiss", "read", "snooze"],
    autoAnnounce: true,
  },
  confirmation: {
    enabled: true,
    builtInActions: ["confirm", "cancel"],
    autoAnnounce: true,
    shortcuts: { "1": "confirm", "2": "cancel" },
  },
  information: {
    enabled: true,
    builtInActions: ["dismiss", "read", "expand"],
    autoAnnounce: false,
  },
  navigation: {
    enabled: true,
    builtInActions: ["next", "previous", "select"],
    autoAnnounce: true,
  },
  alert: {
    enabled: true,
    builtInActions: ["dismiss", "read"],
    autoAnnounce: true,
  },
};

// ============================================================================
// VOICE CONTEXT
// ============================================================================

/**
 * Current voice interaction state
 */
export interface VoiceContext {
  /** Whether voice is currently listening */
  isListening: boolean;

  /** Whether voice is currently speaking */
  isSpeaking: boolean;

  /** Current wake word state */
  wakeWordActive: boolean;

  /** Last recognized phrase */
  lastRecognized?: string;

  /** Confidence of last recognition */
  lastConfidence?: number;

  /** Active component (for targeted commands) */
  activeComponentId?: string;

  /** Speech synthesis queue length */
  queueLength: number;

  /** Error state */
  error?: string;
}

/**
 * Voice event types
 */
export type VoiceEventType =
  | "wake-word"
  | "command-recognized"
  | "command-executed"
  | "speech-started"
  | "speech-ended"
  | "error"
  | "timeout";

/**
 * Voice event
 */
export interface VoiceEvent {
  type: VoiceEventType;
  timestamp: number;
  data?: {
    phrase?: string;
    confidence?: number;
    actionId?: string;
    componentId?: string;
    error?: string;
  };
}

// ============================================================================
// VOICE UTILITIES
// ============================================================================

/**
 * Check if phrase matches trigger
 */
export function matchesTrigger(phrase: string, trigger: VoiceTrigger): boolean {
  const normalizedPhrase = phrase.toLowerCase().trim();

  for (const triggerPhrase of trigger.phrases) {
    const normalizedTrigger = triggerPhrase.toLowerCase();

    if (trigger.fuzzyMatch) {
      // Fuzzy matching - check if phrase contains trigger
      if (
        normalizedPhrase.includes(normalizedTrigger) ||
        normalizedTrigger.includes(normalizedPhrase)
      ) {
        return true;
      }
    } else {
      // Exact matching
      if (normalizedPhrase === normalizedTrigger) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Find matching action from phrase
 */
export function findMatchingAction(
  phrase: string,
  actions: VoiceAction[],
  confidence: number = 1.0
): VoiceAction | undefined {
  for (const action of actions) {
    const threshold = action.trigger.confidenceThreshold ?? 0.7;

    if (confidence >= threshold && matchesTrigger(phrase, action.trigger)) {
      return action;
    }
  }

  return undefined;
}

/**
 * Get all available voice commands for a component
 */
export function getAvailableCommands(config: ComponentVoiceConfig): string[] {
  const commands: string[] = [];

  // Built-in actions
  if (config.builtInActions) {
    for (const actionId of config.builtInActions) {
      const trigger = BUILT_IN_VOICE_TRIGGERS[actionId];
      if (trigger) {
        commands.push(...trigger.phrases.slice(0, 2)); // First 2 phrases
      }
    }
  }

  // Custom actions
  if (config.actions) {
    for (const action of config.actions) {
      commands.push(...action.trigger.phrases.slice(0, 2));
    }
  }

  return [...new Set(commands)]; // Remove duplicates
}

/**
 * Generate help text for voice commands
 */
export function generateVoiceHelpText(config: ComponentVoiceConfig): string {
  const commands = getAvailableCommands(config);

  if (commands.length === 0) {
    return "No voice commands available.";
  }

  return `Available commands: ${commands.join(", ")}`;
}
