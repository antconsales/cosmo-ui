import type { HUDCard } from "@cosmo/core-schema";

/**
 * Training examples for AI models
 * These demonstrate valid HUDCard schemas across various use cases
 */

export const HUDCARD_EXAMPLES: Array<{
  intent: string;
  card: HUDCard;
}> = [
  // === NOTIFICATIONS ===
  {
    intent: "Show a notification that a file download completed",
    card: {
      id: "notif-download-001",
      title: "Download Complete",
      content: "report-Q4-2024.pdf has been downloaded successfully.",
      variant: "success",
      priority: 2,
      position: "bottom-right",
      icon: "check",
      autoHideAfterSeconds: 5,
      dismissible: true,
    },
  },

  {
    intent: "Notify user of new unread messages",
    card: {
      id: "notif-messages-002",
      title: "New Messages",
      content: "You have 3 unread messages from Sarah Johnson.",
      variant: "info",
      priority: 2,
      position: "top-left",
      icon: "bell",
      autoHideAfterSeconds: 8,
      dismissible: true,
    },
  },

  // === SUCCESS FEEDBACK ===
  {
    intent: "Confirm that changes were saved",
    card: {
      id: "success-save-003",
      title: "Saved Successfully",
      content: "Your profile changes have been saved.",
      variant: "success",
      priority: 2,
      position: "bottom-center",
      icon: "check",
      autoHideAfterSeconds: 4,
      dismissible: true,
    },
  },

  {
    intent: "Confirm successful payment",
    card: {
      id: "success-payment-004",
      title: "Payment Processed",
      content: "Your payment of $29.99 was successful. Receipt sent to email.",
      variant: "success",
      priority: 3,
      position: "top-center",
      icon: "check",
      dismissible: true,
    },
  },

  // === WARNINGS ===
  {
    intent: "Warn user about low battery",
    card: {
      id: "warn-battery-005",
      title: "Low Battery",
      content: "Device battery at 15%. Connect to power soon.",
      variant: "warning",
      priority: 4,
      position: "top-center",
      icon: "alert",
      dismissible: false,
    },
  },

  {
    intent: "Warn about approaching deadline",
    card: {
      id: "warn-deadline-006",
      title: "Deadline Approaching",
      content: "Project proposal due in 2 hours. Remember to submit!",
      variant: "warning",
      priority: 3,
      position: "top-right",
      icon: "clock",
      autoHideAfterSeconds: 15,
      dismissible: true,
    },
  },

  {
    intent: "Warn about storage almost full",
    card: {
      id: "warn-storage-007",
      title: "Storage Almost Full",
      content: "Only 5% storage remaining. Consider removing unused files.",
      variant: "warning",
      priority: 3,
      position: "bottom-left",
      icon: "alert",
      dismissible: true,
    },
  },

  // === ERRORS ===
  {
    intent: "Show connection error with retry option",
    card: {
      id: "error-connection-008",
      title: "Connection Failed",
      content: "Unable to reach server. Check your internet connection.",
      variant: "error",
      priority: 5,
      position: "top-center",
      icon: "error",
      dismissible: false,
      actions: [
        {
          id: "retry",
          label: "Retry",
          variant: "primary",
        },
        {
          id: "cancel",
          label: "Cancel",
          variant: "secondary",
        },
      ],
    },
  },

  {
    intent: "Show authentication error",
    card: {
      id: "error-auth-009",
      title: "Session Expired",
      content: "Your session has expired. Please log in again to continue.",
      variant: "error",
      priority: 5,
      position: "top-center",
      icon: "alert",
      dismissible: false,
      actions: [
        {
          id: "login",
          label: "Log In",
          variant: "primary",
        },
      ],
    },
  },

  // === REMINDERS ===
  {
    intent: "Remind about upcoming meeting",
    card: {
      id: "reminder-meeting-010",
      title: "Meeting in 10 Minutes",
      content: "Team standup starts at 10:00 AM in Conference Room B.",
      variant: "neutral",
      priority: 3,
      position: "bottom-left",
      icon: "clock",
      autoHideAfterSeconds: 10,
      dismissible: true,
    },
  },

  {
    intent: "Remind to take a break",
    card: {
      id: "reminder-break-011",
      title: "Time for a Break",
      content: "You've been working for 2 hours. Take a 5-minute break!",
      variant: "info",
      priority: 1,
      position: "center-right",
      icon: "star",
      autoHideAfterSeconds: 20,
      dismissible: true,
    },
  },

  // === INFO / TIPS ===
  {
    intent: "Show helpful tip about keyboard shortcut",
    card: {
      id: "tip-shortcut-012",
      title: "Pro Tip",
      content: "Press Cmd+K to quickly search for any command.",
      variant: "info",
      priority: 1,
      position: "bottom-right",
      icon: "info",
      autoHideAfterSeconds: 12,
      dismissible: true,
    },
  },

  {
    intent: "Inform about new feature",
    card: {
      id: "info-feature-013",
      title: "New Feature Available",
      content: "Dark mode is now available! Check Settings to enable it.",
      variant: "info",
      priority: 2,
      position: "top-right",
      icon: "star",
      dismissible: true,
    },
  },

  // === UPDATES / SYSTEM ===
  {
    intent: "Notify about available update",
    card: {
      id: "update-available-014",
      title: "Update Available",
      content: "Version 2.1.0 is ready to install. Install now or later?",
      variant: "info",
      priority: 2,
      position: "top-right",
      icon: "info",
      dismissible: true,
      actions: [
        {
          id: "update",
          label: "Update Now",
          variant: "primary",
        },
        {
          id: "later",
          label: "Later",
          variant: "secondary",
        },
      ],
    },
  },

  {
    intent: "Show sync in progress status",
    card: {
      id: "status-sync-015",
      title: "Syncing...",
      content: "Your files are syncing with cloud. 75% complete.",
      variant: "neutral",
      priority: 2,
      position: "bottom-center",
      icon: "clock",
      dismissible: false,
    },
  },

  // === CONFIRMATIONS ===
  {
    intent: "Confirm deletion with undo option",
    card: {
      id: "confirm-delete-016",
      title: "File Deleted",
      content: "document.pdf moved to trash.",
      variant: "neutral",
      priority: 2,
      position: "bottom-center",
      icon: "none",
      autoHideAfterSeconds: 5,
      dismissible: true,
      actions: [
        {
          id: "undo",
          label: "Undo",
          variant: "primary",
        },
      ],
    },
  },

  {
    intent: "Confirm item added to cart",
    card: {
      id: "confirm-cart-017",
      title: "Added to Cart",
      content: "Wireless Headphones added. Total: $149.99",
      variant: "success",
      priority: 2,
      position: "top-right",
      icon: "check",
      autoHideAfterSeconds: 4,
      dismissible: true,
      actions: [
        {
          id: "view-cart",
          label: "View Cart",
          variant: "primary",
        },
      ],
    },
  },

  // === PROGRESS / ACTIVITY ===
  {
    intent: "Show upload progress",
    card: {
      id: "progress-upload-018",
      title: "Uploading Files",
      content: "Uploading 3 files... 45% complete.",
      variant: "neutral",
      priority: 2,
      position: "bottom-right",
      icon: "clock",
      dismissible: false,
    },
  },

  {
    intent: "Show processing status",
    card: {
      id: "status-processing-019",
      title: "Processing Video",
      content: "Converting video to HD format. This may take a few minutes.",
      variant: "neutral",
      priority: 2,
      position: "center-right",
      icon: "clock",
      dismissible: false,
    },
  },

  // === WELCOME / ONBOARDING ===
  {
    intent: "Welcome new user",
    card: {
      id: "welcome-user-020",
      title: "Welcome to Aura!",
      content: "Let's get you started. Complete your profile to unlock all features.",
      variant: "info",
      priority: 3,
      position: "top-center",
      icon: "star",
      dismissible: true,
      actions: [
        {
          id: "start",
          label: "Get Started",
          variant: "primary",
        },
      ],
    },
  },

  // === SPECIAL CASES ===
  {
    intent: "Show critical security alert",
    card: {
      id: "security-alert-021",
      title: "Security Alert",
      content: "Unusual login detected from new device. Was this you?",
      variant: "error",
      priority: 5,
      position: "top-center",
      icon: "error",
      dismissible: false,
      actions: [
        {
          id: "yes-me",
          label: "Yes, It's Me",
          variant: "primary",
        },
        {
          id: "not-me",
          label: "Not Me",
          variant: "destructive",
        },
      ],
    },
  },

  {
    intent: "Minimal neutral notification without icon",
    card: {
      id: "minimal-note-022",
      title: "Settings Updated",
      content: "Your notification preferences have been saved.",
      variant: "neutral",
      priority: 1,
      position: "bottom-right",
      icon: "none",
      autoHideAfterSeconds: 3,
      dismissible: true,
    },
  },

  {
    intent: "Celebrate achievement",
    card: {
      id: "achievement-023",
      title: "Achievement Unlocked!",
      content: "You've completed 100 tasks this month. Great work!",
      variant: "success",
      priority: 2,
      position: "top-center",
      icon: "star",
      autoHideAfterSeconds: 8,
      dismissible: true,
    },
  },
];

/**
 * Get random examples for few-shot learning
 */
export function getRandomExamples(count: number = 5): Array<{
  intent: string;
  card: HUDCard;
}> {
  const shuffled = [...HUDCARD_EXAMPLES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Get examples by variant
 */
export function getExamplesByVariant(
  variant: HUDCard["variant"]
): Array<{ intent: string; card: HUDCard }> {
  return HUDCARD_EXAMPLES.filter((ex) => ex.card.variant === variant);
}

/**
 * Get examples by priority
 */
export function getExamplesByPriority(
  priority: HUDCard["priority"]
): Array<{ intent: string; card: HUDCard }> {
  return HUDCARD_EXAMPLES.filter((ex) => ex.card.priority === priority);
}
