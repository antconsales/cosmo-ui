import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import {
  COSMO_UI_SYSTEM_PROMPT,
  CONTEXTBADGE_SYSTEM_PROMPT,
  PROGRESSRING_SYSTEM_PROMPT,
  STATUSINDICATOR_SYSTEM_PROMPT,
  ACTIONBAR_SYSTEM_PROMPT,
  TOOLTIP_SYSTEM_PROMPT,
  MEDIACARD_SYSTEM_PROMPT,
  MINIPLAYER_SYSTEM_PROMPT,
  TIMER_SYSTEM_PROMPT,
  MESSAGEPREVIEW_SYSTEM_PROMPT,
  CONTACTCARD_SYSTEM_PROMPT,
  EVENTCARD_SYSTEM_PROMPT,
  WEATHERWIDGET_SYSTEM_PROMPT,
  QUICKSETTINGS_SYSTEM_PROMPT,
  ACTIVITYRING_SYSTEM_PROMPT,
  DIRECTIONARROW_SYSTEM_PROMPT,
  HUDCardCorrector,
  ContextBadgeCorrector,
  ProgressRingCorrector,
  StatusIndicatorCorrector,
} from "@cosmo/ai-adapter";

// Supported AI providers
type AIProvider = "gemini" | "openai" | "anthropic" | "deepseek";

// Correctors for each component type
const correctors = {
  hudcard: new HUDCardCorrector(),
  badge: new ContextBadgeCorrector(),
  ring: new ProgressRingCorrector(),
  status: new StatusIndicatorCorrector(),
};

// System prompts for each component
const systemPrompts: Record<string, string> = {
  // Core Components
  hudcard: COSMO_UI_SYSTEM_PROMPT,
  badge: CONTEXTBADGE_SYSTEM_PROMPT,
  ring: PROGRESSRING_SYSTEM_PROMPT,
  status: STATUSINDICATOR_SYSTEM_PROMPT,
  actionbar: ACTIONBAR_SYSTEM_PROMPT,
  tooltip: TOOLTIP_SYSTEM_PROMPT,
  // Media Components
  mediacard: MEDIACARD_SYSTEM_PROMPT,
  miniplayer: MINIPLAYER_SYSTEM_PROMPT,
  timer: TIMER_SYSTEM_PROMPT,
  // Communication Components
  message: MESSAGEPREVIEW_SYSTEM_PROMPT,
  contact: CONTACTCARD_SYSTEM_PROMPT,
  // Productivity Components
  event: EVENTCARD_SYSTEM_PROMPT,
  weather: WEATHERWIDGET_SYSTEM_PROMPT,
  // System Components
  settings: QUICKSETTINGS_SYSTEM_PROMPT,
  activity: ACTIVITYRING_SYSTEM_PROMPT,
  // Navigation Components
  direction: DIRECTIONARROW_SYSTEM_PROMPT,
};

// Component names for prompts
const componentNames: Record<string, string> = {
  // Core
  hudcard: "HUDCard",
  badge: "ContextBadge",
  ring: "ProgressRing",
  status: "StatusIndicator",
  actionbar: "ActionBar",
  tooltip: "Tooltip",
  // Media
  mediacard: "MediaCard",
  miniplayer: "MiniPlayer",
  timer: "Timer",
  // Communication
  message: "MessagePreview",
  contact: "ContactCard",
  // Productivity
  event: "EventCard",
  weather: "WeatherWidget",
  // System
  settings: "QuickSettings",
  activity: "ActivityRing",
  // Navigation
  direction: "DirectionArrow",
};

// Generate with Gemini
async function generateWithGemini(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const fullPrompt = `${systemPrompt}\n\n---\nUSER REQUEST: ${userPrompt}\n---\n\nGenerate a valid JSON object. Return ONLY the raw JSON (no markdown, no explanation).`;

  const result = await model.generateContent(fullPrompt);
  return result.response.text();
}

// Generate with OpenAI (GPT-4)
async function generateWithOpenAI(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const openai = new OpenAI({ apiKey });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `${userPrompt}\n\nGenerate a valid JSON object. Return ONLY the raw JSON (no markdown, no explanation).`,
      },
    ],
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || "";
}

// Generate with Anthropic (Claude)
async function generateWithAnthropic(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const anthropic = new Anthropic({ apiKey });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `${userPrompt}\n\nGenerate a valid JSON object. Return ONLY the raw JSON (no markdown, no explanation).`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock && textBlock.type === "text" ? textBlock.text : "";
}

// Generate with DeepSeek (OpenAI-compatible API)
async function generateWithDeepSeek(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const deepseek = new OpenAI({
    apiKey,
    baseURL: "https://api.deepseek.com/v1",
  });

  const response = await deepseek.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `${userPrompt}\n\nGenerate a valid JSON object. Return ONLY the raw JSON (no markdown, no explanation).`,
      },
    ],
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || "";
}

export async function POST(request: NextRequest) {
  try {
    const {
      prompt,
      apiKey,
      componentType = "hudcard",
      provider = "gemini",
    } = await request.json();

    if (!prompt || !apiKey) {
      return NextResponse.json(
        { error: "Missing prompt or API key" },
        { status: 400 }
      );
    }

    const systemPrompt = systemPrompts[componentType] || COSMO_UI_SYSTEM_PROMPT;
    const componentName = componentNames[componentType] || "HUDCard";

    const enhancedPrompt = `Generate a ${componentName} JSON for: ${prompt}. The id should be like "${componentType}-001".`;

    let content: string;

    // Call the appropriate AI provider
    switch (provider as AIProvider) {
      case "gemini":
        content = await generateWithGemini(apiKey, systemPrompt, enhancedPrompt);
        break;
      case "openai":
        content = await generateWithOpenAI(apiKey, systemPrompt, enhancedPrompt);
        break;
      case "anthropic":
        content = await generateWithAnthropic(apiKey, systemPrompt, enhancedPrompt);
        break;
      case "deepseek":
        content = await generateWithDeepSeek(apiKey, systemPrompt, enhancedPrompt);
        break;
      default:
        return NextResponse.json(
          { error: `Unknown provider: ${provider}` },
          { status: 400 }
        );
    }

    if (!content) {
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 500 }
      );
    }

    // Parse JSON from response (handle markdown code blocks)
    let jsonContent = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1].trim();
    } else {
      const rawJsonMatch = content.match(/\{[\s\S]*\}/);
      if (rawJsonMatch) {
        jsonContent = rawJsonMatch[0];
      }
    }

    const parsed = JSON.parse(jsonContent);

    // Validate and sanitize with the appropriate corrector
    const corrector = correctors[componentType as keyof typeof correctors];
    let validationResult;

    if (corrector) {
      validationResult = corrector.validateAndCorrect(parsed);
    } else {
      validationResult = { isValid: true, sanitized: parsed };
    }

    return NextResponse.json({
      success: true,
      component: validationResult.sanitized || parsed,
      componentType,
      provider,
      isValid: validationResult.isValid,
      errors: validationResult.errors,
      warnings: validationResult.warnings,
      raw: content,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
