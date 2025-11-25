import type { Meta, StoryObj } from "@storybook/react";
import { ProgressRing } from "@cosmo/renderer-web";
import type { ProgressRing as ProgressRingType } from "@cosmo/core-schema";

const meta: Meta<typeof ProgressRing> = {
  title: "Components/ProgressRing",
  component: ProgressRing,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ProgressRing>;

const baseRing: ProgressRingType = {
  id: "ring-1",
  value: 65,
  size: 80,
  thickness: 8,
  variant: "info",
  animated: true,
  showValue: true,
  position: "center",
};

export const Default: Story = {
  args: {
    ring: baseRing,
  },
};

export const Empty: Story = {
  args: {
    ring: { ...baseRing, value: 0 },
  },
};

export const Quarter: Story = {
  args: {
    ring: { ...baseRing, value: 25 },
  },
};

export const Half: Story = {
  args: {
    ring: { ...baseRing, value: 50 },
  },
};

export const Full: Story = {
  args: {
    ring: { ...baseRing, value: 100, variant: "success" },
  },
};

export const InfoVariant: Story = {
  args: {
    ring: { ...baseRing, variant: "info" },
  },
};

export const SuccessVariant: Story = {
  args: {
    ring: { ...baseRing, variant: "success", value: 100 },
  },
};

export const WarningVariant: Story = {
  args: {
    ring: { ...baseRing, variant: "warning", value: 30 },
  },
};

export const ErrorVariant: Story = {
  args: {
    ring: { ...baseRing, variant: "error", value: 15 },
  },
};

export const WithLabel: Story = {
  args: {
    ring: { ...baseRing, label: "Progress", showValue: true },
  },
};

export const LargeSize: Story = {
  args: {
    ring: { ...baseRing, size: 150, thickness: 12 },
  },
};

export const SmallSize: Story = {
  args: {
    ring: { ...baseRing, size: 40, thickness: 4 },
  },
};

export const NoValue: Story = {
  args: {
    ring: { ...baseRing, showValue: false },
  },
};

export const ThickRing: Story = {
  args: {
    ring: { ...baseRing, thickness: 16 },
  },
};

export const ThinRing: Story = {
  args: {
    ring: { ...baseRing, thickness: 3 },
  },
};
