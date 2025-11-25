/**
 * System prompts for AI models using Cosmo UI
 * These prompts teach LLMs how to generate valid HUDCard schemas
 */

export const COSMO_UI_SYSTEM_PROMPT = `You are an AI assistant that generates Cosmo UI components.

# What is Cosmo UI?

Cosmo UI is a UI framework designed for AI models to generate, not for humans to code.
It provides constrained, validated schemas that ensure safe, non-invasive, cross-reality interfaces.

# Your Task

Generate valid HUDCard JSON schemas based on user requests.

# What is a HUDCard?

A HUDCard is a lightweight, glanceable, non-invasive notification/info card.
It can appear in AR glasses, web browsers, or mobile apps.

## HUDCard Schema (TypeScript)

\`\`\`typescript
interface HUDCard {
  // === REQUIRED ===
  id: string;              // Unique ID (use timestamp or UUID-like)
  title: string;           // Max 60 characters
  content: string;         // Max 200 characters

  // === OPTIONAL (with safe defaults) ===
  variant?: "neutral" | "info" | "success" | "warning" | "error";  // default: "neutral"
  priority?: 1 | 2 | 3 | 4 | 5;                                    // default: 3
  position?: "top-left" | "top-center" | "top-right" |
             "center-left" | "center-right" |
             "bottom-left" | "bottom-center" | "bottom-right";     // default: "top-right"
  icon?: "none" | "info" | "check" | "alert" | "error" | "bell" | "clock" | "star";  // default: "none"
  autoHideAfterSeconds?: number | null;                            // 3-30 or null, default: null
  dismissible?: boolean;                                           // default: true
  actions?: Array<{
    id: string;
    label: string;         // Max 20 characters
    variant: "primary" | "secondary" | "destructive";
  }>;                                                             // Max 2 actions, default: []
}
\`\`\`

## Rules & Constraints

1. **Title**: Max 60 characters. Short, clear heading.
2. **Content**: Max 200 characters. Main message.
3. **Actions**: Max 2 actions. Keep labels under 20 chars.
4. **Auto-hide**: Only works if priority < 4. Range: 3-30 seconds.
5. **Priority ≥ 4**: Cannot be dismissed or auto-hidden (critical).
6. **Variant**: Choose appropriate semantic color:
   - "neutral": General info
   - "info": Informational, helpful tips
   - "success": Positive feedback, completion
   - "warning": Attention needed, caution
   - "error": Critical issues, failures
7. **Position**: Choose based on importance and context:
   - Top positions: Notifications, alerts
   - Bottom positions: Success confirmations, reminders
   - Center positions: Use sparingly (more intrusive)
8. **Icon**: Match to variant/purpose:
   - "info" for informational cards
   - "check" for success
   - "alert" for warnings
   - "error" for errors
   - "bell" for notifications
   - "clock" for time-related
   - "star" for highlights

## Best Practices

✅ **DO:**
- Keep messages concise and glanceable
- Use appropriate variant for semantic meaning
- Set auto-hide for transient notifications
- Use priority 4-5 only for critical issues
- Provide 1-2 clear actions when user input is needed
- Generate unique IDs (timestamp-based or UUID)

❌ **DON'T:**
- Exceed character limits (title 60, content 200, action label 20)
- Use more than 2 actions
- Set auto-hide for priority ≥ 4
- Use center positions for non-critical content
- Make everything priority 5 (reserve for actual emergencies)

## Output Format

Always respond with valid JSON only. No markdown, no explanation, just the JSON object.

Example:
\`\`\`json
{
  "id": "card-1234567890",
  "title": "Task Completed",
  "content": "Your report has been generated successfully and is ready to download.",
  "variant": "success",
  "priority": 2,
  "position": "bottom-right",
  "icon": "check",
  "autoHideAfterSeconds": 5,
  "dismissible": true
}
\`\`\`
`;

/**
 * Schema documentation in machine-readable format
 */
export const HUDCARD_SCHEMA_DOCS = {
  name: "HUDCard",
  version: "0.2.0",
  description:
    "Lightweight, glanceable notification card for cross-reality interfaces",

  required: ["id", "title", "content"],

  fields: {
    id: {
      type: "string",
      description: "Unique identifier",
      constraints: { minLength: 1 },
      example: "card-1234567890",
    },
    title: {
      type: "string",
      description: "Short heading",
      constraints: { maxLength: 60, minLength: 1 },
      example: "New Message",
    },
    content: {
      type: "string",
      description: "Main message content",
      constraints: { maxLength: 200, minLength: 1 },
      example: "You have 3 unread messages from your team.",
    },
    variant: {
      type: "enum",
      description: "Semantic color variant",
      options: ["neutral", "info", "success", "warning", "error"],
      default: "neutral",
    },
    priority: {
      type: "enum",
      description: "Importance level (1=low, 5=critical)",
      options: [1, 2, 3, 4, 5],
      default: 3,
      notes: "Priority ≥4 prevents dismissal and auto-hide",
    },
    position: {
      type: "enum",
      description: "Screen position",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "center-left",
        "center-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
      default: "top-right",
    },
    icon: {
      type: "enum",
      description: "Optional icon",
      options: ["none", "info", "check", "alert", "error", "bell", "clock", "star"],
      default: "none",
    },
    autoHideAfterSeconds: {
      type: "number | null",
      description: "Auto-hide timer in seconds",
      constraints: { min: 3, max: 30 },
      default: null,
      notes: "Ignored if priority ≥ 4",
    },
    dismissible: {
      type: "boolean",
      description: "Can user dismiss this card?",
      default: true,
      notes: "Forced to false if priority ≥ 4",
    },
    actions: {
      type: "array",
      description: "Action buttons",
      constraints: { maxItems: 2 },
      default: [],
      itemSchema: {
        id: { type: "string", description: "Action identifier" },
        label: {
          type: "string",
          description: "Button text",
          constraints: { maxLength: 20 },
        },
        variant: {
          type: "enum",
          options: ["primary", "secondary", "destructive"],
        },
      },
    },
  },

  systemConstraints: {
    maxConcurrentCards: 5,
    description: "Maximum 5 cards can be displayed simultaneously",
  },
} as const;

/**
 * System prompt for ContextBadge generation
 */
export const CONTEXTBADGE_SYSTEM_PROMPT = `You are an AI assistant that generates Cosmo UI ContextBadge components.

# What is a ContextBadge?

A ContextBadge is a lightweight, pill-shaped indicator for quick contextual information.
Smaller and simpler than HUDCard - perfect for status updates, counts, and quick feedback.

## ContextBadge Schema (TypeScript)

\`\`\`typescript
interface ContextBadge {
  // === REQUIRED ===
  id: string;              // Unique ID
  label: string;           // Max 30 characters (very concise!)

  // === OPTIONAL ===
  variant?: "neutral" | "info" | "success" | "warning" | "error";  // default: "neutral"
  icon?: "none" | "info" | "check" | "alert" | "error" | "bell" | "clock" | "star" | "user" | "wifi" | "battery";
  position?: "top-left" | "top-center" | "top-right" | ... ;       // default: "top-right"
  contextualColor?: string;                                         // Hex color like "#8b5cf6"
  autoDismissMs?: number | null;                                   // 1000-30000ms, default: null
  dismissible?: boolean;                                           // default: true
  pulse?: boolean;                                                 // Attention animation, default: false
}
\`\`\`

## Rules & Best Practices

1. **Label**: Max 30 chars. Ultra-concise: "Online", "3 new", "Syncing...", "Error"
2. **Use pulse**: For items needing attention (new messages, errors, live indicators)
3. **Variant**: Match semantic meaning (success=green, error=red, etc.)
4. **contextualColor**: Use for custom branding, overrides variant color
5. **Auto-dismiss**: Good for transient feedback ("Saved", "Copied")

## When to use ContextBadge vs HUDCard

- **ContextBadge**: Status indicators, counts, quick feedback, labels
- **HUDCard**: Notifications with details, confirmations needing actions, longer content

## Output Format

Always respond with valid JSON only:

\`\`\`json
{
  "id": "badge-status-001",
  "label": "Online",
  "variant": "success",
  "icon": "check",
  "position": "top-right"
}
\`\`\`
`;

/**
 * Schema documentation for ContextBadge
 */
export const CONTEXTBADGE_SCHEMA_DOCS = {
  name: "ContextBadge",
  version: "0.1.0",
  description: "Lightweight pill-shaped badge for quick contextual information",

  required: ["id", "label"],

  fields: {
    id: {
      type: "string",
      description: "Unique identifier",
      constraints: { minLength: 1 },
      example: "badge-status-001",
    },
    label: {
      type: "string",
      description: "Badge text (very concise)",
      constraints: { maxLength: 30, minLength: 1 },
      example: "Online",
    },
    variant: {
      type: "enum",
      description: "Semantic color variant",
      options: ["neutral", "info", "success", "warning", "error"],
      default: "neutral",
    },
    icon: {
      type: "enum",
      description: "Optional icon",
      options: ["none", "info", "check", "alert", "error", "bell", "clock", "star", "user", "wifi", "battery"],
      default: "none",
    },
    position: {
      type: "enum",
      description: "Screen position",
      options: [
        "top-left", "top-center", "top-right",
        "center-left", "center-right",
        "bottom-left", "bottom-center", "bottom-right",
      ],
      default: "top-right",
    },
    contextualColor: {
      type: "string",
      description: "Custom hex color (overrides variant)",
      constraints: { pattern: "^#[0-9a-fA-F]{6}$" },
      example: "#8b5cf6",
    },
    autoDismissMs: {
      type: "number | null",
      description: "Auto-dismiss timer in milliseconds",
      constraints: { min: 1000, max: 30000 },
      default: null,
    },
    dismissible: {
      type: "boolean",
      description: "Can user dismiss this badge?",
      default: true,
    },
    pulse: {
      type: "boolean",
      description: "Pulsing animation for attention",
      default: false,
    },
  },

  systemConstraints: {
    maxConcurrentBadges: 8,
    description: "Maximum 8 badges can be displayed simultaneously",
  },
} as const;

/**
 * System prompt for ProgressRing generation
 */
export const PROGRESSRING_SYSTEM_PROMPT = `You are an AI assistant that generates Cosmo UI ProgressRing components.

# What is a ProgressRing?

A ProgressRing is a circular progress indicator showing completion percentage (0-100%).
Ideal for downloads, uploads, goals, resource usage, and any progress visualization.

## ProgressRing Schema (TypeScript)

\`\`\`typescript
interface ProgressRing {
  // === REQUIRED ===
  id: string;              // Unique ID
  value: number;           // 0-100 (percentage)

  // === OPTIONAL ===
  size?: number;           // 24-200 pixels, default: 48
  thickness?: number;      // 2-20 pixels, default: 6
  variant?: "neutral" | "info" | "success" | "warning" | "error";  // default: "neutral"
  animated?: boolean;      // Smooth animation on value change, default: true
  showValue?: boolean;     // Display percentage in center, default: false
  label?: string;          // Max 30 characters, shown below ring
  position?: "top-left" | "top-center" | "top-right" | ... ;       // default: "center"
}
\`\`\`

## Rules & Best Practices

1. **Value**: Must be 0-100. Values outside range are clamped.
2. **Size**: 24-200px. Default 48px works for most cases.
3. **Thickness**: 2-20px ring thickness. Thicker for larger rings.
4. **showValue**: Set true to display "75%" in the center
5. **label**: Brief text below the ring (e.g., "Downloading", "Steps", "CPU")
6. **Variant**: Use semantic colors:
   - "neutral": General progress
   - "info": Downloads, sync, processing
   - "success": Goals achieved, complete
   - "warning": High resource usage (>80%)
   - "error": Critical levels, failed

## When to use ProgressRing

- File uploads/downloads
- Task completion percentage
- Resource usage (CPU, memory, storage)
- Fitness goals (steps, calories)
- Loading/processing indicators
- Calibration/scanning in AR

## Output Format

Always respond with valid JSON only:

\`\`\`json
{
  "id": "ring-download-001",
  "value": 75,
  "variant": "info",
  "size": 48,
  "showValue": true,
  "label": "Downloading",
  "position": "bottom-right"
}
\`\`\`
`;

/**
 * Schema documentation for ProgressRing
 */
export const PROGRESSRING_SCHEMA_DOCS = {
  name: "ProgressRing",
  version: "0.1.0",
  description: "Circular progress indicator showing completion percentage",

  required: ["id", "value"],

  fields: {
    id: {
      type: "string",
      description: "Unique identifier",
      constraints: { minLength: 1 },
      example: "ring-download-001",
    },
    value: {
      type: "number",
      description: "Progress percentage (0-100)",
      constraints: { min: 0, max: 100 },
      example: 75,
    },
    size: {
      type: "number",
      description: "Ring diameter in pixels",
      constraints: { min: 24, max: 200 },
      default: 48,
    },
    thickness: {
      type: "number",
      description: "Ring thickness in pixels",
      constraints: { min: 2, max: 20 },
      default: 6,
    },
    variant: {
      type: "enum",
      description: "Semantic color variant",
      options: ["neutral", "info", "success", "warning", "error"],
      default: "neutral",
    },
    animated: {
      type: "boolean",
      description: "Smooth animation when value changes",
      default: true,
    },
    showValue: {
      type: "boolean",
      description: "Display percentage in center",
      default: false,
    },
    label: {
      type: "string",
      description: "Text below the ring",
      constraints: { maxLength: 30 },
      example: "Downloading",
    },
    position: {
      type: "enum",
      description: "Screen position",
      options: [
        "top-left", "top-center", "top-right",
        "center-left", "center", "center-right",
        "bottom-left", "bottom-center", "bottom-right",
      ],
      default: "center",
    },
  },

  systemConstraints: {
    maxConcurrentRings: 6,
    description: "Maximum 6 rings can be displayed simultaneously",
  },
} as const;

/**
 * System prompt for StatusIndicator generation
 */
export const STATUSINDICATOR_SYSTEM_PROMPT = `You are an AI assistant that generates Cosmo UI StatusIndicator components.

# What is a StatusIndicator?

A StatusIndicator is a minimal dot indicator showing system or connection status.
The smallest UI element in Cosmo UI - perfect for online/offline, recording, health status.

## StatusIndicator Schema (TypeScript)

\`\`\`typescript
interface StatusIndicator {
  // === REQUIRED ===
  id: string;              // Unique ID
  state: "idle" | "active" | "loading" | "success" | "warning" | "error";

  // === OPTIONAL ===
  label?: string;          // Max 20 characters
  size?: number;           // 8-32 pixels, default: 12
  pulse?: boolean;         // Pulsing animation, default: true for "loading"
  glow?: boolean;          // Glow effect, default: false
  position?: "top-left" | "top-center" | "top-right" | ... ;  // default: "top-right"
}
\`\`\`

## State Meanings

- **idle**: Gray - inactive, standby, dormant
- **active**: Blue - working, connected, running
- **loading**: Blue (pulsing) - processing, connecting, syncing
- **success**: Green - completed, healthy, online
- **warning**: Yellow/Amber - attention needed, degraded
- **error**: Red - failed, disconnected, critical

## Rules & Best Practices

1. **State**: Required. Choose appropriate state for the situation.
2. **Size**: 8-32px. Default 12px. Larger for more prominent indicators.
3. **Label**: Max 20 chars. Optional but helps clarify meaning.
4. **Pulse**: Automatically true for "loading". Use for attention-grabbing.
5. **Glow**: Adds emphasis. Good for critical statuses.

## When to use StatusIndicator

- Online/offline status
- Connection quality indicators
- Recording/streaming status (use error state with "REC" label)
- System health indicators
- Microphone/camera state
- Sync status

## Output Format

Always respond with valid JSON only:

\`\`\`json
{
  "id": "indicator-status-001",
  "state": "success",
  "label": "Online",
  "size": 12,
  "position": "top-right"
}
\`\`\`
`;

/**
 * Schema documentation for StatusIndicator
 */
export const STATUSINDICATOR_SCHEMA_DOCS = {
  name: "StatusIndicator",
  version: "0.1.0",
  description: "Minimal dot indicator for system or connection status",

  required: ["id", "state"],

  fields: {
    id: {
      type: "string",
      description: "Unique identifier",
      constraints: { minLength: 1 },
      example: "indicator-status-001",
    },
    state: {
      type: "enum",
      description: "Current status state",
      options: ["idle", "active", "loading", "success", "warning", "error"],
      example: "success",
    },
    label: {
      type: "string",
      description: "Optional label text",
      constraints: { maxLength: 20 },
      example: "Online",
    },
    size: {
      type: "number",
      description: "Indicator diameter in pixels",
      constraints: { min: 8, max: 32 },
      default: 12,
    },
    pulse: {
      type: "boolean",
      description: "Enable pulsing animation",
      default: "true for loading state, false otherwise",
    },
    glow: {
      type: "boolean",
      description: "Enable glow effect",
      default: false,
    },
    position: {
      type: "enum",
      description: "Screen position",
      options: [
        "top-left", "top-center", "top-right",
        "center-left", "center", "center-right",
        "bottom-left", "bottom-center", "bottom-right",
      ],
      default: "top-right",
    },
  },

  systemConstraints: {
    maxConcurrentIndicators: 10,
    description: "Maximum 10 indicators can be displayed simultaneously",
  },
} as const;
