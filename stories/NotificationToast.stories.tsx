import type { Meta, StoryObj } from "@storybook/react";
import { NotificationToast } from "@cosmo/renderer-web";
import type { NotificationToast as NotificationToastType } from "@cosmo/core-schema";

const meta: Meta<typeof NotificationToast> = {
  title: "Components/Communication/NotificationToast",
  component: NotificationToast,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  argTypes: {
    onDismiss: { action: "dismiss" },
    onAction: { action: "action" },
  },
};

export default meta;
type Story = StoryObj<typeof NotificationToast>;

const baseToast: NotificationToastType = {
  id: "toast-1",
  title: "Notification",
  message: "This is a notification message",
  type: "info",
  variant: "default",
  dismissible: true,
};

export const Default: Story = {
  args: {
    toast: baseToast,
  },
};

export const InfoType: Story = {
  args: {
    toast: { ...baseToast, type: "info", title: "Information", message: "Here's some useful information." },
  },
};

export const SuccessType: Story = {
  args: {
    toast: {
      ...baseToast,
      type: "success",
      title: "Success!",
      message: "Your changes have been saved successfully.",
    },
  },
};

export const WarningType: Story = {
  args: {
    toast: {
      ...baseToast,
      type: "warning",
      title: "Warning",
      message: "Your session will expire in 5 minutes.",
    },
  },
};

export const ErrorType: Story = {
  args: {
    toast: {
      ...baseToast,
      type: "error",
      title: "Error",
      message: "Something went wrong. Please try again.",
    },
  },
};

export const CompactVariant: Story = {
  args: {
    toast: { ...baseToast, variant: "compact" },
  },
};

export const GlassVariant: Story = {
  args: {
    toast: { ...baseToast, variant: "glass" },
  },
};

export const MinimalVariant: Story = {
  args: {
    toast: { ...baseToast, variant: "minimal" },
  },
};

export const WithIcon: Story = {
  args: {
    toast: { ...baseToast, icon: "bell" },
  },
};

export const WithAction: Story = {
  args: {
    toast: {
      ...baseToast,
      title: "Update Available",
      message: "A new version is ready to install.",
      actions: [{ id: "update", label: "Update Now", variant: "primary" }],
    },
  },
};

export const WithMultipleActions: Story = {
  args: {
    toast: {
      ...baseToast,
      title: "Incoming Call",
      message: "John Doe is calling...",
      actions: [
        { id: "accept", label: "Accept", variant: "primary" },
        { id: "decline", label: "Decline", variant: "secondary" },
      ],
    },
  },
};

export const NonDismissible: Story = {
  args: {
    toast: {
      ...baseToast,
      type: "error",
      title: "Critical Error",
      message: "Please resolve this issue before continuing.",
      dismissible: false,
    },
  },
};

export const LongMessage: Story = {
  args: {
    toast: {
      ...baseToast,
      title: "System Update",
      message:
        "The system will undergo scheduled maintenance tonight from 2:00 AM to 4:00 AM. Please save your work before then.",
    },
  },
};

export const WithProgress: Story = {
  args: {
    toast: {
      ...baseToast,
      title: "Uploading...",
      message: "file_report.pdf",
      progress: 65,
    },
  },
};

export const WithAvatar: Story = {
  args: {
    toast: {
      ...baseToast,
      title: "New Message",
      message: "Sarah: Hey, are you there?",
      avatar: "https://i.pravatar.cc/150?u=sarah",
    },
  },
};

export const TimedDismiss: Story = {
  args: {
    toast: {
      ...baseToast,
      autoHideAfterSeconds: 5,
      message: "This will auto-dismiss in 5 seconds",
    },
  },
};
