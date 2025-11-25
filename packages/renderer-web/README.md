# @aura/renderer-web

React renderer for Aura UI components (Web).

## What's inside?

- `HUDCard` - React component for rendering HUDCard

## Usage

```typescript
import { HUDCard } from "@aura/renderer-web";
import type { HUDCard as HUDCardType } from "@aura/core-schema";

const card: HUDCardType = {
  id: "card-1",
  title: "Example",
  content: "This is an example card",
  variant: "info",
};

function App() {
  return (
    <HUDCard
      card={card}
      onDismiss={(id) => console.log("Dismissed:", id)}
      onAction={(cardId, actionId) => console.log("Action:", actionId)}
    />
  );
}
```

## Version

0.1.0 - Initial HUDCard web renderer (placeholder styling)
