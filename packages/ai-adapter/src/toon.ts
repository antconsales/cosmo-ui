/**
 * TOON (Token-Oriented Object Notation) utilities
 *
 * Converts JSON context to TOON format for ~30-60% token savings
 * when sending data to LLMs.
 *
 * Use TOON for INPUT (context/data), keep JSON for OUTPUT (structured output)
 */

import { encode } from "@toon-format/toon";

export type ContextFormat = "json" | "toon";

export interface ToonOptions {
  /** Format to use for context data (default: "json") */
  format?: ContextFormat;
  /** Whether to include format hint for the LLM (default: true) */
  includeFormatHint?: boolean;
}

/**
 * Convert any JSON-serializable data to TOON format
 * Returns the original JSON string if format is "json"
 */
export function toContextFormat(
  data: unknown,
  options: ToonOptions = {}
): string {
  const { format = "json", includeFormatHint = true } = options;

  if (format === "json") {
    return JSON.stringify(data, null, 2);
  }

  // Convert to TOON
  const toonString = encode(data);

  if (includeFormatHint) {
    return `[TOON format - compact notation]\n${toonString}`;
  }

  return toonString;
}

/**
 * Format examples in TOON for few-shot prompts
 * Particularly efficient for arrays of similar objects
 */
export function formatExamplesAsToon<T extends Record<string, unknown>>(
  examples: T[],
  options: ToonOptions = {}
): string {
  return toContextFormat(examples, options);
}

/**
 * Format context data with automatic format selection
 * Uses TOON for arrays (best savings), JSON for complex nested objects
 */
export function smartContextFormat(
  data: unknown,
  options: ToonOptions = {}
): string {
  const { format = "toon" } = options;

  // For "json" format, always use JSON
  if (format === "json") {
    return JSON.stringify(data, null, 2);
  }

  // TOON is most efficient for:
  // 1. Arrays of uniform objects
  // 2. Flat objects
  // For deeply nested non-uniform data, JSON might be better
  // but TOON still works, so we use it by default

  return toContextFormat(data, options);
}

/**
 * Calculate approximate token savings
 * Returns percentage of tokens saved compared to JSON
 */
export function estimateTokenSavings(data: unknown): {
  jsonTokens: number;
  toonTokens: number;
  savingsPercent: number;
} {
  const jsonString = JSON.stringify(data, null, 2);
  const toonString = encode(data);

  // Rough token estimation (1 token ≈ 4 chars for English)
  const jsonTokens = Math.ceil(jsonString.length / 4);
  const toonTokens = Math.ceil(toonString.length / 4);
  const savingsPercent = Math.round(
    ((jsonTokens - toonTokens) / jsonTokens) * 100
  );

  return {
    jsonTokens,
    toonTokens,
    savingsPercent: Math.max(0, savingsPercent),
  };
}

/**
 * Wrap context data with clear delimiters for the LLM
 */
export function wrapContext(
  label: string,
  data: unknown,
  options: ToonOptions = {}
): string {
  const formatted = toContextFormat(data, options);
  return `<${label}>\n${formatted}\n</${label}>`;
}
