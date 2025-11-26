import type { HUDCard } from "@cosmo/core-schema";
import { getRandomExamples } from "./examples";
import { toContextFormat, type ContextFormat } from "../toon";

/**
 * Prompt templates for HUDCard generation
 */

export interface GenerationOptions {
  intent: string;
  fewShotCount?: number; // Number of examples to include (default: 3)
  includeSystemPrompt?: boolean; // Include full system prompt (default: true)
  /** Context format for examples: "json" (default) or "toon" (30-60% token savings) */
  contextFormat?: ContextFormat;
}

/**
 * Build a complete generation prompt with few-shot examples
 */
export function buildGenerationPrompt(options: GenerationOptions): string {
  const {
    intent,
    fewShotCount = 3,
    includeSystemPrompt = true,
    contextFormat = "json",
  } = options;

  const examples = getRandomExamples(fewShotCount);
  const useToon = contextFormat === "toon";

  const parts: string[] = [];

  // System prompt (optional, for standalone use)
  if (includeSystemPrompt) {
    parts.push(
      `You are an AI that generates Cosmo UI HUDCard components.`
    );
    parts.push(
      `Generate valid HUDCard JSON schemas that are concise, glanceable, and non-invasive.`
    );
    parts.push(``);
  }

  // Few-shot examples
  if (examples.length > 0) {
    if (useToon) {
      // TOON format - more compact, ~30-60% token savings
      parts.push(`Here are some example HUDCards (in TOON compact format):`);
      parts.push(``);
      examples.forEach((example, idx) => {
        parts.push(`Example ${idx + 1}: "${example.intent}"`);
        parts.push(toContextFormat(example.card, { format: "toon", includeFormatHint: false }));
        parts.push(``);
      });
    } else {
      // JSON format - traditional
      parts.push(`Here are some example HUDCards:`);
      parts.push(``);
      examples.forEach((example, idx) => {
        parts.push(`Example ${idx + 1}:`);
        parts.push(`Intent: "${example.intent}"`);
        parts.push(`Output:`);
        parts.push(JSON.stringify(example.card, null, 2));
        parts.push(``);
      });
    }
  }

  // User intent
  parts.push(`Now generate a HUDCard for this intent:`);
  parts.push(`Intent: "${intent}"`);
  parts.push(``);
  parts.push(
    `Output valid JSON only (no markdown, no explanation):`
  );

  return parts.join("\n");
}

/**
 * Build prompt for correcting validation errors
 */
export function buildCorrectionPrompt(
  originalCard: Partial<HUDCard>,
  errors: Array<{ field: string; message: string }>
): string {
  const parts: string[] = [];

  parts.push(`The following HUDCard has validation errors:`);
  parts.push(``);
  parts.push(JSON.stringify(originalCard, null, 2));
  parts.push(``);
  parts.push(`Errors found:`);
  errors.forEach((error, idx) => {
    parts.push(`${idx + 1}. Field "${error.field}": ${error.message}`);
  });
  parts.push(``);
  parts.push(`Please fix these errors and return a corrected HUDCard.`);
  parts.push(`Rules reminder:`);
  parts.push(`- Title: max 60 characters`);
  parts.push(`- Content: max 200 characters`);
  parts.push(`- Actions: max 2, label max 20 characters`);
  parts.push(`- Auto-hide: 3-30 seconds (or null)`);
  parts.push(`- Priority ≥4: no auto-hide, not dismissible`);
  parts.push(``);
  parts.push(`Output corrected JSON only:`);

  return parts.join("\n");
}

/**
 * Build prompt for batch generation
 */
export function buildBatchGenerationPrompt(
  intents: string[],
  options?: { includeSystemPrompt?: boolean }
): string {
  const parts: string[] = [];

  if (options?.includeSystemPrompt !== false) {
    parts.push(
      `You are an AI that generates Cosmo UI HUDCard components.`
    );
    parts.push(``);
  }

  parts.push(`Generate HUDCards for the following ${intents.length} intents:`);
  parts.push(``);

  intents.forEach((intent, idx) => {
    parts.push(`${idx + 1}. ${intent}`);
  });

  parts.push(``);
  parts.push(
    `Return a JSON array of HUDCards (one per intent, same order):`
  );
  parts.push(``);
  parts.push(`Output format:`);
  parts.push(`[`);
  parts.push(`  { "id": "...", "title": "...", "content": "...", ... },`);
  parts.push(`  { "id": "...", "title": "...", "content": "...", ... }`);
  parts.push(`]`);

  return parts.join("\n");
}

/**
 * Quick prompt for simple generation (minimal context)
 */
export function buildQuickPrompt(intent: string): string {
  return `Generate a HUDCard for: "${intent}"\n\nOutput valid JSON only:`;
}

/**
 * Build prompt with specific constraints
 */
export function buildConstrainedPrompt(
  intent: string,
  constraints: {
    variant?: HUDCard["variant"];
    priority?: HUDCard["priority"];
    position?: HUDCard["position"];
    maxAutoHide?: number;
  }
): string {
  const parts: string[] = [];

  parts.push(`Generate a HUDCard for: "${intent}"`);
  parts.push(``);
  parts.push(`Additional constraints:`);

  if (constraints.variant) {
    parts.push(`- Variant must be: "${constraints.variant}"`);
  }
  if (constraints.priority) {
    parts.push(`- Priority must be: ${constraints.priority}`);
  }
  if (constraints.position) {
    parts.push(`- Position must be: "${constraints.position}"`);
  }
  if (constraints.maxAutoHide) {
    parts.push(
      `- Auto-hide max: ${constraints.maxAutoHide} seconds (or null)`
    );
  }

  parts.push(``);
  parts.push(`Output valid JSON only:`);

  return parts.join("\n");
}
