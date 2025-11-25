import type { Meta, StoryObj } from "@storybook/react";
import { HUDCard } from "@cosmo/renderer-web";
import type { HUDCard as HUDCardType } from "@cosmo/core-schema";

const meta: Meta<typeof HUDCard> = {
  title: "Components/HUDCard",
  component: HUDCard,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    onDismiss: { action: "dismissed" },
    onAction: { action: "action" },
  },
};

export default meta;
type Story = StoryObj<typeof HUDCard>;

const baseCard: HUDCardType = {
  id: "card-1",
  title: "Notification",
  content: "This is a sample HUD card notification.",
  variant: "info",
  priority: 3,
  position: "top-right",
  icon: "info",
  dismissible: true,
  autoHideAfterSeconds: null,
  actions: [],
};

export const Default: Story = {
  args: {
    card: baseCard,
  },
};

export const Info: Story = {
  args: {
    card: { ...baseCard, variant: "info", title: "Information", icon: "info" },
  },
};

export const Success: Story = {
  args: {
    card: {
      ...baseCard,
      variant: "success",
      title: "Success!",
      content: "Your action was completed successfully.",
      icon: "check",
    },
  },
};

export const Warning: Story = {
  args: {
    card: {
      ...baseCard,
      variant: "warning",
      title: "Warning",
      content: "Please review your settings before proceeding.",
      icon: "alert",
    },
  },
};

export const Error: Story = {
  args: {
    card: {
      ...baseCard,
      variant: "error",
      title: "Error",
      content: "An error occurred. Please try again.",
      icon: "error",
    },
  },
};

export const WithActions: Story = {
  args: {
    card: {
      ...baseCard,
      title: "Confirm Action",
      content: "Are you sure you want to proceed?",
      actions: [
        { id: "confirm", label: "Confirm", variant: "primary" },
        { id: "cancel", label: "Cancel", variant: "secondary" },
      ],
    },
  },
};

export const NonDismissible: Story = {
  args: {
    card: {
      ...baseCard,
      variant: "error",
      title: "Critical Alert",
      content: "This alert cannot be dismissed.",
      priority: 5,
      dismissible: false,
      icon: "error",
    },
  },
};

export const TopLeft: Story = {
  args: {
    card: { ...baseCard, position: "top-left" },
  },
};

export const TopCenter: Story = {
  args: {
    card: { ...baseCard, position: "top-center" },
  },
};

export const BottomRight: Story = {
  args: {
    card: { ...baseCard, position: "bottom-right" },
  },
};
