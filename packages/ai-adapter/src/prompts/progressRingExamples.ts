import type { ProgressRing } from "@cosmo/core-schema";

/**
 * Training examples for AI models
 * These demonstrate valid ProgressRing schemas across various use cases
 */

export const PROGRESSRING_EXAMPLES: Array<{
  intent: string;
  ring: ProgressRing;
}> = [
  // === DOWNLOAD/UPLOAD PROGRESS ===
  {
    intent: "Show file download progress at 75%",
    ring: {
      id: "ring-download-001",
      value: 75,
      variant: "info",
      size: 48,
      thickness: 6,
      showValue: true,
      label: "Downloading...",
      position: "bottom-right",
      animated: true,
    },
  },

  {
    intent: "Show upload complete",
    ring: {
      id: "ring-upload-002",
      value: 100,
      variant: "success",
      size: 48,
      showValue: true,
      label: "Complete",
      position: "bottom-right",
      animated: true,
    },
  },

  // === TASK/GOAL PROGRESS ===
  {
    intent: "Show daily goals progress at 40%",
    ring: {
      id: "ring-goals-003",
      value: 40,
      variant: "neutral",
      size: 64,
      thickness: 8,
      showValue: true,
      label: "Daily Goals",
      position: "top-right",
      animated: true,
    },
  },

  {
    intent: "Show project completion status at 85%",
    ring: {
      id: "ring-project-004",
      value: 85,
      variant: "success",
      size: 56,
      showValue: true,
      label: "Project Status",
      position: "center",
      animated: true,
    },
  },

  // === SYSTEM/RESOURCE INDICATORS ===
  {
    intent: "Show storage usage at 92% warning",
    ring: {
      id: "ring-storage-005",
      value: 92,
      variant: "warning",
      size: 48,
      showValue: true,
      label: "Storage",
      position: "top-left",
    },
  },

  {
    intent: "Show critical battery at 8%",
    ring: {
      id: "ring-battery-006",
      value: 8,
      variant: "error",
      size: 40,
      showValue: true,
      label: "Battery",
      position: "top-right",
      animated: true,
    },
  },

  {
    intent: "Show CPU usage at 65%",
    ring: {
      id: "ring-cpu-007",
      value: 65,
      variant: "info",
      size: 48,
      showValue: true,
      label: "CPU",
      position: "bottom-left",
    },
  },

  // === LOADING/PROCESSING ===
  {
    intent: "Show loading progress indeterminate style",
    ring: {
      id: "ring-loading-008",
      value: 30,
      variant: "neutral",
      size: 40,
      thickness: 4,
      showValue: false,
      position: "center",
      animated: true,
    },
  },

  {
    intent: "Show data sync progress at 50%",
    ring: {
      id: "ring-sync-009",
      value: 50,
      variant: "info",
      size: 48,
      showValue: true,
      label: "Syncing",
      position: "bottom-center",
      animated: true,
    },
  },

  // === FITNESS/HEALTH ===
  {
    intent: "Show step count progress at 60%",
    ring: {
      id: "ring-steps-010",
      value: 60,
      variant: "success",
      size: 72,
      thickness: 10,
      showValue: true,
      label: "Steps",
      position: "center",
      animated: true,
    },
  },

  // === AR SPECIFIC ===
  {
    intent: "Show AR progress ring anchored in front of user",
    ring: {
      id: "ring-ar-face-011",
      value: 45,
      variant: "info",
      size: 64,
      showValue: true,
      label: "Scanning",
      position: "center",
      metadata: {
        anchorType: "world-space",
        autoAnchor: "face",
        autoAnchorDistance: 0.5,
      },
    },
  },

  {
    intent: "Show AR calibration progress on surface",
    ring: {
      id: "ring-ar-surface-012",
      value: 70,
      variant: "success",
      size: 80,
      thickness: 8,
      showValue: true,
      label: "Calibrating",
      metadata: {
        anchorType: "world-space",
        autoAnchor: "surface",
      },
    },
  },
];

/**
 * Get random ProgressRing examples for few-shot learning
 */
export function getRandomProgressRingExamples(count: number = 3): Array<{
  intent: string;
  ring: ProgressRing;
}> {
  const shuffled = [...PROGRESSRING_EXAMPLES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Get examples by variant
 */
export function getProgressRingExamplesByVariant(
  variant: ProgressRing["variant"]
): Array<{ intent: string; ring: ProgressRing }> {
  return PROGRESSRING_EXAMPLES.filter((ex) => ex.ring.variant === variant);
}
