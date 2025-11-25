import type { ContextBadge } from "@cosmo/core-schema";

/**
 * Training examples for AI models
 * These demonstrate valid ContextBadge schemas across various use cases
 */

export const CONTEXTBADGE_EXAMPLES: Array<{
  intent: string;
  badge: ContextBadge;
}> = [
  // === STATUS INDICATORS ===
  {
    intent: "Show user is online",
    badge: {
      id: "badge-status-online-001",
      label: "Online",
      variant: "success",
      icon: "check",
      position: "top-right",
      dismissible: false,
    },
  },

  {
    intent: "Show user is away/busy",
    badge: {
      id: "badge-status-busy-002",
      label: "Busy",
      variant: "warning",
      icon: "clock",
      position: "top-right",
      dismissible: false,
    },
  },

  {
    intent: "Show offline status",
    badge: {
      id: "badge-status-offline-003",
      label: "Offline",
      variant: "neutral",
      icon: "wifi",
      position: "top-right",
      dismissible: false,
    },
  },

  // === COUNTS & NOTIFICATIONS ===
  {
    intent: "Show unread message count",
    badge: {
      id: "badge-messages-004",
      label: "3 new",
      variant: "info",
      icon: "bell",
      position: "top-left",
      pulse: true,
      autoDismissMs: 10000,
      dismissible: true,
    },
  },

  {
    intent: "Show pending tasks count",
    badge: {
      id: "badge-tasks-005",
      label: "5 tasks",
      variant: "neutral",
      icon: "clock",
      position: "bottom-left",
      dismissible: true,
    },
  },

  // === QUICK STATUS ===
  {
    intent: "Show syncing in progress",
    badge: {
      id: "badge-sync-006",
      label: "Syncing...",
      variant: "info",
      icon: "clock",
      position: "bottom-right",
      pulse: true,
      dismissible: false,
    },
  },

  {
    intent: "Show save completed",
    badge: {
      id: "badge-saved-007",
      label: "Saved",
      variant: "success",
      icon: "check",
      position: "bottom-center",
      autoDismissMs: 3000,
      dismissible: true,
    },
  },

  {
    intent: "Show error status",
    badge: {
      id: "badge-error-008",
      label: "Error",
      variant: "error",
      icon: "error",
      position: "top-center",
      pulse: true,
      dismissible: false,
    },
  },

  // === CONTEXTUAL INFO ===
  {
    intent: "Show current user role",
    badge: {
      id: "badge-role-009",
      label: "Admin",
      variant: "info",
      icon: "user",
      position: "top-right",
      dismissible: false,
    },
  },

  {
    intent: "Show battery status",
    badge: {
      id: "badge-battery-010",
      label: "15% left",
      variant: "warning",
      icon: "battery",
      position: "top-right",
      pulse: true,
      dismissible: false,
    },
  },

  // === CUSTOM BRANDED ===
  {
    intent: "Show custom branded badge",
    badge: {
      id: "badge-brand-011",
      label: "Premium",
      contextualColor: "#8b5cf6", // Purple
      icon: "star",
      position: "top-right",
      dismissible: false,
    },
  },

  {
    intent: "Show live indicator",
    badge: {
      id: "badge-live-012",
      label: "LIVE",
      contextualColor: "#ef4444", // Red
      icon: "none",
      position: "top-left",
      pulse: true,
      dismissible: false,
    },
  },

  // === AR SPECIFIC ===
  {
    intent: "Show AR badge anchored in world space",
    badge: {
      id: "badge-ar-world-013",
      label: "Point of Interest",
      variant: "info",
      icon: "star",
      position: "center-right",
      metadata: {
        anchorType: "world-space",
        autoAnchor: "face",
        autoAnchorDistance: 0.4,
      },
    },
  },

  {
    intent: "Show AR badge on surface",
    badge: {
      id: "badge-ar-surface-014",
      label: "Tap here",
      variant: "success",
      icon: "check",
      metadata: {
        anchorType: "world-space",
        autoAnchor: "surface",
      },
    },
  },
];

/**
 * Get random ContextBadge examples for few-shot learning
 */
export function getRandomContextBadgeExamples(count: number = 3): Array<{
  intent: string;
  badge: ContextBadge;
}> {
  const shuffled = [...CONTEXTBADGE_EXAMPLES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Get examples by variant
 */
export function getContextBadgeExamplesByVariant(
  variant: ContextBadge["variant"]
): Array<{ intent: string; badge: ContextBadge }> {
  return CONTEXTBADGE_EXAMPLES.filter((ex) => ex.badge.variant === variant);
}
