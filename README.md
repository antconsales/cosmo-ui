# COSMO UI

**AI-first Cross-Reality UI Framework**

> A UI framework designed for AI models to generate, manipulate, and reason about interfaces across Web, AR, and Mobile platforms.

---

## The Problem

Traditional UI libraries are built for **humans** to code:
- Complex APIs with hundreds of props
- Infinite customization possibilities
- No constraints = unpredictable outputs
- AI models struggle to generate consistent, valid UI

**Result**: When you ask an AI to "create a notification", you get wildly inconsistent, often invalid results.

---

## The Solution: COSMO UI

COSMO UI flips the paradigm:

```
Traditional: Human writes code → UI renders
COSMO UI:    AI generates JSON → Validator checks → UI renders
```

### Core Innovation

1. **Constrained Schemas**: Limited, well-defined options (not infinite customization)
2. **AI-Optimized Prompts**: System prompts that teach models the schema
3. **Self-Correction Loop**: Validators + correctors fix AI mistakes automatically
4. **Cross-Reality**: Same schema renders on Web, AR glasses, Mobile

---

## Why It's Innovative

| Traditional UI | COSMO UI |
|----------------|----------|
| Humans write JSX/HTML | AI generates JSON |
| Infinite props/options | Constrained schemas |
| No validation at generation | Built-in validators |
| Platform-specific code | One schema, multi-renderer |
| Manual error handling | Self-correcting AI loop |

### Key Differentiators

1. **AI-Native**: Not adapted for AI—built from scratch for AI generation
2. **Non-Invasive AR**: Designed for glanceable, ephemeral AR interfaces (not cluttered UIs)
3. **Safety First**: Strict constraints prevent visual overload and invalid states
4. **Self-Healing**: AI correction loops automatically fix invalid outputs

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         COSMO UI v0.4                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   AI Model   │───▶│  ai-adapter  │───▶│  validator   │      │
│  │ (Gemini/GPT) │    │   prompts    │    │   schemas    │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                                       │               │
│         ▼                                       ▼               │
│  ┌──────────────┐                      ┌──────────────┐        │
│  │ JSON Schema  │─────────────────────▶│ core-schema  │        │
│  │   Output     │                      │    types     │        │
│  └──────────────┘                      └──────────────┘        │
│                                                │                │
│                    ┌───────────────────────────┼────────┐      │
│                    ▼                           ▼        ▼      │
│            ┌─────────────┐          ┌─────────────┐  ┌─────┐  │
│            │renderer-web │          │ renderer-ar │  │ RN  │  │
│            │   (React)   │          │  (WebXR)    │  │     │  │
│            └─────────────┘          └─────────────┘  └─────┘  │
│                    │                                           │
│                    ▼                                           │
│            ┌─────────────┐                                     │
│            │  Storybook  │                                     │
│            │  Web Demo   │                                     │
│            └─────────────┘                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Components (v0.4)

COSMO UI provides **6 AI-optimized components**:

### Component Gallery (Storybook)

| Component | What you see in Storybook | Story file |
|-----------|--------------------------|------------|
| HUDCard | Floating toast with title/content, variants that shift background/edge glow, dismissal demo | `stories/HUDCard.stories.tsx` |
| ContextBadge | Pill-shaped badge with pulse animation toggle and status color palette | `stories/ContextBadge.stories.tsx` |
| ProgressRing | Circular progress arc with numeric center label and variant-based glow | `stories/ProgressRing.stories.tsx` |
| StatusIndicator | Compact dot/label combo showing online/offline/recording states | `stories/StatusIndicator.stories.tsx` |
| ActionBar | Glassmorphism nav bar with active/disabled states plus horizontal/vertical layouts | `stories/ActionBar.stories.tsx` |
| Tooltip | Minimal bubble with caret that previews each placement + info/warning variants | `stories/Tooltip.stories.tsx` |

### 1. HUDCard
Lightweight, glanceable notification/info cards.

```json
{
  "id": "card-001",
  "title": "File Saved",
  "content": "Your document has been saved successfully.",
  "variant": "success",
  "icon": "check",
  "autoHideAfterSeconds": 5
}
```

**Use Cases**: Notifications, alerts, confirmations, system messages

### 2. ContextBadge
Compact status indicators with optional pulse animations.

```json
{
  "id": "badge-001",
  "label": "Live",
  "variant": "success",
  "pulse": true
}
```

**Use Cases**: Online/offline status, live indicators, sync states

### 3. ProgressRing
Circular progress indicators with percentage display.

```json
{
  "id": "ring-001",
  "value": 75,
  "max": 100,
  "label": "Uploading...",
  "variant": "info"
}
```

**Use Cases**: Downloads, uploads, goals, loading states

### 4. StatusIndicator
Simple state indicators (online, recording, loading, error).

```json
{
  "id": "status-001",
  "state": "online",
  "label": "Connected"
}
```

**Use Cases**: Connection status, recording indicators, system health

### 5. ActionBar
Bottom/side navigation with quick-access buttons.

```json
{
  "id": "actionbar-001",
  "items": [
    { "id": "home", "icon": "home", "label": "Home", "active": true },
    { "id": "search", "icon": "search", "label": "Search" },
    { "id": "profile", "icon": "user", "label": "Profile" }
  ],
  "position": "bottom",
  "variant": "glass"
}
```

**Use Cases**: App navigation, media controls, tool palettes

### 6. Tooltip
Contextual help and information popups.

```json
{
  "id": "tooltip-001",
  "content": "Click to save your changes",
  "position": "top",
  "variant": "info"
}
```

**Use Cases**: Help text, feature explanations, warnings

---

## Use Cases

### 1. AI Assistants with Visual Feedback

```
User: "Remind me about the meeting in 5 minutes"
AI generates: HUDCard { variant: "info", title: "Reminder Set", content: "Meeting in 5 minutes" }
```

### 2. AR Smart Glasses

```
Context: User looking at low battery device
AI generates: ContextBadge { label: "15%", variant: "warning", pulse: true }
```

### 3. Voice-Controlled Interfaces

```
User: "Show my download progress"
AI generates: ProgressRing { value: 67, label: "Downloading...", variant: "info" }
```

### 4. Autonomous AI Agents

```
Agent: Completed file backup task
Agent generates: HUDCard { variant: "success", title: "Backup Complete" }
```

### 5. Cross-Reality Apps

```
Same notification schema renders as:
- Web: Toast notification in corner
- AR: Floating card in peripheral vision
- Mobile: Push notification style card
```

---

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| `@cosmo/core-schema` | TypeScript type definitions | ✅ Stable |
| `@cosmo/validator` | Runtime validation & sanitization | ✅ Stable |
| `@cosmo/renderer-web` | React components for web | ✅ Stable |
| `@cosmo/ai-adapter` | AI prompts, examples, correctors | ✅ Stable |
| `@cosmo/renderer-ar` | WebXR renderer for AR | 🚧 Planned |
| `@cosmo/renderer-native` | React Native renderer | 🚧 Planned |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cosmo-ui.git
cd cosmo-ui

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Run Storybook (Component Explorer)

```bash
pnpm storybook
# Opens at http://localhost:6006
```

Storybook provides:
- Interactive component playground
- All variants and states
- Props documentation
- Copy-paste JSON examples

### Run AI Demo (Gemini Integration)

```bash
cd examples/web-ai-demo
pnpm dev
# Opens at http://localhost:3002
```

The AI demo allows you to:
1. Enter a Gemini API key
2. Select a component type
3. Describe what you want in natural language
4. See the AI-generated component render live

### Run Tests

```bash
pnpm test
# Runs Vitest unit tests across all packages
```

---

## How AI Generation Works

### 1. System Prompts

Each component has an optimized system prompt that teaches the AI model:

```typescript
import { COSMO_UI_SYSTEM_PROMPT } from "@cosmo/ai-adapter";

// Send to AI model
const response = await model.generate({
  systemPrompt: COSMO_UI_SYSTEM_PROMPT,
  userPrompt: "Show a success notification for file saved"
});
```

### 2. Validation & Correction

The AI output goes through validation:

```typescript
import { HUDCardCorrector } from "@cosmo/ai-adapter";
import { validateHUDCard } from "@cosmo/validator";

const corrector = new HUDCardCorrector();
const result = await corrector.correct(aiOutput);

if (result.isValid) {
  // Render the component
  renderHUDCard(result.card);
} else {
  // Log errors for debugging
  console.log(result.errors);
}
```

### 3. Rendering

The validated JSON renders to React components:

```tsx
import { HUDCard } from "@cosmo/renderer-web";

function App() {
  return (
    <HUDCard
      card={validatedCard}
      onDismiss={() => {}}
    />
  );
}
```

---

## Project Structure

```
COSMOUI/
├── packages/
│   ├── core-schema/          # TypeScript type definitions
│   │   └── src/
│   │       ├── index.ts
│   │       └── components/   # HUDCard, ActionBar, etc.
│   │
│   ├── validator/            # Runtime validation
│   │   └── src/
│   │       └── schemas/      # Zod schemas for each component
│   │
│   ├── renderer-web/         # React components
│   │   └── src/
│   │       ├── components/   # HUDCard.tsx, ActionBar.tsx, etc.
│   │       └── stories/      # Storybook stories
│   │
│   └── ai-adapter/           # AI integration layer
│       └── src/
│           ├── prompts/      # System prompts for each component
│           ├── corrector.ts  # Self-correction loops
│           └── examples/     # Few-shot examples for AI
│
├── examples/
│   ├── web-basic/            # Simple usage example
│   └── web-ai-demo/          # Full AI generation demo
│
├── .storybook/               # Storybook configuration
├── vitest.config.ts          # Test configuration
└── pnpm-workspace.yaml       # Monorepo config
```

---

## Roadmap

- [x] **v0.1**: HUDCard schema + web renderer
- [x] **v0.2**: ContextBadge + ProgressRing
- [x] **v0.3**: StatusIndicator + AI correction loops
- [x] **v0.4**: ActionBar + Tooltip + Storybook + Vitest + CI/CD
- [ ] **v0.5**: AR renderer (WebXR) prototype
- [ ] **v0.6**: React Native renderer
- [ ] **v0.7**: Composite components (Dashboard, NotificationCenter)
- [ ] **v1.0**: Production-ready with full documentation

---

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

### Development

```bash
# Install dependencies
pnpm install

# Build all packages (watch mode)
pnpm dev

# Run tests
pnpm test

# Run Storybook
pnpm storybook
```

---

## Why "COSMO"?

**C**ross-reality
**O**ptimized
**S**chema-driven
**M**odel-first
**O**utputs

A framework that lets AI models output consistent, validated UI across any reality.

---

## Author

**Antonio Consales** - Frontend/Mobile Developer exploring AI-first AR interfaces

---

## License

MIT License - See [LICENSE](LICENSE) for details

---

*Built with the vision of AI-generated cross-reality interfaces*

```
     ██████╗ ██████╗ ███████╗███╗   ███╗ ██████╗
    ██╔════╝██╔═══██╗██╔════╝████╗ ████║██╔═══██╗
    ██║     ██║   ██║███████╗██╔████╔██║██║   ██║
    ██║     ██║   ██║╚════██║██║╚██╔╝██║██║   ██║
    ╚██████╗╚██████╔╝███████║██║ ╚═╝ ██║╚██████╔╝
     ╚═════╝ ╚═════╝ ╚══════╝╚═╝     ╚═╝ ╚═════╝
              AI-First Cross-Reality UI
```
