/**
 * Meta Ray-Ban Display Renderer
 *
 * Converts Cosmo UI components to Meta display format.
 * Currently a placeholder - will integrate with Meta Wearables SDK
 * when Display API becomes available.
 */

import type {
  HUDCard,
  ContextBadge,
  ProgressRing,
  StatusIndicator,
  MessagePreview,
  Timer,
} from "@cosmo/core-schema";

import type {
  MetaRenderContext,
  MetaRenderOutput,
  MetaDisplayConfig,
  GestureMapping,
  AudioFeedback,
  GestureEvent,
} from "./types";

import {
  DEFAULT_DISPLAY_CONFIG,
  DEFAULT_GESTURE_MAPPING,
} from "./types";

// ============================================
// Renderer Class
// ============================================

export class MetaRenderer {
  private config: MetaDisplayConfig;
  private gestures: GestureMapping;
  private displayQueue: MetaRenderOutput[] = [];
  private currentDisplay: MetaRenderOutput | null = null;

  constructor(
    config: Partial<MetaDisplayConfig> = {},
    gestures: Partial<GestureMapping> = {}
  ) {
    this.config = { ...DEFAULT_DISPLAY_CONFIG, ...config };
    this.gestures = { ...DEFAULT_GESTURE_MAPPING, ...gestures };
  }

  // ============================================
  // Component Renderers
  // ============================================

  renderHUDCard(card: HUDCard): MetaRenderOutput {
    // Adapt HUDCard for Meta's small display
    const compactTitle = this.truncateText(card.title, 30);
    const compactContent = card.content
      ? this.truncateText(card.content, 50)
      : undefined;
    const priority = card.priority ?? 3; // Default priority

    return {
      displayData: {
        type: "hud_card",
        title: compactTitle,
        content: compactContent,
        icon: card.icon,
        priority: priority,
        // Meta-specific: simplified layout for small display
        layout: "compact",
      },
      audio: this.getAudioForPriority(priority),
      autoDismissAfter: card.autoHideAfterSeconds
        ? card.autoHideAfterSeconds * 1000
        : undefined,
      priority: priority,
      onGesture: (event) => this.handleHUDCardGesture(card, event),
    };
  }

  renderContextBadge(badge: ContextBadge): MetaRenderOutput {
    return {
      displayData: {
        type: "context_badge",
        label: this.truncateText(badge.label, 20),
        icon: badge.icon,
        variant: badge.variant ?? "neutral",
        // Meta-specific: badge appears as minimal indicator
        layout: "minimal",
      },
      priority: 2, // Context badges are low priority
      autoDismissAfter: badge.autoDismissMs ?? 5000,
    };
  }

  renderProgressRing(ring: ProgressRing): MetaRenderOutput {
    return {
      displayData: {
        type: "progress_ring",
        value: ring.value, // 0-100 percentage
        label: ring.label ? this.truncateText(ring.label, 15) : undefined,
        // Meta-specific: simplified ring visualization
        showPercentage: ring.showValue ?? true,
      },
      priority: 2,
    };
  }

  renderStatusIndicator(indicator: StatusIndicator): MetaRenderOutput {
    return {
      displayData: {
        type: "status_indicator",
        state: indicator.state,
        label: indicator.label
          ? this.truncateText(indicator.label, 15)
          : undefined,
        // Meta-specific: color-coded dot
        layout: "dot",
      },
      audio:
        indicator.state === "error"
          ? { type: "error", volume: 0.5 }
          : undefined,
      priority: indicator.state === "error" ? 4 : 2,
    };
  }

  renderMessagePreview(message: MessagePreview): MetaRenderOutput {
    const senderName = message.sender?.name || "Unknown";
    return {
      displayData: {
        type: "message_preview",
        sender: this.truncateText(senderName, 15),
        content: this.truncateText(message.content, 40),
        app: message.app,
        read: message.read,
        // Meta-specific: notification banner
        layout: "banner",
      },
      audio: { type: "notification", volume: 0.6 },
      autoDismissAfter: 5000,
      priority: message.read ? 2 : 3,
      onGesture: (event) => this.handleMessageGesture(message, event),
    };
  }

  renderTimer(timer: Timer): MetaRenderOutput {
    return {
      displayData: {
        type: "timer",
        mode: timer.mode,
        remaining: timer.remaining,
        duration: timer.duration,
        state: timer.state,
        // Meta-specific: minimal time display
        layout: "time-only",
      },
      audio:
        timer.state === "completed"
          ? { type: "notification", volume: 0.8 }
          : undefined,
      priority: timer.state === "completed" ? 4 : 2,
    };
  }

  // ============================================
  // Display Queue Management
  // ============================================

  enqueue(output: MetaRenderOutput): void {
    this.displayQueue.push(output);
    this.displayQueue.sort((a, b) => b.priority - a.priority);
    this.processQueue();
  }

  private processQueue(): void {
    if (this.currentDisplay) return;

    const next = this.displayQueue.shift();
    if (!next) return;

    this.currentDisplay = next;
    this.show(next);

    if (next.autoDismissAfter) {
      setTimeout(() => {
        this.dismiss();
      }, next.autoDismissAfter);
    }
  }

  private show(output: MetaRenderOutput): void {
    // TODO: Integrate with Meta Wearables SDK when available
    console.log("[MetaRenderer] Showing:", output.displayData);

    if (output.audio) {
      this.playAudio(output.audio);
    }
  }

  dismiss(): void {
    this.currentDisplay = null;
    this.processQueue();
  }

  // ============================================
  // Gesture Handling
  // ============================================

  handleGesture(event: GestureEvent): void {
    if (!this.currentDisplay?.onGesture) {
      // Default gesture handling
      if (event.gesture === this.gestures.dismiss) {
        this.dismiss();
      }
      return;
    }

    this.currentDisplay.onGesture(event);
  }

  private handleHUDCardGesture(card: HUDCard, event: GestureEvent): void {
    if (event.gesture === this.gestures.dismiss) {
      this.dismiss();
    } else if (
      event.gesture === this.gestures.primaryAction &&
      card.actions?.[0]
    ) {
      console.log("[MetaRenderer] Primary action:", card.actions[0].id);
      this.dismiss();
    } else if (
      event.gesture === this.gestures.secondaryAction &&
      card.actions?.[1]
    ) {
      console.log("[MetaRenderer] Secondary action:", card.actions[1].id);
      this.dismiss();
    }
  }

  private handleMessageGesture(
    message: MessagePreview,
    event: GestureEvent
  ): void {
    if (event.gesture === this.gestures.dismiss) {
      this.dismiss();
    } else if (event.gesture === this.gestures.primaryAction) {
      console.log("[MetaRenderer] Open message from:", message.sender?.name);
      this.dismiss();
    }
  }

  // ============================================
  // Audio Feedback
  // ============================================

  private playAudio(audio: AudioFeedback): void {
    // TODO: Integrate with Meta audio API
    console.log("[MetaRenderer] Playing audio:", audio.type);
  }

  private getAudioForPriority(priority: number): AudioFeedback | undefined {
    if (priority >= 4) {
      return { type: "notification", volume: 0.8 };
    } else if (priority >= 3) {
      return { type: "tap", volume: 0.5 };
    }
    return undefined;
  }

  // ============================================
  // Utilities
  // ============================================

  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 1) + "…";
  }

  // ============================================
  // Context
  // ============================================

  getContext(): MetaRenderContext {
    return {
      display: this.config,
      gestures: this.gestures,
      isDisplayActive: this.currentDisplay !== null,
      ambientLight: 0.5, // TODO: Get from SDK
      isUserFocused: true, // TODO: Get from eye tracking
      batteryLevel: 1, // TODO: Get from SDK
      isConnected: false, // TODO: Check SDK connection
    };
  }
}
