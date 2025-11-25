"use client";

import { useState } from "react";
import {
  HUDCardManager,
  useHUDCardManager,
  ContextBadgeManager,
  useContextBadgeManager,
  ProgressRingManager,
  useProgressRingManager,
  StatusIndicatorManager,
  useStatusIndicatorManager,
} from "@cosmo/renderer-web";
import type { HUDCard as HUDCardType, ContextBadge as ContextBadgeType, ProgressRing as ProgressRingType, StatusIndicator as StatusIndicatorType } from "@cosmo/core-schema";
import { AIGenerator } from "../components/AIGenerator";
import { AISettingsPanel } from "../components/AISettingsPanel";

/**
 * Example cards demonstrating various features
 */
/**
 * Demo ContextBadges
 */
const DEMO_BADGES: Record<string, ContextBadgeType> = {
  online: {
    id: "badge-online",
    label: "Online",
    variant: "success",
    icon: "check",
    position: "top-right",
    dismissible: false,
  },
  newMessages: {
    id: "badge-messages",
    label: "3 new",
    variant: "info",
    icon: "bell",
    position: "top-left",
    pulse: true,
    autoDismissMs: 8000,
  },
  syncing: {
    id: "badge-sync",
    label: "Syncing...",
    variant: "neutral",
    icon: "clock",
    position: "bottom-right",
    pulse: true,
    dismissible: false,
  },
  saved: {
    id: "badge-saved",
    label: "Saved",
    variant: "success",
    icon: "check",
    position: "bottom-center",
    autoDismissMs: 3000,
  },
  live: {
    id: "badge-live",
    label: "LIVE",
    contextualColor: "#ef4444",
    icon: "none",
    position: "top-center",
    pulse: true,
    dismissible: false,
  },
  premium: {
    id: "badge-premium",
    label: "Premium",
    contextualColor: "#8b5cf6",
    icon: "star",
    position: "top-right",
  },
};

/**
 * Demo ProgressRings
 */
const DEMO_RINGS: Record<string, ProgressRingType> = {
  download: {
    id: "ring-download",
    value: 0,
    variant: "info",
    size: 64,
    thickness: 6,
    showValue: true,
    label: "Download",
    position: "bottom-right",
  },
  storage: {
    id: "ring-storage",
    value: 78,
    variant: "warning",
    size: 48,
    showValue: true,
    label: "Storage",
    position: "bottom-left",
  },
  goals: {
    id: "ring-goals",
    value: 45,
    variant: "success",
    size: 72,
    thickness: 8,
    showValue: true,
    label: "Daily Goals",
    position: "center",
  },
  cpu: {
    id: "ring-cpu",
    value: 32,
    variant: "neutral",
    size: 48,
    showValue: true,
    label: "CPU",
    position: "top-left",
  },
};

/**
 * Demo StatusIndicators
 */
const DEMO_INDICATORS: Record<string, StatusIndicatorType> = {
  online: {
    id: "indicator-online",
    state: "success",
    label: "Online",
    size: 12,
    position: "top-right",
  },
  offline: {
    id: "indicator-offline",
    state: "error",
    label: "Offline",
    size: 12,
    glow: true,
    position: "top-right",
  },
  connecting: {
    id: "indicator-connecting",
    state: "loading",
    label: "Connecting...",
    size: 12,
    pulse: true,
    position: "top-right",
  },
  idle: {
    id: "indicator-idle",
    state: "idle",
    label: "Standby",
    size: 10,
    position: "bottom-left",
  },
  recording: {
    id: "indicator-recording",
    state: "error",
    label: "REC",
    size: 14,
    pulse: true,
    glow: true,
    position: "top-left",
  },
  warning: {
    id: "indicator-warning",
    state: "warning",
    label: "Attention",
    size: 14,
    glow: true,
    position: "top-center",
  },
};

const DEMO_CARDS: Record<string, HUDCardType> = {
  welcome: {
    id: "welcome",
    title: "Welcome to Cosmo UI v0.3",
    content:
      "AI-first cross-reality UI framework. Try the AI generator below to create cards in real-time!",
    variant: "info",
    priority: 3,
    position: "top-right",
    icon: "info",
    dismissible: true,
  },

  notification: {
    id: "notification",
    title: "New Message",
    content: "You have 3 unread messages from your team.",
    variant: "neutral",
    priority: 2,
    position: "top-left",
    icon: "bell",
    dismissible: true,
    autoHideAfterSeconds: 5,
  },

  success: {
    id: "success",
    title: "Save Successful",
    content: "Your changes have been saved successfully.",
    variant: "success",
    priority: 2,
    position: "bottom-right",
    icon: "check",
    dismissible: true,
    autoHideAfterSeconds: 4,
  },

  warning: {
    id: "warning",
    title: "Low Battery",
    content: "Your device battery is at 15%. Connect to power soon.",
    variant: "warning",
    priority: 4,
    position: "top-center",
    icon: "alert",
    dismissible: false,
  },

  error: {
    id: "error",
    title: "Connection Error",
    content: "Failed to connect to server. Check your internet connection.",
    variant: "error",
    priority: 5,
    position: "top-center",
    icon: "error",
    dismissible: false,
    actions: [
      {
        id: "retry",
        label: "Retry",
        variant: "primary",
      },
      {
        id: "cancel",
        label: "Cancel",
        variant: "secondary",
      },
    ],
  },

  reminder: {
    id: "reminder",
    title: "Upcoming Meeting",
    content: "Team sync starts in 10 minutes.",
    variant: "neutral",
    priority: 3,
    position: "bottom-left",
    icon: "clock",
    dismissible: true,
    autoHideAfterSeconds: 8,
  },
};

function BadgeControls() {
  const { addBadge, clearAll, badges } = useContextBadgeManager();

  const handleBadgeAction = (badgeType: string) => {
    const badge = DEMO_BADGES[badgeType];
    if (badge) {
      // Add unique ID to avoid duplicates
      addBadge({ ...badge, id: `${badge.id}-${Date.now()}` });
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "32px",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        marginTop: "16px",
      }}
    >
      <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>
        ContextBadge Demo <span style={{ fontSize: "14px", color: "#10b981" }}>(NEW in v0.3)</span>
      </h2>
      <p
        style={{
          color: "#6b7280",
          lineHeight: "1.6",
          marginBottom: "24px",
          fontSize: "14px",
        }}
      >
        Active badges: <strong>{badges.size}</strong> / 8 (max) • Lightweight pill-shaped indicators
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "8px",
              color: "#374151",
            }}
          >
            Status Badges
          </h3>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button onClick={() => handleBadgeAction("online")} style={{ ...badgeButtonStyle, backgroundColor: "#10b981" }}>
              Online
            </button>
            <button onClick={() => handleBadgeAction("syncing")} style={{ ...badgeButtonStyle, backgroundColor: "#6b7280" }}>
              Syncing...
            </button>
            <button onClick={() => handleBadgeAction("saved")} style={{ ...badgeButtonStyle, backgroundColor: "#10b981" }}>
              Saved
            </button>
          </div>
        </div>

        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "8px",
              color: "#374151",
            }}
          >
            Notification Badges
          </h3>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button onClick={() => handleBadgeAction("newMessages")} style={{ ...badgeButtonStyle, backgroundColor: "#3b82f6" }}>
              3 new (pulse)
            </button>
            <button onClick={() => handleBadgeAction("live")} style={{ ...badgeButtonStyle, backgroundColor: "#ef4444" }}>
              LIVE (custom color)
            </button>
            <button onClick={() => handleBadgeAction("premium")} style={{ ...badgeButtonStyle, backgroundColor: "#8b5cf6" }}>
              Premium (purple)
            </button>
          </div>
        </div>

        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "8px",
              color: "#374151",
            }}
          >
            System
          </h3>
          <button
            onClick={clearAll}
            style={{ ...badgeButtonStyle, backgroundColor: "#dc2626" }}
          >
            Clear All Badges
          </button>
        </div>
      </div>
    </div>
  );
}

function ProgressRingControls() {
  const { addRing, updateRing, clearAll, rings } = useProgressRingManager();
  const [sliderValue, setSliderValue] = useState(50);
  const [activeRingId, setActiveRingId] = useState<string | null>(null);

  const handleAddRing = (ringType: string) => {
    const ring = DEMO_RINGS[ringType];
    if (ring) {
      const newId = `${ring.id}-${Date.now()}`;
      addRing({ ...ring, id: newId, value: sliderValue });
      setActiveRingId(newId);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setSliderValue(value);
    if (activeRingId) {
      updateRing(activeRingId, value);
    }
  };

  const simulateDownload = () => {
    const newId = `ring-download-${Date.now()}`;
    addRing({ ...DEMO_RINGS.download!, id: newId, value: 0 });
    setActiveRingId(newId);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      updateRing(newId, Math.round(progress));
      setSliderValue(Math.round(progress));
    }, 300);
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "32px",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        marginTop: "16px",
      }}
    >
      <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>
        ProgressRing Demo <span style={{ fontSize: "14px", color: "#10b981" }}>(NEW in v0.3)</span>
      </h2>
      <p
        style={{
          color: "#6b7280",
          lineHeight: "1.6",
          marginBottom: "24px",
          fontSize: "14px",
        }}
      >
        Active rings: <strong>{rings.size}</strong> / 6 (max) • Circular progress indicators
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Value Slider */}
        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "8px",
              color: "#374151",
            }}
          >
            Value Control: {sliderValue}%
          </h3>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={handleSliderChange}
            style={{ width: "100%", cursor: "pointer" }}
          />
        </div>

        {/* Ring Types */}
        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "8px",
              color: "#374151",
            }}
          >
            Add Progress Ring
          </h3>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button onClick={() => handleAddRing("goals")} style={{ ...ringButtonStyle, backgroundColor: "#22c55e" }}>
              Goals (Success)
            </button>
            <button onClick={() => handleAddRing("storage")} style={{ ...ringButtonStyle, backgroundColor: "#f59e0b" }}>
              Storage (Warning)
            </button>
            <button onClick={() => handleAddRing("cpu")} style={{ ...ringButtonStyle, backgroundColor: "#6b7280" }}>
              CPU (Neutral)
            </button>
          </div>
        </div>

        {/* Animated Demo */}
        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "8px",
              color: "#374151",
            }}
          >
            Animated Demo
          </h3>
          <button onClick={simulateDownload} style={{ ...ringButtonStyle, backgroundColor: "#3b82f6" }}>
            Simulate Download
          </button>
        </div>

        {/* System */}
        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "8px",
              color: "#374151",
            }}
          >
            System
          </h3>
          <button
            onClick={clearAll}
            style={{ ...ringButtonStyle, backgroundColor: "#dc2626" }}
          >
            Clear All Rings
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusIndicatorControls() {
  const { addIndicator, updateIndicator, clearAll, indicators } = useStatusIndicatorManager();

  const handleAddIndicator = (indicatorType: string) => {
    const indicator = DEMO_INDICATORS[indicatorType];
    if (indicator) {
      const newId = `${indicator.id}-${Date.now()}`;
      addIndicator({ ...indicator, id: newId });
    }
  };

  const simulateConnection = () => {
    // Start with connecting
    const newId = `indicator-connection-${Date.now()}`;
    addIndicator({
      id: newId,
      state: "loading",
      label: "Connecting...",
      size: 12,
      pulse: true,
      position: "top-right",
    });

    // After 2 seconds, change to online
    setTimeout(() => {
      updateIndicator(newId, { state: "success", label: "Online", pulse: false });
    }, 2000);
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "32px",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        marginTop: "16px",
      }}
    >
      <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>
        StatusIndicator Demo <span style={{ fontSize: "14px", color: "#10b981" }}>(NEW in v0.3)</span>
      </h2>
      <p
        style={{
          color: "#6b7280",
          lineHeight: "1.6",
          marginBottom: "24px",
          fontSize: "14px",
        }}
      >
        Active indicators: <strong>{indicators.size}</strong> / 10 (max) • Minimal status dots
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Connection Status */}
        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "8px",
              color: "#374151",
            }}
          >
            Connection Status
          </h3>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button onClick={() => handleAddIndicator("online")} style={{ ...indicatorButtonStyle, backgroundColor: "#22c55e" }}>
              Online
            </button>
            <button onClick={() => handleAddIndicator("offline")} style={{ ...indicatorButtonStyle, backgroundColor: "#ef4444" }}>
              Offline
            </button>
            <button onClick={() => handleAddIndicator("connecting")} style={{ ...indicatorButtonStyle, backgroundColor: "#3b82f6" }}>
              Connecting...
            </button>
          </div>
        </div>

        {/* System Status */}
        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "8px",
              color: "#374151",
            }}
          >
            System Status
          </h3>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button onClick={() => handleAddIndicator("idle")} style={{ ...indicatorButtonStyle, backgroundColor: "#9ca3af" }}>
              Idle/Standby
            </button>
            <button onClick={() => handleAddIndicator("warning")} style={{ ...indicatorButtonStyle, backgroundColor: "#f59e0b" }}>
              Warning
            </button>
            <button onClick={() => handleAddIndicator("recording")} style={{ ...indicatorButtonStyle, backgroundColor: "#ef4444" }}>
              Recording (pulse)
            </button>
          </div>
        </div>

        {/* Animated Demo */}
        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "8px",
              color: "#374151",
            }}
          >
            Animated Demo
          </h3>
          <button onClick={simulateConnection} style={{ ...indicatorButtonStyle, backgroundColor: "#3b82f6" }}>
            Simulate Connection
          </button>
          <p
            style={{
              fontSize: "12px",
              color: "#6b7280",
              marginTop: "8px",
              fontStyle: "italic",
            }}
          >
            Starts connecting, then changes to online after 2 seconds
          </p>
        </div>

        {/* System */}
        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "8px",
              color: "#374151",
            }}
          >
            System
          </h3>
          <button
            onClick={clearAll}
            style={{ ...indicatorButtonStyle, backgroundColor: "#dc2626" }}
          >
            Clear All Indicators
          </button>
        </div>
      </div>
    </div>
  );
}

function DemoControls() {
  const { addCard, clearAll, cards } = useHUDCardManager();
  const [showSettings, setShowSettings] = useState(false);

  const handleCardAction = (cardType: string) => {
    const card = DEMO_CARDS[cardType];
    if (card) {
      addCard(card);
    }
  };

  const handleAICardGenerated = (card: HUDCardType) => {
    addCard(card);
  };

  return (
    <>
      {/* AI Generator */}
      <AIGenerator
        onCardGenerated={handleAICardGenerated}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* StatusIndicator Demo */}
      <StatusIndicatorControls />

      {/* ProgressRing Demo */}
      <ProgressRingControls />

      {/* ContextBadge Demo */}
      <BadgeControls />

      {/* Manual Demo Controls */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: "32px",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          marginTop: "16px",
        }}
      >
        <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>
          HUDCard Demo
        </h2>
        <p
          style={{
            color: "#6b7280",
            lineHeight: "1.6",
            marginBottom: "24px",
            fontSize: "14px",
          }}
        >
          Active cards: <strong>{cards.size}</strong> / 5 (max)
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "8px",
                color: "#374151",
              }}
            >
              Positioning Test
            </h3>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={() => handleCardAction("welcome")}
                style={buttonStyle}
              >
                Top-Right (Welcome)
              </button>
              <button
                onClick={() => handleCardAction("notification")}
                style={buttonStyle}
              >
                Top-Left (Notification)
              </button>
              <button
                onClick={() => handleCardAction("reminder")}
                style={buttonStyle}
              >
                Bottom-Left (Reminder)
              </button>
              <button
                onClick={() => handleCardAction("success")}
                style={buttonStyle}
              >
                Bottom-Right (Success)
              </button>
            </div>
          </div>

          <div>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "8px",
                color: "#374151",
              }}
            >
              Priority Test
            </h3>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={() => handleCardAction("warning")}
                style={{ ...buttonStyle, backgroundColor: "#f59e0b" }}
              >
                Priority 4 (Warning)
              </button>
              <button
                onClick={() => handleCardAction("error")}
                style={{ ...buttonStyle, backgroundColor: "#ef4444" }}
              >
                Priority 5 (Error)
              </button>
            </div>
            <p
              style={{
                fontSize: "12px",
                color: "#6b7280",
                marginTop: "8px",
                fontStyle: "italic",
              }}
            >
              High priority cards (≥4) cannot be dismissed or auto-hidden
            </p>
          </div>

          <div>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "8px",
                color: "#374151",
              }}
            >
              System
            </h3>
            <button
              onClick={clearAll}
              style={{ ...buttonStyle, backgroundColor: "#dc2626" }}
            >
              Clear All Cards
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            backgroundColor: "#f3f4f6",
            borderRadius: "4px",
          }}
        >
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
            <strong>v0.3 Features:</strong> StatusIndicator • ContextBadge • ProgressRing • Pulse animation •
            Glow effects • Custom colors • Auto-dismiss • State transitions • Max concurrent limits
          </p>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && <AISettingsPanel onClose={() => setShowSettings(false)} />}
    </>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: "10px 16px",
  backgroundColor: "#3b82f6",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 500,
  transition: "background-color 0.2s",
};

const badgeButtonStyle: React.CSSProperties = {
  padding: "8px 14px",
  backgroundColor: "#10b981",
  color: "#fff",
  border: "none",
  borderRadius: "9999px", // Pill shape
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 500,
  transition: "background-color 0.2s",
};

const ringButtonStyle: React.CSSProperties = {
  padding: "10px 16px",
  backgroundColor: "#3b82f6",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 500,
  transition: "background-color 0.2s",
};

const indicatorButtonStyle: React.CSSProperties = {
  padding: "8px 14px",
  backgroundColor: "#22c55e",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 500,
  transition: "background-color 0.2s",
};

export default function HomePage() {
  const handleCardAction = (cardId: string, actionId: string) => {
    console.log("Card action:", { cardId, actionId });

    // Handle specific actions
    if (actionId === "retry") {
      alert("Retrying connection...");
    }
  };

  return (
    <HUDCardManager onCardAction={handleCardAction}>
      <ContextBadgeManager>
        <ProgressRingManager>
          <StatusIndicatorManager>
            <main
              style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                backgroundColor: "#f9fafb",
              }}
            >
              <div
                style={{
                  maxWidth: "700px",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <h1
                  style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "16px" }}
                >
                  Cosmo UI
                </h1>
                <p
                  style={{ fontSize: "20px", color: "#6b7280", marginBottom: "32px" }}
                >
                  AI-first cross-reality UI framework
                </p>

                <DemoControls />
              </div>
            </main>
          </StatusIndicatorManager>
        </ProgressRingManager>
      </ContextBadgeManager>
    </HUDCardManager>
  );
}
