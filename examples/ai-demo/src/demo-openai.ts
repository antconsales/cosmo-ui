/**
 * COSMO UI - AI Demo with OpenAI
 *
 * Test the AI-first UI generation with your OpenAI API key.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... pnpm demo:openai
 */

import OpenAI from "openai";
import {
  COSMO_UI_SYSTEM_PROMPT,
  buildGenerationPrompt,
  HUDCardCorrector,
  formatValidationErrors,
} from "@cosmo/ai-adapter";
import type { HUDCard } from "@cosmo/core-schema";

const client = new OpenAI();
const corrector = new HUDCardCorrector();

async function generateHUDCard(userRequest: string): Promise<HUDCard | null> {
  console.log("\n🎯 User Request:", userRequest);
  console.log("─".repeat(50));

  // Build the prompt with examples
  const prompt = buildGenerationPrompt(userRequest, {
    includeExamples: true,
    exampleCount: 2,
  });

  console.log("📤 Sending to GPT-4...\n");

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 1024,
    messages: [
      { role: "system", content: COSMO_UI_SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    console.error("❌ Empty response");
    return null;
  }

  console.log("📥 Raw Response:");
  console.log(content);
  console.log();

  // Parse JSON
  let card: Partial<HUDCard>;
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    card = JSON.parse(jsonMatch[0]);
  } catch {
    console.error("❌ Failed to parse JSON");
    return null;
  }

  // Validate and correct
  console.log("🔍 Validating...");
  const result = corrector.validateAndCorrect(card);

  if (result.isValid) {
    console.log("✅ Valid HUDCard generated!\n");
    return result.card!;
  }

  console.log("⚠️  Validation issues found:");
  console.log(formatValidationErrors(result));

  if (result.sanitized) {
    console.log("\n🔧 Using sanitized version...");
    return result.sanitized;
  }

  return null;
}

function renderCardPreview(card: HUDCard) {
  console.log("\n" + "═".repeat(50));
  console.log("  📋 HUDCard Preview");
  console.log("═".repeat(50));
  console.log(`  ID:       ${card.id}`);
  console.log(`  Title:    ${card.title}`);
  console.log(`  Content:  ${card.content}`);
  console.log(`  Variant:  ${card.variant}`);
  console.log(`  Priority: ${card.priority}`);
  console.log(`  Position: ${card.position}`);
  if (card.actions && card.actions.length > 0) {
    console.log(`  Actions:  ${card.actions.map((a) => a.label).join(", ")}`);
  }
  console.log("═".repeat(50) + "\n");
}

// Demo scenarios
const scenarios = [
  "Show a success notification that the file was saved",
  "Display a warning about low battery at 15%",
  "Create an error card for network connection failed",
  "Show info about a new message from John",
];

async function main() {
  console.log("\n🚀 COSMO UI - AI Generation Demo (OpenAI)\n");

  if (!process.env.OPENAI_API_KEY) {
    console.log("❌ Missing OPENAI_API_KEY environment variable\n");
    console.log("Usage:");
    console.log("  OPENAI_API_KEY=sk-... pnpm demo:openai\n");
    process.exit(1);
  }

  // Pick a random scenario or use command line argument
  const userRequest = process.argv[2] || scenarios[Math.floor(Math.random() * scenarios.length)];

  const card = await generateHUDCard(userRequest);

  if (card) {
    renderCardPreview(card);
    console.log("📦 JSON Output:");
    console.log(JSON.stringify(card, null, 2));
  }
}

main().catch(console.error);
