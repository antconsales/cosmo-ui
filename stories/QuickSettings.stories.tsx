import type { Meta, StoryObj } from "@storybook/react";
import { QuickSettings } from "@cosmo/renderer-web";
import type { QuickSettings as QuickSettingsType } from "@cosmo/core-schema";

const meta: Meta<typeof QuickSettings> = {
  title: "Components/System/QuickSettings",
  component: QuickSettings,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  argTypes: {
    onToggle: { action: "toggle" },
  },
};

export default meta;
type Story = StoryObj<typeof QuickSettings>;

const baseSettings: QuickSettingsType = {
  id: "settings-1",
  items: [
    { id: "wifi", type: "wifi", enabled: true },
    { id: "bluetooth", type: "bluetooth", enabled: false },
    { id: "airplane", type: "airplane", enabled: false },
    { id: "dnd", type: "dnd", enabled: false },
    { id: "flashlight", type: "flashlight", enabled: false },
    { id: "location", type: "location", enabled: true },
    { id: "dark-mode", type: "dark-mode", enabled: true },
    { id: "rotation", type: "rotation", enabled: true },
  ],
  layout: "grid",
  columns: 4,
  variant: "default",
};

export const Default: Story = {
  args: {
    settings: baseSettings,
  },
};

export const Grid4Columns: Story = {
  args: {
    settings: { ...baseSettings, layout: "grid", columns: 4 },
  },
};

export const Grid3Columns: Story = {
  args: {
    settings: { ...baseSettings, layout: "grid", columns: 3 },
  },
};

export const Grid2Columns: Story = {
  args: {
    settings: { ...baseSettings, layout: "grid", columns: 2 },
  },
};

export const RowLayout: Story = {
  args: {
    settings: {
      ...baseSettings,
      layout: "row",
      items: baseSettings.items.slice(0, 4),
    },
  },
};

export const ListLayout: Story = {
  args: {
    settings: {
      ...baseSettings,
      layout: "list",
      items: [
        { id: "wifi", type: "wifi", enabled: true, subtitle: "Home Network" },
        { id: "bluetooth", type: "bluetooth", enabled: false, subtitle: "2 devices" },
        { id: "location", type: "location", enabled: true, subtitle: "High accuracy" },
        { id: "dnd", type: "dnd", enabled: false, subtitle: "Until 7:00 AM" },
      ],
    },
  },
};

export const GlassVariant: Story = {
  args: {
    settings: { ...baseSettings, variant: "glass" },
  },
};

export const CompactVariant: Story = {
  args: {
    settings: { ...baseSettings, variant: "compact" },
  },
};

export const WithTitle: Story = {
  args: {
    settings: { ...baseSettings, title: "Quick Settings" },
  },
};

export const WithBattery: Story = {
  args: {
    settings: {
      ...baseSettings,
      title: "Settings",
      batteryLevel: 85,
      currentTime: "14:32",
    },
  },
};

export const LowBattery: Story = {
  args: {
    settings: {
      ...baseSettings,
      batteryLevel: 15,
    },
  },
};

export const WithUnavailable: Story = {
  args: {
    settings: {
      ...baseSettings,
      items: [
        { id: "wifi", type: "wifi", enabled: true },
        { id: "bluetooth", type: "bluetooth", enabled: false, available: false },
        { id: "nfc", type: "nfc", enabled: false, available: false },
        { id: "location", type: "location", enabled: true },
      ],
    },
  },
};

export const NoLabels: Story = {
  args: {
    settings: { ...baseSettings, showLabels: false },
  },
};

export const AllTypes: Story = {
  args: {
    settings: {
      ...baseSettings,
      columns: 4,
      items: [
        { id: "wifi", type: "wifi", enabled: true },
        { id: "bluetooth", type: "bluetooth", enabled: false },
        { id: "airplane", type: "airplane", enabled: false },
        { id: "dnd", type: "dnd", enabled: false },
        { id: "flashlight", type: "flashlight", enabled: false },
        { id: "location", type: "location", enabled: true },
        { id: "battery-saver", type: "battery-saver", enabled: false },
        { id: "dark-mode", type: "dark-mode", enabled: true },
        { id: "rotation", type: "rotation", enabled: true },
        { id: "hotspot", type: "hotspot", enabled: false },
        { id: "nfc", type: "nfc", enabled: false },
        { id: "sync", type: "sync", enabled: true },
        { id: "mute", type: "mute", enabled: false },
        { id: "vibrate", type: "vibrate", enabled: true },
        { id: "brightness", type: "brightness", enabled: true },
        { id: "volume", type: "volume", enabled: true },
      ],
    },
  },
};
