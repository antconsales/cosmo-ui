"use client";

import { useState, useEffect } from "react";
import type { AISettings, AIProvider } from "../lib/aiSettings";
import {
  loadSettings,
  saveSettings,
  getAvailableModels,
  isConfigured,
} from "../lib/aiSettings";

interface AISettingsPanelProps {
  onClose: () => void;
}

export function AISettingsPanel({ onClose }: AISettingsPanelProps) {
  const [settings, setSettings] = useState<AISettings>(() => loadSettings());
  const [showKeys, setShowKeys] = useState(false);

  useEffect(() => {
    // Load on mount
    setSettings(loadSettings());
  }, []);

  const handleSave = () => {
    saveSettings(settings);
    onClose();
  };

  const handleProviderChange = (provider: AIProvider) => {
    const models = getAvailableModels(provider);
    setSettings({
      ...settings,
      provider,
      model: models[0] || "",
    });
  };

  const configured = isConfigured(settings);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "32px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>
          AI Settings
        </h2>
        <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>
          Configure your AI provider to generate HUDCards in real-time
        </p>

        {/* Provider Selection */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "8px",
              color: "#374151",
            }}
          >
            AI Provider
          </label>
          <div style={{ display: "flex", gap: "12px" }}>
            {(["openai", "anthropic"] as AIProvider[]).map((provider) => (
              <button
                key={provider}
                onClick={() => handleProviderChange(provider)}
                style={{
                  flex: 1,
                  padding: "12px",
                  border:
                    settings.provider === provider
                      ? "2px solid #3b82f6"
                      : "2px solid #e5e7eb",
                  borderRadius: "8px",
                  backgroundColor:
                    settings.provider === provider ? "#eff6ff" : "#fff",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                  textTransform: "capitalize",
                }}
              >
                {provider}
              </button>
            ))}
          </div>
        </div>

        {/* API Key Input */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "8px",
              color: "#374151",
            }}
          >
            {settings.provider === "openai" ? "OpenAI" : "Anthropic"} API Key
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showKeys ? "text" : "password"}
              value={
                settings.provider === "openai"
                  ? settings.openaiKey
                  : settings.anthropicKey
              }
              onChange={(e) =>
                setSettings({
                  ...settings,
                  [settings.provider === "openai"
                    ? "openaiKey"
                    : "anthropicKey"]: e.target.value,
                })
              }
              placeholder={`Enter your ${settings.provider === "openai" ? "OpenAI" : "Anthropic"} API key`}
              style={{
                width: "100%",
                padding: "12px",
                paddingRight: "100px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            />
            <button
              onClick={() => setShowKeys(!showKeys)}
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                padding: "6px 12px",
                fontSize: "12px",
                border: "none",
                backgroundColor: "transparent",
                color: "#6b7280",
                cursor: "pointer",
              }}
            >
              {showKeys ? "Hide" : "Show"}
            </button>
          </div>
          <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
            Stored locally in your browser
          </p>
        </div>

        {/* Model Selection */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "8px",
              color: "#374151",
            }}
          >
            Model
          </label>
          <select
            value={settings.model}
            onChange={(e) => setSettings({ ...settings, model: e.target.value })}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              backgroundColor: "#fff",
            }}
          >
            {getAvailableModels(settings.provider).map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div
          style={{
            padding: "12px",
            borderRadius: "8px",
            backgroundColor: configured ? "#f0fdf4" : "#fef2f2",
            border: `1px solid ${configured ? "#bbf7d0" : "#fecaca"}`,
            marginBottom: "24px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              color: configured ? "#166534" : "#991b1b",
              margin: 0,
            }}
          >
            {configured
              ? "✓ Configuration valid"
              : "⚠️ API key required to generate cards"}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px 24px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              backgroundColor: "#fff",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: "12px 24px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#3b82f6",
              color: "#fff",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Save Settings
          </button>
        </div>

        {/* Help */}
        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "#6b7280",
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            <strong>Need an API key?</strong>
            <br />
            OpenAI: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener" style={{color: "#3b82f6"}}>platform.openai.com/api-keys</a>
            <br />
            Anthropic: <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener" style={{color: "#3b82f6"}}>console.anthropic.com/settings/keys</a>
          </p>
        </div>
      </div>
    </div>
  );
}
