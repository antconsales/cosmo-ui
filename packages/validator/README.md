# @aura/validator

Runtime validation and sanitization for Aura UI components.

## What's inside?

- `HUDCardValidator` - Validates and sanitizes HUDCard schemas
- `ValidationResult` - Type for validation results

## Usage

```typescript
import { HUDCardValidator } from "@aura/validator";
import type { HUDCard } from "@aura/core-schema";

const validator = new HUDCardValidator();

// Validate a card
const result = validator.validate(card);
if (!result.valid) {
  console.error("Validation errors:", result.errors);
}

// Sanitize a partial card (applies safe defaults)
const sanitized = validator.sanitize({
  title: "Example",
  content: "Content here",
});
```

## Version

0.1.0 - Initial HUDCard validator
