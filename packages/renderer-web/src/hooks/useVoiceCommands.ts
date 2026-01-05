/**
 * useVoiceCommands Hook v1.0
 *
 * React hook for voice-first interactions using Web Speech API.
 * Matches voice input against registered triggers and executes actions.
 */

import { useState, useCallback, useEffect, useRef } from "react";
import type {
  VoiceAction,
  VoiceAnnouncement,
} from "@cosmo/core-schema";
import { matchesTrigger } from "@cosmo/core-schema";

// ============================================================================
// BROWSER TYPE DECLARATIONS
// ============================================================================

// Extend Window for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
}

declare let SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

// ============================================================================
// TYPES
// ============================================================================

export interface VoiceCommandsOptions {
  /** Language for speech recognition */
  language?: string;
  /** Continuous listening mode */
  continuous?: boolean;
  /** Interim results while speaking */
  interimResults?: boolean;
  /** Maximum alternatives to consider */
  maxAlternatives?: number;
  /** Speech synthesis voice */
  voice?: string;
  /** Speech synthesis rate */
  speechRate?: number;
  /** Speech synthesis pitch */
  speechPitch?: number;
  /** Auto-start listening on mount */
  autoStart?: boolean;
  /** Callback when speech is detected */
  onSpeechDetected?: (transcript: string) => void;
  /** Callback when action is matched */
  onActionMatched?: (actionId: string, transcript: string) => void;
  /** Callback when no action matched */
  onNoMatch?: (transcript: string) => void;
  /** Callback for errors */
  onError?: (error: string) => void;
}

export interface VoiceCommandsState {
  /** Whether speech recognition is available */
  isSupported: boolean;
  /** Whether speech synthesis is available */
  isSynthesisSupported: boolean;
  /** Whether currently listening */
  isListening: boolean;
  /** Whether currently speaking */
  isSpeaking: boolean;
  /** Current transcript (interim) */
  transcript: string;
  /** Final transcript from last recognition */
  finalTranscript: string;
  /** Last matched action */
  lastMatchedAction: string | null;
  /** Error message if any */
  error: string | null;
  /** Confidence of last recognition */
  confidence: number;
}

export interface UseVoiceCommandsReturn extends VoiceCommandsState {
  /** Start listening */
  startListening: () => void;
  /** Stop listening */
  stopListening: () => void;
  /** Toggle listening */
  toggleListening: () => void;
  /** Speak text aloud */
  speak: (text: string, options?: SpeakOptions) => Promise<void>;
  /** Stop speaking */
  stopSpeaking: () => void;
  /** Register voice actions */
  registerActions: (actions: VoiceAction[]) => void;
  /** Unregister voice actions */
  unregisterActions: (actionIds: string[]) => void;
  /** Clear all registered actions */
  clearActions: () => void;
  /** Manually process a transcript */
  processTranscript: (transcript: string) => string | null;
  /** Read out an announcement */
  announce: (announcement: VoiceAnnouncement) => Promise<void>;
  /** Get all registered actions */
  actions: Map<string, VoiceAction>;
}

export interface SpeakOptions {
  /** Priority of this speech */
  priority?: "immediate" | "queue" | "background";
  /** Voice to use */
  voice?: string;
  /** Speech rate (0.1 - 10) */
  rate?: number;
  /** Pitch (0 - 2) */
  pitch?: number;
  /** Volume (0 - 1) */
  volume?: number;
  /** Callback when done */
  onEnd?: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_OPTIONS: Required<VoiceCommandsOptions> = {
  language: "en-US",
  continuous: false,
  interimResults: true,
  maxAlternatives: 3,
  voice: "",
  speechRate: 1,
  speechPitch: 1,
  autoStart: false,
  onSpeechDetected: () => {},
  onActionMatched: () => {},
  onNoMatch: () => {},
  onError: () => {},
};

// ============================================================================
// HOOK
// ============================================================================

/**
 * useVoiceCommands - Voice-first interactions hook
 *
 * @example
 * ```tsx
 * function VoiceEnabledCard({ card, onAction }) {
 *   const { isListening, startListening, speak, registerActions } = useVoiceCommands({
 *     onActionMatched: (actionId) => onAction(card.id, actionId)
 *   });
 *
 *   useEffect(() => {
 *     if (card.voiceActions) {
 *       registerActions(card.voiceActions);
 *     }
 *   }, [card.voiceActions]);
 *
 *   return (
 *     <div>
 *       <button onClick={startListening}>
 *         {isListening ? "Listening..." : "Voice Command"}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useVoiceCommands(
  options: VoiceCommandsOptions = {}
): UseVoiceCommandsReturn {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // State
  const [state, setState] = useState<VoiceCommandsState>(() => ({
    isSupported: typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window),
    isSynthesisSupported: typeof window !== "undefined" && "speechSynthesis" in window,
    isListening: false,
    isSpeaking: false,
    transcript: "",
    finalTranscript: "",
    lastMatchedAction: null,
    error: null,
    confidence: 0,
  }));

  // Registered actions
  const [actions, setActions] = useState<Map<string, VoiceAction>>(new Map());

  // Speech recognition instance
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Speech synthesis queue
  const speechQueueRef = useRef<Array<{ text: string; options: SpeakOptions }>>([]);
  const isSpeakingRef = useRef(false);

  // Process transcript and match against actions
  const processTranscriptInternal = useCallback(
    (transcript: string) => {
      const normalizedTranscript = transcript.toLowerCase().trim();

      // Check against registered actions
      for (const [, action] of actions) {
        if (matchesTrigger(normalizedTranscript, action.trigger)) {
          setState((prev) => ({ ...prev, lastMatchedAction: action.id }));
          opts.onActionMatched(action.id, transcript);

          // Speak feedback message if defined
          if (action.feedbackMessage) {
            speakInternal(action.feedbackMessage, { priority: "queue" });
          }

          return action.id;
        }
      }

      // No match found
      opts.onNoMatch(transcript);
      return null;
    },
    [actions, opts]
  );

  // Internal speak function
  const speakInternal = useCallback(
    async (text: string, options: SpeakOptions = {}): Promise<void> => {
      if (!state.isSynthesisSupported) return;

      const { priority = "queue" } = options;

      if (priority === "immediate") {
        // Stop current speech and speak immediately
        window.speechSynthesis.cancel();
        speechQueueRef.current = [];
        await performSpeak(text, options);
      } else if (priority === "queue") {
        // Add to queue
        speechQueueRef.current.push({ text, options });
        processQueue();
      } else {
        // Background - add to end of queue with lower volume
        speechQueueRef.current.push({
          text,
          options: { ...options, volume: 0.5 },
        });
        processQueue();
      }
    },
    [state.isSynthesisSupported]
  );

  // Process speech queue
  const processQueue = useCallback(async () => {
    if (isSpeakingRef.current || speechQueueRef.current.length === 0) return;

    isSpeakingRef.current = true;
    setState((prev) => ({ ...prev, isSpeaking: true }));

    while (speechQueueRef.current.length > 0) {
      const item = speechQueueRef.current.shift();
      if (item) {
        await performSpeak(item.text, item.options);
      }
    }

    isSpeakingRef.current = false;
    setState((prev) => ({ ...prev, isSpeaking: false }));
  }, []);

  // Perform actual speech
  const performSpeak = useCallback(
    (text: string, options: SpeakOptions): Promise<void> => {
      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);

        // Apply options
        utterance.rate = options.rate ?? opts.speechRate;
        utterance.pitch = options.pitch ?? opts.speechPitch;
        utterance.volume = options.volume ?? 1;

        // Find voice if specified
        if (options.voice || opts.voice) {
          const voices = window.speechSynthesis.getVoices();
          const targetVoice = options.voice || opts.voice;
          const voice = voices.find(
            (v) =>
              v.name.toLowerCase().includes(targetVoice.toLowerCase()) ||
              v.lang.toLowerCase().includes(targetVoice.toLowerCase())
          );
          if (voice) {
            utterance.voice = voice;
          }
        }

        utterance.onend = () => {
          options.onEnd?.();
          resolve();
        };

        utterance.onerror = () => {
          resolve();
        };

        window.speechSynthesis.speak(utterance);
      });
    },
    [opts.speechRate, opts.speechPitch, opts.voice]
  );

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionConstructor =
      window.webkitSpeechRecognition || window.SpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      setState((prev) => ({ ...prev, isSupported: false }));
      return;
    }

    const recognition = new SpeechRecognitionConstructor();
    recognition.lang = opts.language;
    recognition.continuous = opts.continuous;
    recognition.interimResults = opts.interimResults;
    recognition.maxAlternatives = opts.maxAlternatives;

    recognition.onstart = () => {
      setState((prev) => ({
        ...prev,
        isListening: true,
        error: null,
        transcript: "",
      }));
    };

    recognition.onend = () => {
      setState((prev) => ({ ...prev, isListening: false }));
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (!result || !result[0]) continue;

        const transcript = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setState((prev) => ({
        ...prev,
        transcript: interimTranscript,
        finalTranscript: finalTranscript || prev.finalTranscript,
        confidence: event.results[event.results.length - 1]?.[0]?.confidence || 0,
      }));

      if (finalTranscript) {
        opts.onSpeechDetected(finalTranscript);
        processTranscriptInternal(finalTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errorMessage = getErrorMessage(event.error);
      setState((prev) => ({ ...prev, error: errorMessage }));
      opts.onError(errorMessage);
    };

    recognitionRef.current = recognition;

    // Auto-start if configured
    if (opts.autoStart && state.isSupported) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.language, opts.continuous, opts.interimResults, opts.maxAlternatives]);

  // Public process transcript
  const processTranscript = useCallback(
    (transcript: string) => processTranscriptInternal(transcript),
    [processTranscriptInternal]
  );

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current || !state.isSupported) {
      setState((prev) => ({ ...prev, error: "Speech recognition not supported" }));
      return;
    }

    try {
      recognitionRef.current.start();
    } catch {
      // Already started, ignore
    }
  }, [state.isSupported]);

  // Stop listening
  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (state.isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [state.isListening, startListening, stopListening]);

  // Public speak function
  const speak = useCallback(
    async (text: string, options: SpeakOptions = {}): Promise<void> => {
      return speakInternal(text, options);
    },
    [speakInternal]
  );

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    speechQueueRef.current = [];
    isSpeakingRef.current = false;
    setState((prev) => ({ ...prev, isSpeaking: false }));
  }, []);

  // Register voice actions
  const registerActions = useCallback((newActions: VoiceAction[]) => {
    setActions((prev) => {
      const next = new Map(prev);
      newActions.forEach((action) => {
        next.set(action.id, action);
      });
      return next;
    });
  }, []);

  // Unregister voice actions
  const unregisterActions = useCallback((actionIds: string[]) => {
    setActions((prev) => {
      const next = new Map(prev);
      actionIds.forEach((id) => next.delete(id));
      return next;
    });
  }, []);

  // Clear all actions
  const clearActions = useCallback(() => {
    setActions(new Map());
  }, []);

  // Announce using VoiceAnnouncement
  const announce = useCallback(
    async (announcement: VoiceAnnouncement): Promise<void> => {
      const priority = announcement.priority === "critical" ? "immediate" :
                       announcement.priority === "high" ? "queue" : "background";

      if (announcement.delay) {
        await new Promise((resolve) => setTimeout(resolve, announcement.delay));
      }

      await speak(announcement.text, {
        priority,
        rate: announcement.speech?.rate,
        pitch: announcement.speech?.pitch,
        volume: announcement.speech?.volume,
      });
    },
    [speak]
  );

  return {
    ...state,
    startListening,
    stopListening,
    toggleListening,
    speak,
    stopSpeaking,
    registerActions,
    unregisterActions,
    clearActions,
    processTranscript,
    announce,
    actions,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get human-readable error message
 */
function getErrorMessage(error: string): string {
  switch (error) {
    case "no-speech":
      return "No speech detected. Please try again.";
    case "audio-capture":
      return "No microphone found. Please check your audio settings.";
    case "not-allowed":
      return "Microphone access denied. Please allow microphone access.";
    case "network":
      return "Network error. Please check your connection.";
    case "aborted":
      return "Speech recognition was aborted.";
    case "language-not-supported":
      return "Language not supported.";
    default:
      return `Speech recognition error: ${error}`;
  }
}

// ============================================================================
// UTILITY HOOK
// ============================================================================

/**
 * useVoiceAction - Simple hook for single voice action
 *
 * @example
 * ```tsx
 * function DismissButton({ onDismiss }) {
 *   const { isListening, activate } = useVoiceAction({
 *     phrases: ["dismiss", "close", "got it"],
 *     onTrigger: onDismiss
 *   });
 *
 *   return (
 *     <button onClick={activate}>
 *       {isListening ? "Say 'dismiss'" : "Voice Dismiss"}
 *     </button>
 *   );
 * }
 * ```
 */
export function useVoiceAction(options: {
  phrases: string[];
  onTrigger: () => void;
  timeout?: number;
}): {
  isListening: boolean;
  isSupported: boolean;
  activate: () => void;
  deactivate: () => void;
} {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const { isListening, isSupported, startListening, stopListening, registerActions, clearActions } =
    useVoiceCommands({
      continuous: false,
      onActionMatched: () => {
        options.onTrigger();
        stopListening();
        clearTimeout(timeoutRef.current);
      },
    });

  const activate = useCallback(() => {
    // Create a VoiceAction with the correct structure
    const action: VoiceAction = {
      id: "voice-action",
      trigger: {
        phrases: options.phrases,
        fuzzyMatch: true,
      },
      feedback: "none",
    };
    registerActions([action]);
    startListening();

    // Auto-stop after timeout
    if (options.timeout) {
      timeoutRef.current = setTimeout(() => {
        stopListening();
        clearActions();
      }, options.timeout);
    }
  }, [options.phrases, options.timeout, registerActions, startListening, stopListening, clearActions]);

  const deactivate = useCallback(() => {
    stopListening();
    clearActions();
    clearTimeout(timeoutRef.current);
  }, [stopListening, clearActions]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    isListening,
    isSupported,
    activate,
    deactivate,
  };
}

// ============================================================================
// TEXT-TO-SPEECH HOOK
// ============================================================================

/**
 * useTextToSpeech - Simple text-to-speech hook
 *
 * @example
 * ```tsx
 * function SpeakButton({ text }) {
 *   const { speak, isSpeaking, stop } = useTextToSpeech();
 *
 *   return (
 *     <button onClick={() => isSpeaking ? stop() : speak(text)}>
 *       {isSpeaking ? "Stop" : "Speak"}
 *     </button>
 *   );
 * }
 * ```
 */
export function useTextToSpeech(defaultOptions: SpeakOptions = {}): {
  speak: (text: string, options?: SpeakOptions) => Promise<void>;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
} {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // Load voices
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isSupported]);

  const speak = useCallback(
    async (text: string, options: SpeakOptions = {}): Promise<void> => {
      if (!isSupported) return;

      const mergedOptions = { ...defaultOptions, ...options };
      const utterance = new SpeechSynthesisUtterance(text);

      utterance.rate = mergedOptions.rate ?? 1;
      utterance.pitch = mergedOptions.pitch ?? 1;
      utterance.volume = mergedOptions.volume ?? 1;

      if (mergedOptions.voice) {
        const voice = voices.find(
          (v) =>
            v.name.toLowerCase().includes(mergedOptions.voice!.toLowerCase())
        );
        if (voice) utterance.voice = voice;
      }

      setIsSpeaking(true);

      return new Promise((resolve) => {
        utterance.onend = () => {
          setIsSpeaking(false);
          mergedOptions.onEnd?.();
          resolve();
        };
        utterance.onerror = () => {
          setIsSpeaking(false);
          resolve();
        };
        window.speechSynthesis.speak(utterance);
      });
    },
    [isSupported, voices, defaultOptions]
  );

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported, voices };
}
