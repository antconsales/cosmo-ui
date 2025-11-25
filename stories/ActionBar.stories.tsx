import type { Meta, StoryObj } from "@storybook/react";
import { ActionBar } from "@cosmo/renderer-web";
import type { ActionBar as ActionBarType } from "@cosmo/core-schema";

const meta: Meta<typeof ActionBar> = {
  title: "Components/ActionBar",
  component: ActionBar,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    onAction: { action: "action" },
  },
};

export default meta;
type Story = StoryObj<typeof ActionBar>;

const baseBar: ActionBarType = {
  id: "bar-1",
  position: "bottom",
  variant: "solid",
  showLabels: false,
  visible: true,
  items: [
    { id: "home", icon: "home", label: "Home" },
    { id: "search", icon: "search", label: "Search" },
    { id: "add", icon: "add", label: "Add" },
    { id: "favorite", icon: "favorite", label: "Favorites" },
    { id: "settings", icon: "settings", label: "Settings" },
  ],
};

export const Default: Story = {
  args: {
    bar: baseBar,
  },
};

export const WithLabels: Story = {
  args: {
    bar: { ...baseBar, showLabels: true },
  },
};

export const GlassVariant: Story = {
  args: {
    bar: { ...baseBar, variant: "glass" },
  },
};

export const MinimalVariant: Story = {
  args: {
    bar: { ...baseBar, variant: "minimal" },
  },
};

export const TopPosition: Story = {
  args: {
    bar: { ...baseBar, position: "top" },
  },
};

export const LeftPosition: Story = {
  args: {
    bar: { ...baseBar, position: "left" },
  },
};

export const RightPosition: Story = {
  args: {
    bar: { ...baseBar, position: "right" },
  },
};

export const WithActiveItem: Story = {
  args: {
    bar: {
      ...baseBar,
      items: baseBar.items.map((item, idx) => ({
        ...item,
        active: idx === 0,
      })),
    },
  },
};

export const WithDisabledItem: Story = {
  args: {
    bar: {
      ...baseBar,
      items: baseBar.items.map((item, idx) => ({
        ...item,
        disabled: idx === 2,
      })),
    },
  },
};

export const WithBadges: Story = {
  args: {
    bar: {
      ...baseBar,
      items: [
        { id: "home", icon: "home", label: "Home" },
        { id: "search", icon: "search", label: "Search" },
        { id: "notifications", icon: "favorite", label: "Notifications", badge: 5 },
        { id: "messages", icon: "mic", label: "Messages", badge: 123 },
        { id: "settings", icon: "settings", label: "Settings" },
      ],
    },
  },
};

export const NavigationBar: Story = {
  args: {
    bar: {
      ...baseBar,
      items: [
        { id: "back", icon: "back", label: "Back" },
        { id: "forward", icon: "forward", label: "Forward", disabled: true },
        { id: "refresh", icon: "refresh", label: "Refresh" },
        { id: "share", icon: "share", label: "Share" },
      ],
    },
  },
};

export const MediaControls: Story = {
  args: {
    bar: {
      ...baseBar,
      variant: "glass",
      items: [
        { id: "camera", icon: "camera", label: "Camera" },
        { id: "mic", icon: "mic", label: "Microphone", active: true },
        { id: "speaker", icon: "speaker", label: "Speaker" },
        { id: "close", icon: "close", label: "End" },
      ],
    },
  },
};
