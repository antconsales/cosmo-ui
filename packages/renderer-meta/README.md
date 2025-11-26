# @cosmo/renderer-meta

Meta Ray-Ban Display renderer for Cosmo UI - optimized for smart glasses with HUD display.

> **Status: PREVIEW**
> Ready to integrate with Meta Wearables SDK when Display API becomes available (expected 2026).

## Features

- **Optimized for small HUD display** - Automatic text truncation, compact layouts
- **Neural Band gesture support** - Pinch, swipe, hold gesture mappings
- **Audio feedback** - Notification sounds, voice output
- **Priority queue** - Important notifications shown first
- **Glanceable design** - Designed for peripheral vision

## Installation

```bash
pnpm add @cosmo/renderer-meta
```

## Usage

```typescript
import { MetaRenderer } from '@cosmo/renderer-meta';
import type { HUDCard } from '@cosmo/core-schema';

// Create renderer with custom config
const renderer = new MetaRenderer({
  position: 'top-right',
  brightness: 0.8,
  autoDim: true,
});

// Render a HUDCard
const card: HUDCard = {
  id: 'notification-1',
  title: 'New Message',
  content: 'John: Hey, are you free?',
  icon: 'message',
  priority: 3,
  variant: 'compact',
};

const output = renderer.renderHUDCard(card);
renderer.enqueue(output);

// Handle gestures from Neural Band
renderer.handleGesture({
  gesture: 'pinch',
  confidence: 0.95,
  timestamp: Date.now(),
});
```

## Gesture Mapping

| Gesture | Default Action |
|---------|----------------|
| `pinch` | Primary action (confirm, open) |
| `double-pinch` | Secondary action |
| `swipe-right` | Dismiss / Next |
| `swipe-left` | Previous |
| `hold` | Context menu |

## Display Constraints

The Ray-Ban Meta Display has limited screen real estate. Components are automatically adapted:

| Component | Adaptation |
|-----------|------------|
| HUDCard | Title max 30 chars, content max 50 chars |
| ContextBadge | Label max 20 chars, minimal layout |
| NotificationToast | Title 25 chars, message 40 chars |
| Timer | Time-only display |

## Audio Feedback

```typescript
import type { AudioFeedback } from '@cosmo/renderer-meta';

// Notification types
const sounds: AudioFeedbackType[] = [
  'notification', // Short chime
  'success',      // Positive tone
  'error',        // Warning tone
  'tap',          // Subtle click
  'voice',        // Text-to-speech
];
```

## Registration

To develop for Meta Ray-Ban smart glasses:

1. Sign up at [Meta Wearables Developer Portal](https://developers.meta.com/wearables/)
2. Request access to Device Access Toolkit
3. Wait for Display API access (currently limited to partners)

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Your App                          │
├─────────────────────────────────────────────────────┤
│              @cosmo/ai-adapter                       │
│         (AI generates component schemas)             │
├─────────────────────────────────────────────────────┤
│              @cosmo/core-schema                      │
│            (Component definitions)                   │
├─────────────────────────────────────────────────────┤
│             @cosmo/renderer-meta          ◄── HERE   │
│     (Adapts components for Meta display)             │
├─────────────────────────────────────────────────────┤
│          Meta Wearables SDK (future)                 │
│             (Display API access)                     │
├─────────────────────────────────────────────────────┤
│            Meta Ray-Ban Display                      │
│              + Neural Band                           │
└─────────────────────────────────────────────────────┘
```

## License

MIT
