# @aura/core-schema

Type definitions and schemas for Aura UI components.

## What's inside?

- `HUDCard` - Type definitions for HUDCard component
- `HUDCARD_CONSTRAINTS` - Validation constraints

## Usage

```typescript
import type { HUDCard } from "@aura/core-schema";
import { HUDCARD_CONSTRAINTS } from "@aura/core-schema";

const card: HUDCard = {
  id: "card-1",
  title: "Example Card",
  content: "This is an example HUDCard",
  variant: "info",
};
```

## Version

0.1.0 - Initial HUDCard schema
