# COSMO UI v2.0

**AI-First Cross-Reality UI Framework**

> A UI framework designed for AI models to generate, manipulate, and reason about interfaces across Web, AR, and VR platforms.

[![npm version](https://badge.fury.io/js/@cosmo%2Fcore-schema.svg)](https://www.npmjs.com/package/@cosmo/core-schema)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## What's New in v2.0

COSMO UI v2.0 introduces revolutionary concepts that make it truly unique:

| Feature | Description |
|---------|-------------|
| **Spatial Intent** | AI declares WHAT, not WHERE - "this needs attention" vs "put at top-right" |
| **Adaptive Complexity** | UI automatically simplifies based on user context (walking, driving, etc.) |
| **Voice-First** | Every component supports voice triggers and speech feedback |
| **AI Confidence** | Components include confidence scores and reasoning metadata |
| **Multi-Agent** | Multiple AI agents can coordinate UI without conflicts |
| **Theme System** | Full design tokens with light/dark/AR themes |
| **16 Components** | From notifications to weather widgets to navigation arrows |

---

## The Problem

Traditional UI libraries are built for **humans** to code:
- Complex APIs with hundreds of props
- Infinite customization possibilities
- No constraints = unpredictable outputs
- AI models struggle to generate consistent, valid UI

**Result**: When you ask an AI to "create a notification", you get wildly inconsistent, often invalid results.

---

## The COSMO Solution

```
Traditional: Human writes code → UI renders
COSMO UI:    AI generates JSON → Validator checks → UI renders (Web/AR/VR)
```

### Core Innovations

1. **Spatial Intent**: AI expresses intent ("needs attention", "background info") → System decides placement
2. **Constrained Schemas**: Limited, well-defined options (not infinite customization)
3. **Adaptive Complexity**: UI automatically adjusts to user context
4. **Self-Correction Loop**: Validators + correctors fix AI mistakes
5. **Cross-Reality**: Same schema renders on Web, AR glasses, VR headsets

---

## Installation

```bash
# Using npm
npm install @cosmo/core-schema @cosmo/renderer-web

# Using pnpm
pnpm add @cosmo/core-schema @cosmo/renderer-web

# Using yarn
yarn add @cosmo/core-schema @cosmo/renderer-web
```

---

## Quick Start

### Basic Usage (React)

```tsx
import { CosmoProvider, HUDCard, ContextBadge } from '@cosmo/renderer-web';

function App() {
  return (
    <CosmoProvider theme={{ default: 'dark' }}>
      <HUDCard
        card={{
          id: 'welcome',
          title: 'Welcome!',
          content: 'COSMO UI is ready.',
          variant: 'success',
          icon: 'check'
        }}
      />
      <ContextBadge
        badge={{
          id: 'status',
          label: 'Online',
          variant: 'success',
          pulse: true
        }}
      />
    </CosmoProvider>
  );
}
```

### With AI Generation

```typescript
import { COSMO_UI_ADVANCED_SYSTEM_PROMPT } from '@cosmo/ai-adapter';
import { validateHUDCard } from '@cosmo/validator';
import { HUDCard } from '@cosmo/renderer-web';

// 1. Send prompt to AI
const response = await aiModel.generate({
  systemPrompt: COSMO_UI_ADVANCED_SYSTEM_PROMPT,
  userPrompt: "Show a reminder about my meeting in 5 minutes"
});

// 2. Validate the response
const result = validateHUDCard(JSON.parse(response));

// 3. Render if valid
if (result.isValid) {
  return <HUDCard card={result.card} />;
}
```

---

## Spatial Intent System

The revolutionary feature of COSMO UI v2.0. Instead of specifying positions, AI declares **intent**:

```typescript
// Traditional approach
{ position: "top-right" }

// COSMO Spatial Intent
{
  spatialIntent: {
    intent: "attention",    // NEEDS focus
    urgency: "high",
    persistence: "medium"
  }
}
```

### Available Intents

| Intent | Description | Example Use |
|--------|-------------|-------------|
| `attention` | Needs user focus | Critical errors, calls |
| `peripheral` | Background awareness | Battery, connection status |
| `ambient` | Environmental info | Weather, time |
| `contextual` | Related to focus | Product info when looking at item |
| `persistent` | Always visible | Navigation heading, score |
| `temporal` | Brief appearance | "Saved!" confirmations |
| `spatial-anchor` | World-locked (AR) | Labels on buildings |
| `follow-gaze` | Follows user gaze | Cursor feedback |
| `companion` | Moves with user | AI assistant avatar |

### How It Works

```
AI: "This is urgent and needs attention"
    ↓
System detects: User is on AR glasses, walking
    ↓
Renders: Audio announcement + brief visual in safe zone
```

---

## Adaptive Complexity

UI automatically adjusts based on user context:

```typescript
// Context signals
{
  activity: "walking",      // stationary, walking, driving, exercising
  cognitiveLoad: "high",    // low, medium, high, overloaded
  deviceType: "ar",         // phone, tablet, desktop, ar, vr
}

// Result: Simplified UI
{
  // Full version: "Sprint Planning with Product Team in Conference Room A"
  // Walking version: "Meeting - Room A"
  // Driving version: "Meeting soon" (audio only)
}
```

---

## Voice-First Design

Every component supports voice interaction:

```json
{
  "id": "meeting-reminder",
  "title": "Meeting in 5 minutes",
  "voiceActions": [
    {
      "triggers": ["join meeting", "join now"],
      "actionId": "join",
      "voiceResponse": { "text": "Joining Sprint Planning now" }
    },
    {
      "triggers": ["snooze", "remind me later"],
      "actionId": "snooze",
      "voiceResponse": { "text": "I'll remind you in 5 minutes" }
    }
  ],
  "voiceReadout": {
    "announcement": "You have a meeting in 5 minutes",
    "promptForAction": "Say 'join' or 'snooze'"
  }
}
```

### React Hooks

```tsx
import { useVoiceCommands, useTextToSpeech } from '@cosmo/renderer-web';

function VoiceEnabledCard({ card }) {
  const { startListening, registerActions } = useVoiceCommands({
    onActionMatched: (actionId) => handleAction(actionId)
  });

  const { speak } = useTextToSpeech();

  useEffect(() => {
    registerActions(card.voiceActions);
  }, [card]);

  return (
    <button onClick={startListening}>Voice Command</button>
  );
}
```

---

## Components (16 Total)

### Core Components
| Component | Description |
|-----------|-------------|
| **HUDCard** | Notifications, alerts, confirmations |
| **ContextBadge** | Status pills with pulse animations |
| **ProgressRing** | Circular progress indicators |
| **StatusIndicator** | Simple state dots |
| **ActionBar** | Navigation with quick-access buttons |
| **Tooltip** | Contextual help popups |

### Media Components
| Component | Description |
|-----------|-------------|
| **MediaCard** | Images, videos, audio with metadata |
| **MiniPlayer** | Compact audio/video player |
| **Timer** | Countdown, stopwatch, pomodoro |

### Communication Components
| Component | Description |
|-----------|-------------|
| **MessagePreview** | Incoming message notifications |
| **ContactCard** | Person/contact information |

### Productivity Components
| Component | Description |
|-----------|-------------|
| **EventCard** | Calendar events, appointments |
| **WeatherWidget** | Weather and forecasts |

### System Components
| Component | Description |
|-----------|-------------|
| **QuickSettings** | WiFi, Bluetooth, brightness toggles |
| **ActivityRing** | Fitness rings like Apple Watch |

### Navigation Components
| Component | Description |
|-----------|-------------|
| **DirectionArrow** | AR wayfinding guidance |

---

## Packages

| Package | Description |
|---------|-------------|
| `@cosmo/core-schema` | Types, themes, spatial, adaptive, voice, icons |
| `@cosmo/validator` | Runtime validation & sanitization |
| `@cosmo/renderer-web` | React components + hooks |
| `@cosmo/renderer-ar` | WebXR + Three.js renderer |
| `@cosmo/ai-adapter` | AI prompts and correction loops |
| `@cosmo/renderer-meta` | Meta Quest renderer (planned) |

---

## Theme System

Full design token system with light, dark, and AR themes:

```tsx
import { CosmoProvider, useTheme, useThemeColors } from '@cosmo/renderer-web';

// Using the provider
<CosmoProvider
  theme={{
    default: 'dark',
    detectSystem: true,      // Auto-detect OS preference
    injectCSS: true          // Inject CSS variables
  }}
>
  <App />
</CosmoProvider>

// Using hooks
function MyComponent() {
  const { theme, setTheme, isDark } = useTheme();
  const colors = useThemeColors();

  return (
    <div style={{ background: colors.surface.primary }}>
      <button onClick={() => setTheme(isDark ? 'light' : 'dark')}>
        Toggle Theme
      </button>
    </div>
  );
}
```

### Available Themes

- **Light**: Clean, bright interfaces
- **Dark**: Eye-friendly dark mode
- **AR**: High contrast for AR overlays (semi-transparent backgrounds)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         COSMO UI v2.0                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   AI Model   │───▶│  ai-adapter  │───▶│  validator   │      │
│  │ (Any LLM)    │    │   + prompts  │    │   + schema   │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                   │                    │               │
│         │                   ▼                    │               │
│         │           ┌──────────────┐             │               │
│         │           │ core-schema  │             │               │
│         │           │ Theme        │             │               │
│         │           │ Spatial      │◀────────────┘               │
│         │           │ Adaptive     │                             │
│         │           │ Voice        │                             │
│         └──────────▶│ Icons        │                             │
│                     └──────────────┘                             │
│                            │                                     │
│            ┌───────────────┼───────────────┐                    │
│            ▼               ▼               ▼                    │
│     ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│     │renderer-web │ │ renderer-ar │ │renderer-meta│            │
│     │   React     │ │  WebXR/R3F  │ │  Meta Quest │            │
│     │   Hooks     │ │  troika-3d  │ │   (planned) │            │
│     └─────────────┘ └─────────────┘ └─────────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Clone
git clone https://github.com/antonioconsales/cosmo-ui.git
cd cosmo-ui

# Install
pnpm install

# Build all packages
pnpm build

# Run Storybook
pnpm storybook

# Run tests
pnpm test
```

### Publishing

```bash
# Create a changeset
pnpm changeset

# Version packages
pnpm version-packages

# Publish to npm
pnpm release
```

---

## Examples

### AI-Generated Notification

```typescript
// User says: "Remind me about the meeting"
const card = {
  id: "meeting-reminder-001",
  title: "Meeting in 5 minutes",
  content: "Sprint Planning with Product Team",
  variant: "info",
  icon: "calendar",
  spatialIntent: {
    intent: "attention",
    urgency: "high"
  },
  aiMetadata: {
    confidence: 0.92,
    reasoning: "User has a calendar event at this time"
  },
  voiceActions: [
    { triggers: ["join"], actionId: "join" },
    { triggers: ["snooze"], actionId: "snooze" }
  ]
};
```

### AR Navigation

```typescript
const arrow = {
  id: "nav-001",
  destination: { name: "Coffee Shop" },
  bearing: 45,
  distance: 200,
  distanceUnit: "meters",
  spatialIntent: {
    intent: "persistent",
    distanceFromUser: "comfortable"
  }
};
```

### Adaptive Weather Widget

```typescript
const weather = {
  id: "weather-001",
  location: "San Francisco",
  temperature: 72,
  condition: "clear",
  // Adaptive hints for different complexity levels
  adaptiveHints: {
    minimal: "72° Clear",
    standard: "72°F Clear - San Francisco",
    full: "72°F Clear in San Francisco. High 78°, Low 62°"
  }
};
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

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

MIT License - See [LICENSE](LICENSE) for details

---

## Author

**Antonio Consales** - Frontend/Mobile Developer exploring AI-first AR interfaces

---

```
     ██████╗ ██████╗ ███████╗███╗   ███╗ ██████╗
    ██╔════╝██╔═══██╗██╔════╝████╗ ████║██╔═══██╗
    ██║     ██║   ██║███████╗██╔████╔██║██║   ██║
    ██║     ██║   ██║╚════██║██║╚██╔╝██║██║   ██║
    ╚██████╗╚██████╔╝███████║██║ ╚═╝ ██║╚██████╔╝
     ╚═════╝ ╚═════╝ ╚══════╝╚═╝     ╚═╝ ╚═════╝
              AI-First Cross-Reality UI v2.0
```
