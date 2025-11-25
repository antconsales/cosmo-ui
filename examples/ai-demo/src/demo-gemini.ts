/**
 * COSMO UI - AI Demo with Google Gemini
 *
 * Test the AI-first UI generation with your Gemini API key.
 *
 * Usage:
 *   GEMINI_API_KEY=xxx pnpm demo:gemini
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  COSMO_UI_SYSTEM_PROMPT,
  HUDCardCorrector,
  formatValidationErrors,
} from "@cosmo/ai-adapter";
import type { HUDCard } from "@cosmo/core-schema";

const corrector = new HUDCardCorrector();

async function generateHUDCard(
  apiKey: string,
  userRequest: string
): Promise<HUDCard | null> {
  console.log("\n🎯 User Request:", userRequest);
  console.log("─".repeat(50));

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  // Build direct prompt with system instructions embedded (Gemini works better this way)
  const prompt = `${COSMO_UI_SYSTEM_PROMPT}

---
USER REQUEST: ${userRequest}
---

Generate a HUDCard JSON for this specific request. Return ONLY the raw JSON object (no markdown code blocks, no explanation).
The id should be a simple string like "card-wifi-001".`;

  console.log("📤 Sending to Gemini...\n");

  const result = await model.generateContent(prompt);
  const response = result.response;
  const content = response.text();

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
  } catch (e) {
    console.error("❌ Failed to parse JSON:", e);
    return null;
  }

  // Validate and correct
  console.log("🔍 Validating...");
  const validationResult = corrector.validateAndCorrect(card);

  if (validationResult.isValid) {
    console.log("✅ Valid HUDCard generated!\n");
    return validationResult.card!;
  }

  console.log("⚠️  Validation issues found:");
  console.log(formatValidationErrors(validationResult));

  if (validationResult.sanitized) {
    console.log("\n🔧 Using sanitized version...");
    return validationResult.sanitized;
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
  console.log("\n🚀 COSMO UI - AI Generation Demo (Gemini)\n");

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log("❌ Missing GEMINI_API_KEY environment variable\n");
    console.log("Usage:");
    console.log("  GEMINI_API_KEY=xxx pnpm demo:gemini\n");
    process.exit(1);
  }

  // Pick a random scenario or use command line argument
  const userRequest =
    process.argv[2] || scenarios[Math.floor(Math.random() * scenarios.length)];

  const card = await generateHUDCard(apiKey, userRequest);

  if (card) {
    renderCardPreview(card);
    console.log("📦 JSON Output:");
    console.log(JSON.stringify(card, null, 2));
  }
}

main().catch(console.error);
