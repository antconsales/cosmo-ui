import type { Meta, StoryObj } from "@storybook/react";
import { ContextBadge } from "@cosmo/renderer-web";
import type { ContextBadge as ContextBadgeType } from "@cosmo/core-schema";

const meta: Meta<typeof ContextBadge> = {
  title: "Components/ContextBadge",
  component: ContextBadge,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    onDismiss: { action: "dismissed" },
  },
};

export default meta;
type Story = StoryObj<typeof ContextBadge>;

const baseBadge: ContextBadgeType = {
  id: "badge-1",
  label: "Status",
  variant: "info",
  icon: "info",
  position: "top-right",
  dismissible: true,
  pulse: false,
  autoDismissMs: null,
};

export const Default: Story = {
  args: {
    badge: baseBadge,
  },
};

export const Info: Story = {
  args: {
    badge: { ...baseBadge, label: "Info", variant: "info", icon: "info" },
  },
};

export const Success: Story = {
  args: {
    badge: { ...baseBadge, label: "Connected", variant: "success", icon: "check" },
  },
};

export const Warning: Story = {
  args: {
    badge: { ...baseBadge, label: "Low Battery", variant: "warning", icon: "alert" },
  },
};

export const Error: Story = {
  args: {
    badge: { ...baseBadge, label: "Offline", variant: "error", icon: "error" },
  },
};

export const Pulsing: Story = {
  args: {
    badge: { ...baseBadge, label: "Recording", variant: "error", pulse: true, icon: "none" },
  },
};

export const WithCustomColor: Story = {
  args: {
    badge: { ...baseBadge, label: "Custom", contextualColor: "#8b5cf6" },
  },
};

export const AllPositions: Story = {
  render: () => (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <ContextBadge badge={{ ...baseBadge, id: "tl", label: "Top Left", position: "top-left" }} />
      <ContextBadge badge={{ ...baseBadge, id: "tc", label: "Top Center", position: "top-center" }} />
      <ContextBadge badge={{ ...baseBadge, id: "tr", label: "Top Right", position: "top-right" }} />
      <ContextBadge badge={{ ...baseBadge, id: "bl", label: "Bottom Left", position: "bottom-left" }} />
      <ContextBadge badge={{ ...baseBadge, id: "bc", label: "Bottom Center", position: "bottom-center" }} />
      <ContextBadge badge={{ ...baseBadge, id: "br", label: "Bottom Right", position: "bottom-right" }} />
    </div>
  ),
};
