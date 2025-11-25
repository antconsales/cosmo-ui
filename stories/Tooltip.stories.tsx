import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "@cosmo/renderer-web";
import type { Tooltip as TooltipType } from "@cosmo/core-schema";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

const baseTooltip: TooltipType = {
  id: "tooltip-1",
  content: "This is a helpful tooltip message",
  position: "top",
  trigger: "hover",
  variant: "dark",
  showArrow: true,
  delayShow: 300,
  delayHide: 0,
  maxWidth: 250,
};

const Button = ({ children }: { children: React.ReactNode }) => (
  <button
    style={{
      padding: "12px 24px",
      fontSize: "14px",
      backgroundColor: "#3b82f6",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  >
    {children}
  </button>
);

export const Default: Story = {
  args: {
    tooltip: baseTooltip,
    children: <Button>Hover me</Button>,
  },
};

export const Dark: Story = {
  args: {
    tooltip: { ...baseTooltip, variant: "dark" },
    children: <Button>Dark Tooltip</Button>,
  },
};

export const Light: Story = {
  args: {
    tooltip: { ...baseTooltip, variant: "light" },
    children: <Button>Light Tooltip</Button>,
  },
};

export const Info: Story = {
  args: {
    tooltip: { ...baseTooltip, variant: "info", content: "This is informational" },
    children: <Button>Info Tooltip</Button>,
  },
};

export const Warning: Story = {
  args: {
    tooltip: { ...baseTooltip, variant: "warning", content: "Be careful!" },
    children: <Button>Warning Tooltip</Button>,
  },
};

export const Error: Story = {
  args: {
    tooltip: { ...baseTooltip, variant: "error", content: "Something went wrong" },
    children: <Button>Error Tooltip</Button>,
  },
};

export const PositionTop: Story = {
  args: {
    tooltip: { ...baseTooltip, position: "top" },
    children: <Button>Top</Button>,
  },
};

export const PositionBottom: Story = {
  args: {
    tooltip: { ...baseTooltip, position: "bottom" },
    children: <Button>Bottom</Button>,
  },
};

export const PositionLeft: Story = {
  args: {
    tooltip: { ...baseTooltip, position: "left" },
    children: <Button>Left</Button>,
  },
};

export const PositionRight: Story = {
  args: {
    tooltip: { ...baseTooltip, position: "right" },
    children: <Button>Right</Button>,
  },
};

export const ClickTrigger: Story = {
  args: {
    tooltip: { ...baseTooltip, trigger: "click", content: "Clicked!" },
    children: <Button>Click me</Button>,
  },
};

export const FocusTrigger: Story = {
  args: {
    tooltip: { ...baseTooltip, trigger: "focus", content: "Focused!" },
    children: (
      <input
        type="text"
        placeholder="Focus me"
        style={{
          padding: "12px",
          fontSize: "14px",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
        }}
      />
    ),
  },
};

export const NoArrow: Story = {
  args: {
    tooltip: { ...baseTooltip, showArrow: false },
    children: <Button>No Arrow</Button>,
  },
};

export const LongContent: Story = {
  args: {
    tooltip: {
      ...baseTooltip,
      content: "This is a much longer tooltip message that demonstrates how the tooltip handles multiple lines of text and wraps appropriately within its max width.",
      maxWidth: 300,
    },
    children: <Button>Long Content</Button>,
  },
};

export const InstantShow: Story = {
  args: {
    tooltip: { ...baseTooltip, delayShow: 0, content: "Instant!" },
    children: <Button>No Delay</Button>,
  },
};
