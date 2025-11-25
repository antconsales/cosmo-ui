"use client";

import { useState } from "react";
import {
  HUDCard,
  ContextBadge,
  ProgressRing,
  StatusIndicator,
  ActionBar,
  Tooltip,
  MediaCard,
  MiniPlayer,
  Timer,
  MessagePreview,
  ContactCard,
  EventCard,
  WeatherWidget,
  QuickSettings,
  ActivityRing,
  DirectionArrow,
} from "@cosmo/renderer-web";

type ComponentType =
  | "hudcard"
  | "badge"
  | "ring"
  | "status"
  | "actionbar"
  | "tooltip"
  | "mediacard"
  | "miniplayer"
  | "timer"
  | "message"
  | "contact"
  | "event"
  | "weather"
  | "settings"
  | "activity"
  | "direction";

type AIProvider = "gemini" | "openai" | "anthropic" | "deepseek";

const COMPONENT_INFO: Record<ComponentType, { name: string; emoji: string; category: string; examples: string[] }> = {
  // Core Components
  hudcard: {
    name: "HUDCard",
    emoji: "📋",
    category: "Core",
    examples: [
      "Show success: file saved!",
      "Error: WiFi disconnected",
      "Warning: battery at 15%",
    ],
  },
  badge: {
    name: "ContextBadge",
    emoji: "🏷️",
    category: "Core",
    examples: [
      "Show online status",
      "3 new notifications",
      "Live streaming",
    ],
  },
  ring: {
    name: "ProgressRing",
    emoji: "⭕",
    category: "Core",
    examples: [
      "Download at 75%",
      "Upload complete 100%",
      "Goal: 6000 steps done",
    ],
  },
  status: {
    name: "StatusIndicator",
    emoji: "🔴",
    category: "Core",
    examples: [
      "Connection online",
      "Recording active",
      "System loading",
    ],
  },
  actionbar: {
    name: "ActionBar",
    emoji: "🎛️",
    category: "Core",
    examples: [
      "Home, Search, Profile, Settings",
      "Play, Pause, Stop buttons",
    ],
  },
  tooltip: {
    name: "Tooltip",
    emoji: "💬",
    category: "Core",
    examples: [
      "Help text for button",
      "Warning tooltip",
    ],
  },
  // Media Components
  mediacard: {
    name: "MediaCard",
    emoji: "🖼️",
    category: "Media",
    examples: [
      "Movie poster: The Matrix",
      "YouTube thumbnail with 10:30 duration",
      "Album cover for Bohemian Rhapsody",
    ],
  },
  miniplayer: {
    name: "MiniPlayer",
    emoji: "🎵",
    category: "Media",
    examples: [
      "Now playing: Bohemian Rhapsody by Queen",
      "Podcast playing at 45 minutes",
      "Paused: Shape of You",
    ],
  },
  timer: {
    name: "Timer",
    emoji: "⏱️",
    category: "Media",
    examples: [
      "Cooking timer 5 minutes",
      "Workout timer 30 seconds",
      "Pomodoro focus 25 minutes",
    ],
  },
  // Communication Components
  message: {
    name: "MessagePreview",
    emoji: "💬",
    category: "Communication",
    examples: [
      "Message from Sarah: Hey, are you free?",
      "Work chat: Meeting at 3pm",
      "Mom: Call me when you can",
    ],
  },
  contact: {
    name: "ContactCard",
    emoji: "👤",
    category: "Communication",
    examples: [
      "John Smith, Product Manager, online",
      "Emma Watson, friend, available",
      "Work contact: Mike Johnson",
    ],
  },
  // Productivity Components
  event: {
    name: "EventCard",
    emoji: "📅",
    category: "Productivity",
    examples: [
      "Meeting: Sprint Planning at 10am",
      "Dentist appointment tomorrow 2pm",
      "Birthday party Friday 6pm",
    ],
  },
  weather: {
    name: "WeatherWidget",
    emoji: "🌤️",
    category: "Productivity",
    examples: [
      "Sunny, 72°F in San Francisco",
      "Rainy day in London, 15°C",
      "Snowy, -5°C with forecast",
    ],
  },
  // System Components
  settings: {
    name: "QuickSettings",
    emoji: "⚙️",
    category: "System",
    examples: [
      "WiFi, Bluetooth, Airplane toggles",
      "Do not disturb, dark mode settings",
      "Volume, brightness controls",
    ],
  },
  activity: {
    name: "ActivityRing",
    emoji: "⭕",
    category: "System",
    examples: [
      "Steps: 8000 of 10000 goal",
      "Fitness rings: Move, Exercise, Stand",
      "Daily goals 75% complete",
    ],
  },
  // Navigation Components
  direction: {
    name: "DirectionArrow",
    emoji: "🧭",
    category: "Navigation",
    examples: [
      "Turn right in 200m",
      "Go straight 1.5km to destination",
      "Slight left to highway",
    ],
  },
};

const PROVIDER_INFO: Record<AIProvider, { name: string; emoji: string; placeholder: string; color: string }> = {
  gemini: {
    name: "Google Gemini",
    emoji: "✨",
    placeholder: "AIzaSy...",
    color: "#4285f4",
  },
  openai: {
    name: "OpenAI GPT-4",
    emoji: "🤖",
    placeholder: "sk-...",
    color: "#10a37f",
  },
  anthropic: {
    name: "Anthropic Claude",
    emoji: "🧠",
    placeholder: "sk-ant-...",
    color: "#d4a574",
  },
  deepseek: {
    name: "DeepSeek",
    emoji: "🔮",
    placeholder: "sk-...",
    color: "#6366f1",
  },
};

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [componentType, setComponentType] = useState<ComponentType>("hudcard");
  const [provider, setProvider] = useState<AIProvider>("gemini");
  const [component, setComponent] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ type: ComponentType; data: Record<string, unknown>; provider: AIProvider }>>([]);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  const generate = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;

    if (!apiKey) {
      setError("⚠️ Please enter your API key to generate components");
      setApiKeyMissing(true);
      return;
    }
    setApiKeyMissing(false);

    if (!finalPrompt) {
      setError("⚠️ Please enter a prompt or select a template");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt, apiKey, componentType, provider }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setRawResponse(data.raw || null);
      } else {
        setComponent(data.component);
        setRawResponse(data.raw);
        setHistory((prev) => [
          { type: componentType, data: data.component, provider },
          ...prev.slice(0, 9),
        ]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const renderComponent = (type: ComponentType, data: Record<string, unknown>) => {
    switch (type) {
      case "hudcard":
        return (
          <HUDCard
            card={data as unknown as Parameters<typeof HUDCard>[0]["card"]}
            onDismiss={() => setComponent(null)}
            onAction={(cardId, actionId) => alert(`Action: ${actionId}`)}
          />
        );
      case "badge":
        return (
          <ContextBadge
            badge={data as unknown as Parameters<typeof ContextBadge>[0]["badge"]}
            onDismiss={() => setComponent(null)}
          />
        );
      case "ring":
        return (
          <ProgressRing ring={data as unknown as Parameters<typeof ProgressRing>[0]["ring"]} />
        );
      case "status":
        return (
          <StatusIndicator indicator={data as unknown as Parameters<typeof StatusIndicator>[0]["indicator"]} />
        );
      case "actionbar":
        return (
          <ActionBar
            bar={data as unknown as Parameters<typeof ActionBar>[0]["bar"]}
            onAction={(id) => alert(`ActionBar item: ${id}`)}
          />
        );
      case "tooltip":
        return (
          <Tooltip tooltip={data as unknown as Parameters<typeof Tooltip>[0]["tooltip"]}>
            <button style={{ padding: "12px 24px", borderRadius: "8px", border: "1px solid #6366f1", background: "#1e1b4b", color: "#a5b4fc", cursor: "pointer" }}>
              Hover me for tooltip
            </button>
          </Tooltip>
        );
      case "mediacard":
        return (
          <MediaCard
            card={data as unknown as Parameters<typeof MediaCard>[0]["card"]}
            onAction={(cardId, actionId) => alert(`Action: ${actionId}`)}
          />
        );
      case "miniplayer":
        return (
          <MiniPlayer
            player={data as unknown as Parameters<typeof MiniPlayer>[0]["player"]}
            onPlay={() => alert("Play")}
            onPause={() => alert("Pause")}
            onNext={() => alert("Next")}
            onPrev={() => alert("Previous")}
          />
        );
      case "timer":
        return (
          <Timer
            timer={data as unknown as Parameters<typeof Timer>[0]["timer"]}
            onStart={() => alert("Start")}
            onPause={() => alert("Pause")}
            onReset={() => alert("Reset")}
          />
        );
      case "message":
        return (
          <MessagePreview
            message={data as unknown as Parameters<typeof MessagePreview>[0]["message"]}
            onQuickReply={(msgId, reply) => alert(`Reply: ${reply}`)}
            onAction={(msgId, action) => alert(`Action: ${action}`)}
          />
        );
      case "contact":
        return (
          <ContactCard
            contact={data as unknown as Parameters<typeof ContactCard>[0]["contact"]}
            onAction={(contactId, action) => alert(`Action: ${action}`)}
          />
        );
      case "event":
        return (
          <EventCard
            event={data as unknown as Parameters<typeof EventCard>[0]["event"]}
            onAction={(eventId, action) => alert(`Action: ${action}`)}
          />
        );
      case "weather":
        return (
          <WeatherWidget
            weather={data as unknown as Parameters<typeof WeatherWidget>[0]["weather"]}
            onRefresh={() => alert("Refresh")}
          />
        );
      case "settings":
        return (
          <QuickSettings
            settings={data as unknown as Parameters<typeof QuickSettings>[0]["settings"]}
            onToggle={(id, enabled) => alert(`Toggle ${id}: ${enabled}`)}
          />
        );
      case "activity":
        return (
          <ActivityRing
            ring={data as unknown as Parameters<typeof ActivityRing>[0]["ring"]}
          />
        );
      case "direction":
        return (
          <DirectionArrow
            arrow={data as unknown as Parameters<typeof DirectionArrow>[0]["arrow"]}
          />
        );
      default:
        return <pre>{JSON.stringify(data, null, 2)}</pre>;
    }
  };

  const info = COMPONENT_INFO[componentType];
  const providerInfo = PROVIDER_INFO[provider];

  return (
    <div style={{ padding: "24px 40px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Compact Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <h1 style={{ fontSize: "1.5rem", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          🚀 COSMO UI <span style={{ fontSize: "0.85rem", color: "#666", fontWeight: 400 }}>v1.0 • 16 Components</span>
        </h1>
      </div>

      {/* Provider + API Key Row */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "16px", alignItems: "flex-end" }}>
        <div style={{ flex: "0 0 auto" }}>
          <label style={{ color: "#888", fontSize: "0.8rem", marginBottom: "6px", display: "block" }}>AI Provider</label>
          <div style={{ display: "flex", gap: "6px" }}>
            {(Object.keys(PROVIDER_INFO) as AIProvider[]).map((p) => (
              <button
                key={p}
                onClick={() => {
                  setProvider(p);
                  setApiKey("");
                }}
                style={{
                  padding: "8px 14px",
                  borderRadius: "6px",
                  border: provider === p ? `2px solid ${PROVIDER_INFO[p].color}` : "1px solid #333",
                  backgroundColor: provider === p ? `${PROVIDER_INFO[p].color}20` : "#1a1a1a",
                  color: provider === p ? PROVIDER_INFO[p].color : "#888",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>{PROVIDER_INFO[p].emoji}</span>
                <span style={{ display: provider === p ? "inline" : "none" }}>{PROVIDER_INFO[p].name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ color: "#888", fontSize: "0.8rem", marginBottom: "6px", display: "block" }}>
            {providerInfo.name} API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              if (e.target.value) setApiKeyMissing(false);
            }}
            placeholder={providerInfo.placeholder}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "6px",
              border: apiKeyMissing ? "2px solid #ef4444" : `1px solid ${providerInfo.color}40`,
              backgroundColor: apiKeyMissing ? "#1a1a1a" : "#1a1a1a",
              boxShadow: apiKeyMissing ? "0 0 8px rgba(239, 68, 68, 0.4)" : "none",
              color: "#fff",
              fontSize: "0.9rem",
              boxSizing: "border-box",
              transition: "all 0.2s ease",
            }}
          />
        </div>
      </div>

      {/* Component Selector */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ color: "#888", fontSize: "0.8rem", marginBottom: "6px", display: "block" }}>
          Select Component Type
        </label>
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px" }}>
          {(Object.keys(COMPONENT_INFO) as ComponentType[]).map((type) => (
            <button
              key={type}
              onClick={() => {
                setComponentType(type);
                setComponent(null);
                setPrompt("");
              }}
              title={COMPONENT_INFO[type].category}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: componentType === type ? "2px solid #6366f1" : "1px solid #333",
                backgroundColor: componentType === type ? "#1e1b4b" : "#1a1a1a",
                color: componentType === type ? "#a5b4fc" : "#888",
                fontSize: "0.85rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {COMPONENT_INFO[type].emoji} {COMPONENT_INFO[type].name}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Input */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", gap: "12px" }}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            placeholder={`Describe the ${info.name} you want...`}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "8px",
              border: "1px solid #333",
              backgroundColor: "#1a1a1a",
              color: "#fff",
              fontSize: "1rem",
            }}
          />
          <button
            onClick={() => generate()}
            disabled={loading}
            style={{
              padding: "12px 32px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: loading ? "#333" : providerInfo.color,
              color: "#fff",
              fontSize: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "600",
              minWidth: "160px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {loading ? "⏳ Generating..." : `${providerInfo.emoji} Generate`}
          </button>
        </div>
      </div>

      {/* Example Prompts - inline */}
      <div style={{ marginBottom: "16px", display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ color: "#555", fontSize: "0.8rem" }}>Try:</span>
        {info.examples.map((ex) => (
          <button
            key={ex}
            onClick={() => {
              setPrompt(ex);
              if (apiKey) generate(ex);
            }}
            style={{
              padding: "4px 10px",
              borderRadius: "12px",
              border: "1px solid #333",
              backgroundColor: "transparent",
              color: "#777",
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            {ex}
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Live Preview */}
        <div
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: "10px",
            padding: "16px",
            minHeight: "350px",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "12px", color: "#888", fontSize: "0.9rem" }}>
            {info.emoji} Live Preview
          </h3>
          <div
            style={{
              backgroundColor: "#0a0a0a",
              borderRadius: "8px",
              padding: "24px",
              minHeight: "280px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {loading && (
              <div style={{ color: "#666", fontSize: "1.2rem", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{providerInfo.emoji}</div>
                Generating with {providerInfo.name}...
              </div>
            )}
            {error && (
              <div style={{ color: "#ef4444", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>❌</div>
                <div style={{ maxWidth: "300px" }}>{error}</div>
              </div>
            )}
            {component && !loading && renderComponent(componentType, component)}
            {!component && !loading && !error && (
              <div style={{ color: "#444", textAlign: "center" }}>
                <div style={{ fontSize: "4rem", marginBottom: "16px" }}>
                  {info.emoji}
                </div>
                <div>Select an example or write your own prompt</div>
              </div>
            )}
          </div>
        </div>

        {/* JSON Output */}
        <div
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: "10px",
            padding: "16px",
            minHeight: "350px",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "12px", color: "#888", fontSize: "0.9rem" }}>
            📦 Generated Schema
          </h3>
          <pre
            style={{
              backgroundColor: "#0a0a0a",
              borderRadius: "8px",
              padding: "12px",
              overflow: "auto",
              fontSize: "0.8rem",
              color: "#10b981",
              margin: 0,
              maxHeight: "280px",
            }}
          >
            {component
              ? JSON.stringify(component, null, 2)
              : `// ${info.name} schema will appear here`}
          </pre>
          {rawResponse && (
            <details style={{ marginTop: "12px" }}>
              <summary style={{ color: "#666", cursor: "pointer", fontSize: "0.85rem" }}>
                Raw AI Response
              </summary>
              <pre
                style={{
                  backgroundColor: "#0a0a0a",
                  borderRadius: "8px",
                  padding: "12px",
                  overflow: "auto",
                  fontSize: "0.75rem",
                  color: "#666",
                  marginTop: "8px",
                  maxHeight: "150px",
                }}
              >
                {rawResponse}
              </pre>
            </details>
          )}
        </div>
      </div>

      {/* Recent Generations */}
      {history.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <h3 style={{ color: "#888", marginBottom: "12px", fontSize: "0.9rem" }}>📜 Recent Generations</h3>
          <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
            {history.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setComponentType(item.type);
                  setComponent(item.data);
                }}
                style={{
                  backgroundColor: "#1a1a1a",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  minWidth: "160px",
                  cursor: "pointer",
                  border: "1px solid #333",
                  transition: "border-color 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "1.3rem" }}>
                    {COMPONENT_INFO[item.type].emoji}
                  </span>
                  <span style={{ fontSize: "0.9rem" }}>
                    {PROVIDER_INFO[item.provider].emoji}
                  </span>
                </div>
                <div style={{ color: "#aaa", fontSize: "0.85rem" }}>
                  {COMPONENT_INFO[item.type].name}
                </div>
                <div style={{ color: "#555", fontSize: "0.75rem", marginTop: "2px" }}>
                  via {PROVIDER_INFO[item.provider].name.split(" ")[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: "24px",
          textAlign: "center",
          color: "#444",
          fontSize: "0.8rem",
          borderTop: "1px solid #222",
          paddingTop: "16px",
        }}
      >
        <div style={{ marginBottom: "6px" }}>
          <strong style={{ color: "#666" }}>COSMO UI v1.0</strong> • AI-first Wearable-Ready UI Framework
        </div>
        <div style={{ fontSize: "0.75rem" }}>
          Core (6) • Media (3) • Communication (2) • Productivity (2) • System (2) • Navigation (1) — ✨ Gemini • 🤖 OpenAI • 🧠 Anthropic • 🔮 DeepSeek
        </div>
      </div>
    </div>
  );
}
