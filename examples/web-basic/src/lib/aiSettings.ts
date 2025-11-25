/**
 * AI Settings - localStorage API
 * Manages API keys and model selection
 */

export type AIProvider = "openai" | "anthropic";

export interface AISettings {
  provider: AIProvider;
  openaiKey: string;
  anthropicKey: string;
  model: string;
}

const STORAGE_KEY = "cosmo-ui-ai-settings";

const DEFAULT_SETTINGS: AISettings = {
  provider: "openai",
  openaiKey: "",
  anthropicKey: "",
  model: "gpt-4",
};

/**
 * Load settings from localStorage
 */
export function loadSettings(): AISettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(stored);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings: AISettings): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save AI settings:", error);
  }
}

/**
 * Clear settings from localStorage
 */
export function clearSettings(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear AI settings:", error);
  }
}

/**
 * Check if current settings are valid (has API key)
 */
export function isConfigured(settings: AISettings): boolean {
  if (settings.provider === "openai") {
    return settings.openaiKey.trim().length > 0;
  }
  if (settings.provider === "anthropic") {
    return settings.anthropicKey.trim().length > 0;
  }
  return false;
}

/**
 * Get available models for provider
 */
export function getAvailableModels(provider: AIProvider): string[] {
  if (provider === "openai") {
    return ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"];
  }
  if (provider === "anthropic") {
    return ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"];
  }
  return [];
}
