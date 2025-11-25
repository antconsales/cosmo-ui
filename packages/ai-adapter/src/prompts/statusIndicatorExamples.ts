import type { StatusIndicator } from "@cosmo/core-schema";

/**
 * Training examples for AI models
 * These demonstrate valid StatusIndicator schemas across various use cases
 */

export const STATUSINDICATOR_EXAMPLES: Array<{
  intent: string;
  indicator: StatusIndicator;
}> = [
  // === CONNECTION STATUS ===
  {
    intent: "Show online connection status",
    indicator: {
      id: "indicator-online-001",
      state: "success",
      label: "Connected",
      size: 12,
      position: "top-right",
    },
  },

  {
    intent: "Show offline/disconnected status",
    indicator: {
      id: "indicator-offline-002",
      state: "error",
      label: "Offline",
      size: 12,
      glow: true,
      position: "top-right",
    },
  },

  {
    intent: "Show connecting/loading status",
    indicator: {
      id: "indicator-connecting-003",
      state: "loading",
      label: "Connecting...",
      size: 12,
      pulse: true,
      position: "top-right",
    },
  },

  // === SYSTEM STATUS ===
  {
    intent: "Show idle system status",
    indicator: {
      id: "indicator-idle-004",
      state: "idle",
      label: "Standby",
      size: 10,
      position: "bottom-left",
    },
  },

  {
    intent: "Show active/working status",
    indicator: {
      id: "indicator-active-005",
      state: "active",
      label: "Active",
      size: 12,
      glow: true,
      position: "top-left",
    },
  },

  // === RECORDING/STREAMING ===
  {
    intent: "Show recording in progress",
    indicator: {
      id: "indicator-recording-006",
      state: "error",
      label: "REC",
      size: 14,
      pulse: true,
      glow: true,
      position: "top-right",
    },
  },

  {
    intent: "Show live streaming status",
    indicator: {
      id: "indicator-live-007",
      state: "error",
      label: "LIVE",
      size: 12,
      pulse: true,
      position: "top-left",
    },
  },

  // === DEVICE STATUS ===
  {
    intent: "Show microphone muted status",
    indicator: {
      id: "indicator-mic-muted-008",
      state: "warning",
      label: "Muted",
      size: 12,
      position: "bottom-right",
    },
  },

  {
    intent: "Show camera active status",
    indicator: {
      id: "indicator-camera-009",
      state: "active",
      label: "Camera On",
      size: 12,
      pulse: true,
      position: "top-center",
    },
  },

  // === HEALTH/SYNC STATUS ===
  {
    intent: "Show sync in progress",
    indicator: {
      id: "indicator-sync-010",
      state: "loading",
      size: 10,
      pulse: true,
      position: "bottom-center",
    },
  },

  {
    intent: "Show all systems healthy",
    indicator: {
      id: "indicator-health-011",
      state: "success",
      label: "All Systems OK",
      size: 12,
      glow: true,
      position: "bottom-left",
    },
  },

  {
    intent: "Show warning - attention needed",
    indicator: {
      id: "indicator-warning-012",
      state: "warning",
      label: "Attention",
      size: 14,
      glow: true,
      pulse: true,
      position: "top-right",
    },
  },
];

/**
 * Get random StatusIndicator examples for few-shot learning
 */
export function getRandomStatusIndicatorExamples(count: number = 3): Array<{
  intent: string;
  indicator: StatusIndicator;
}> {
  const shuffled = [...STATUSINDICATOR_EXAMPLES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Get examples by state
 */
export function getStatusIndicatorExamplesByState(
  state: StatusIndicator["state"]
): Array<{ intent: string; indicator: StatusIndicator }> {
  return STATUSINDICATOR_EXAMPLES.filter((ex) => ex.indicator.state === state);
}
