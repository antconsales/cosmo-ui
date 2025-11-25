# @aura/ai-adapter

AI integration layer for Aura UI - prompts, examples, and validation helpers for LLM-generated HUDCards.

## Purpose

This package enables AI models to:
- Generate valid HUDCard schemas from natural language
- Learn from few-shot examples
- Receive validation feedback
- Correct errors automatically

## Installation

```bash
pnpm add @aura/ai-adapter
```

## Quick Start

### 1. Generate a Prompt for AI

```typescript
import { buildGenerationPrompt } from "@aura/ai-adapter";

const prompt = buildGenerationPrompt({
  intent: "Show a notification that file upload completed",
  fewShotCount: 3, // Include 3 random examples
});

// Send this prompt to your LLM (GPT-4, Claude, etc.)
const aiResponse = await callYourLLM(prompt);
```

### 2. Validate AI Output

```typescript
import { validateHUDCard } from "@aura/ai-adapter";

// Parse AI response
const card = JSON.parse(aiResponse);

// Validate
const result = validateHUDCard(card);

if (result.isValid) {
  console.log("Valid card:", result.card);
  // Render it!
} else {
  console.log("Errors:", result.errors);
  console.log("Correction prompt:", result.correctionPrompt);
  // Send correction prompt back to AI
}
```

### 3. Full Correction Loop

```typescript
import { HUDCardCorrector } from "@aura/ai-adapter";

const corrector = new HUDCardCorrector();

// First attempt
let card = JSON.parse(aiResponse);
let result = corrector.validateAndCorrect(card);

// Auto-retry if needed
let retries = 0;
while (!result.isValid && retries < 3) {
  console.log("Validation failed, asking AI to correct...");

  const correctionResponse = await callYourLLM(result.correctionPrompt);
  card = JSON.parse(correctionResponse);
  result = corrector.validateAndCorrect(card);

  retries++;
}

if (result.isValid) {
  // Success! Render the card
  renderCard(result.card);
}
```

## API Reference

### Prompts

#### `buildGenerationPrompt(options)`

Generates a complete prompt for AI to create a HUDCard.

```typescript
interface GenerationOptions {
  intent: string; // What the card should do
  fewShotCount?: number; // Number of examples (default: 3)
  includeSystemPrompt?: boolean; // Include system instructions (default: true)
}
```

**Example:**

```typescript
const prompt = buildGenerationPrompt({
  intent: "Warn user about low battery",
  fewShotCount: 2,
});
```

#### `buildQuickPrompt(intent)`

Minimal prompt for simple generation.

```typescript
const prompt = buildQuickPrompt("Notify about new message");
```

#### `buildCorrectionPrompt(card, errors)`

Generates prompt to fix validation errors.

```typescript
const prompt = buildCorrectionPrompt(
  { id: "1", title: "Very long title that exceeds the maximum allowed...", content: "..." },
  [{ field: "title", message: "title exceeds max length of 60 chars" }]
);
```

#### `buildBatchGenerationPrompt(intents[])`

Generate multiple cards at once.

```typescript
const prompt = buildBatchGenerationPrompt([
  "Notify about download complete",
  "Show connection error",
  "Remind about meeting",
]);
// AI returns JSON array of cards
```

#### `buildConstrainedPrompt(intent, constraints)`

Generate card with specific requirements.

```typescript
const prompt = buildConstrainedPrompt(
  "Show success message",
  {
    variant: "success",
    position: "bottom-right",
    priority: 2,
  }
);
```

### Validation

#### `validateHUDCard(card)`

Quick validation helper.

```typescript
const result = validateHUDCard(partialCard);

// Returns CorrectionResult:
interface CorrectionResult {
  isValid: boolean;
  card?: HUDCard; // Sanitized, valid card
  errors?: Array<{ field: string; message: string }>;
  warnings?: Array<{ field: string; message: string }>;
  correctionPrompt?: string; // Ready to send back to AI
  sanitized?: HUDCard; // Card with safe defaults applied
}
```

#### `HUDCardCorrector`

Full validation and correction class.

```typescript
const corrector = new HUDCardCorrector();

// Validate one card
const result = corrector.validateAndCorrect(card);

// Validate multiple
const results = corrector.validateBatch([card1, card2, card3]);

// Check if safe to render
if (corrector.isSafeToRender(result)) {
  renderCard(result.sanitized);
}

// Get error summary
console.log(corrector.getErrorSummary(result)); // "2 errors, 1 warning"

// Get correction hints
const hints = corrector.generateHints(result);
// ["Shorten the title to 60 characters or less"]
```

#### `formatValidationErrors(result)`

Convert errors to readable text.

```typescript
const errorText = formatValidationErrors(result);
console.log(errorText);
// Errors:
//   1. [title] title exceeds max length of 60 chars
//   2. [actions] max 2 actions allowed
```

### Examples

#### `HUDCARD_EXAMPLES`

Array of 23 training examples covering all use cases.

```typescript
import { HUDCARD_EXAMPLES } from "@aura/ai-adapter";

// All examples
console.log(HUDCARD_EXAMPLES.length); // 23

// Each example has:
// { intent: string, card: HUDCard }
```

#### `getRandomExamples(count)`

Get random examples for few-shot learning.

```typescript
import { getRandomExamples } from "@aura/ai-adapter";

const examples = getRandomExamples(5);
// Returns 5 random examples
```

#### `getExamplesByVariant(variant)`

Filter examples by variant.

```typescript
import { getExamplesByVariant } from "@aura/ai-adapter";

const successExamples = getExamplesByVariant("success");
const errorExamples = getExamplesByVariant("error");
```

#### `getExamplesByPriority(priority)`

Filter examples by priority.

```typescript
import { getExamplesByPriority } from "@aura/ai-adapter";

const criticalExamples = getExamplesByPriority(5);
```

### System Prompt

#### `AURA_UI_SYSTEM_PROMPT`

Complete system prompt explaining HUDCard to AI models.

```typescript
import { AURA_UI_SYSTEM_PROMPT } from "@aura/ai-adapter";

// Use as system message in LLM API call
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "system", content: AURA_UI_SYSTEM_PROMPT },
    { role: "user", content: "Generate a notification for new email" },
  ],
});
```

#### `HUDCARD_SCHEMA_DOCS`

Machine-readable schema documentation.

```typescript
import { HUDCARD_SCHEMA_DOCS } from "@aura/ai-adapter";

// Full schema metadata
console.log(HUDCARD_SCHEMA_DOCS.name); // "HUDCard"
console.log(HUDCARD_SCHEMA_DOCS.version); // "0.2.0"
console.log(HUDCARD_SCHEMA_DOCS.required); // ["id", "title", "content"]
console.log(HUDCARD_SCHEMA_DOCS.fields.title.constraints); // { maxLength: 60 }
```

## Complete Integration Example

```typescript
import {
  buildGenerationPrompt,
  HUDCardCorrector,
  AURA_UI_SYSTEM_PROMPT,
} from "@aura/ai-adapter";
import { HUDCardManager } from "@aura/renderer-web";

// 1. Setup
const corrector = new HUDCardCorrector();

// 2. Generate HUDCard from intent
async function generateCard(intent: string) {
  // Build prompt
  const prompt = buildGenerationPrompt({ intent, fewShotCount: 3 });

  // Call LLM (example with OpenAI)
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: AURA_UI_SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
  });

  // Parse response
  const cardJSON = response.choices[0].message.content;
  const card = JSON.parse(cardJSON);

  // Validate
  const result = corrector.validateAndCorrect(card);

  if (!result.isValid) {
    // Retry with correction
    const correctionResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: AURA_UI_SYSTEM_PROMPT },
        { role: "user", content: result.correctionPrompt },
      ],
    });

    const correctedJSON = correctionResponse.choices[0].message.content;
    const correctedCard = JSON.parse(correctedJSON);

    return corrector.validateAndCorrect(correctedCard);
  }

  return result;
}

// 3. Use in React app
function AICardDemo() {
  const { addCard } = useHUDCardManager();

  const handleGenerate = async () => {
    const result = await generateCard("Show success message for file upload");

    if (result.isValid && result.card) {
      addCard(result.card);
    } else {
      console.error("Failed to generate valid card:", result.errors);
    }
  };

  return <button onClick={handleGenerate}>Generate AI Card</button>;
}
```

## Best Practices

### For Training LLMs

1. **Use few-shot examples**: Include 3-5 examples in prompts
2. **Start with system prompt**: Use `AURA_UI_SYSTEM_PROMPT`
3. **Validate always**: Never trust AI output blindly
4. **Enable correction loop**: Retry 1-2 times on errors

### For Production

1. **Set timeouts**: LLM calls can be slow
2. **Cache examples**: Don't regenerate prompts every time
3. **Log failures**: Track which intents fail validation
4. **Fallback to defaults**: Have backup cards ready

### For Fine-tuning

1. **Use `HUDCARD_EXAMPLES`**: 23 diverse training examples
2. **Add your own**: Extend examples for your domain
3. **Track corrections**: Learn from validation errors
4. **Measure accuracy**: How many pass validation first try?

## Version

0.1.0 - Initial release with HUDCard support

## License

MIT
