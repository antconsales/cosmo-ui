"use client";

import { useState } from "react";
import type { HUDCard } from "@cosmo/core-schema";
import { generateHUDCardFromAI, type GenerationResult } from "../lib/aiGenerator";
import { loadSettings, isConfigured } from "../lib/aiSettings";
import { formatValidationErrors } from "@cosmo/ai-adapter";

interface AIGeneratorProps {
  onCardGenerated: (card: HUDCard) => void;
  onOpenSettings: () => void;
}

export function AIGenerator({ onCardGenerated, onOpenSettings }: AIGeneratorProps) {
  const [intent, setIntent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState<GenerationResult | null>(null);

  const settings = loadSettings();
  const configured = isConfigured(settings);

  const handleGenerate = async () => {
    if (!configured) {
      onOpenSettings();
      return;
    }

    if (!intent.trim()) return;

    setIsGenerating(true);
    setLastResult(null);

    try {
      const result = await generateHUDCardFromAI(intent, settings, {
        maxRetries: 2,
        fewShotCount: 3,
      });

      setLastResult(result);

      if (result.success && result.card) {
        onCardGenerated(result.card);
      }
    } catch (error) {
      setLastResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "24px",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h3 style={{ fontSize: "18px", fontWeight: 600, margin: 0 }}>
          🤖 AI Card Generator
        </h3>
        <button
          onClick={onOpenSettings}
          style={{
            padding: "8px 16px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            backgroundColor: "#fff",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          ⚙️ Settings
        </button>
      </div>

      {!configured && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "6px",
            marginBottom: "16px",
          }}
        >
          <p style={{ fontSize: "14px", color: "#991b1b", margin: 0 }}>
            ⚠️ Configure your API key in settings to use AI generation
          </p>
        </div>
      )}

      {/* Intent Input */}
      <div style={{ marginBottom: "12px" }}>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: 500,
            marginBottom: "8px",
            color: "#374151",
          }}
        >
          Describe the HUDCard you want to create:
        </label>
        <textarea
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Example: Show a success notification for file upload completion"
          disabled={isGenerating}
          style={{
            width: "100%",
            minHeight: "80px",
            padding: "12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "14px",
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !intent.trim()}
        style={{
          width: "100%",
          padding: "12px 24px",
          border: "none",
          borderRadius: "6px",
          backgroundColor: isGenerating || !intent.trim() ? "#9ca3af" : "#3b82f6",
          color: "#fff",
          cursor: isGenerating || !intent.trim() ? "not-allowed" : "pointer",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        {isGenerating ? "Generating..." : "✨ Generate HUDCard"}
      </button>

      {/* Result Display */}
      {lastResult && (
        <div style={{ marginTop: "16px" }}>
          {lastResult.success ? (
            <div
              style={{
                padding: "12px",
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "6px",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#166534",
                  marginBottom: "4px",
                }}
              >
                ✓ Card Generated Successfully
                {lastResult.retries && lastResult.retries > 0
                  ? ` (after ${lastResult.retries} correction${lastResult.retries > 1 ? "s" : ""})`
                  : ""}
              </p>
              {lastResult.validation?.warnings && lastResult.validation.warnings.length > 0 && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "#166534",
                    margin: "4px 0 0 0",
                  }}
                >
                  Warnings:{" "}
                  {lastResult.validation.warnings.map((w) => w.message).join(", ")}
                </p>
              )}
            </div>
          ) : (
            <div
              style={{
                padding: "12px",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "6px",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#991b1b",
                  marginBottom: "4px",
                }}
              >
                ✕ Generation Failed
              </p>
              <p style={{ fontSize: "12px", color: "#991b1b", margin: 0 }}>
                {lastResult.error ||
                  (lastResult.validation
                    ? formatValidationErrors(lastResult.validation)
                    : "Unknown error")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Quick Examples */}
      <div
        style={{
          marginTop: "16px",
          padding: "12px",
          backgroundColor: "#f9fafb",
          borderRadius: "6px",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#374151",
            marginBottom: "8px",
          }}
        >
          Quick Examples:
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {[
            "Show success notification for payment processed",
            "Warn about low battery",
            "Notify about new message",
            "Show error: connection failed",
          ].map((example) => (
            <button
              key={example}
              onClick={() => setIntent(example)}
              disabled={isGenerating}
              style={{
                padding: "6px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                backgroundColor: "#fff",
                cursor: isGenerating ? "not-allowed" : "pointer",
                fontSize: "12px",
                color: "#6b7280",
              }}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
