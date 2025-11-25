/**
 * AI Generator - Generate HUDCards using AI
 * Supports OpenAI and Anthropic APIs
 */

import type { HUDCard } from "@cosmo/core-schema";
import {
  COSMO_UI_SYSTEM_PROMPT,
  buildGenerationPrompt,
  HUDCardCorrector,
  type CorrectionResult,
} from "@cosmo/ai-adapter";
import type { AISettings } from "./aiSettings";

export interface GenerationResult {
  success: boolean;
  card?: HUDCard;
  validation?: CorrectionResult;
  error?: string;
  rawResponse?: string;
  retries?: number;
}

/**
 * Generate HUDCard from intent using AI
 */
export async function generateHUDCardFromAI(
  intent: string,
  settings: AISettings,
  options?: {
    maxRetries?: number;
    fewShotCount?: number;
  }
): Promise<GenerationResult> {
  const maxRetries = options?.maxRetries ?? 2;
  const fewShotCount = options?.fewShotCount ?? 3;

  const corrector = new HUDCardCorrector();

  // Initial prompt
  const prompt = buildGenerationPrompt({
    intent,
    fewShotCount,
    includeSystemPrompt: false, // Will use system message
  });

  try {
    // First attempt
    let response = await callAI(settings, prompt);
    let card = parseAIResponse(response);
    let validation = corrector.validateAndCorrect(card);

    let retries = 0;

    // Retry loop if validation fails
    while (!validation.isValid && retries < maxRetries) {
      if (!validation.correctionPrompt) break;

      console.log(`Validation failed, retrying (${retries + 1}/${maxRetries})...`);

      response = await callAI(settings, validation.correctionPrompt);
      card = parseAIResponse(response);
      validation = corrector.validateAndCorrect(card);

      retries++;
    }

    return {
      success: validation.isValid,
      card: validation.card,
      validation,
      rawResponse: response,
      retries,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Call AI API (OpenAI or Anthropic)
 */
async function callAI(settings: AISettings, userPrompt: string): Promise<string> {
  if (settings.provider === "openai") {
    return callOpenAI(settings, userPrompt);
  }
  if (settings.provider === "anthropic") {
    return callAnthropic(settings, userPrompt);
  }
  throw new Error("Unsupported AI provider");
}

/**
 * Call OpenAI API
 */
async function callOpenAI(settings: AISettings, userPrompt: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${settings.openaiKey}`,
    },
    body: JSON.stringify({
      model: settings.model,
      messages: [
        {
          role: "system",
          content: COSMO_UI_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `OpenAI API error: ${response.status} - ${error.error?.message || response.statusText}`
    );
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

/**
 * Call Anthropic API
 */
async function callAnthropic(settings: AISettings, userPrompt: string): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": settings.anthropicKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: settings.model,
      max_tokens: 1024,
      system: COSMO_UI_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `Anthropic API error: ${response.status} - ${error.error?.message || response.statusText}`
    );
  }

  const data = await response.json();
  return data.content[0]?.text || "";
}

/**
 * Parse AI response to extract JSON
 */
function parseAIResponse(response: string): Partial<HUDCard> {
  // Remove markdown code blocks if present
  let cleaned = response.trim();

  // Remove ```json and ``` markers
  cleaned = cleaned.replace(/^```json\s*/i, "");
  cleaned = cleaned.replace(/^```\s*/, "");
  cleaned = cleaned.replace(/\s*```$/, "");

  // Find JSON object
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON object found in AI response");
  }

  return JSON.parse(jsonMatch[0]);
}
