import type { Meta, StoryObj } from "@storybook/react";
import { StatusIndicator } from "@cosmo/renderer-web";
import type { StatusIndicator as StatusIndicatorType } from "@cosmo/core-schema";

const meta: Meta<typeof StatusIndicator> = {
  title: "Components/StatusIndicator",
  component: StatusIndicator,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof StatusIndicator>;

const baseIndicator: StatusIndicatorType = {
  id: "indicator-1",
  state: "active",
  size: 16,
  pulse: false,
  glow: false,
  position: "top-right",
};

export const Default: Story = {
  args: {
    indicator: baseIndicator,
  },
};

export const Idle: Story = {
  args: {
    indicator: { ...baseIndicator, state: "idle" },
  },
};

export const Active: Story = {
  args: {
    indicator: { ...baseIndicator, state: "active" },
  },
};

export const Loading: Story = {
  args: {
    indicator: { ...baseIndicator, state: "loading", pulse: true },
  },
};

export const Success: Story = {
  args: {
    indicator: { ...baseIndicator, state: "success" },
  },
};

export const Warning: Story = {
  args: {
    indicator: { ...baseIndicator, state: "warning" },
  },
};

export const Error: Story = {
  args: {
    indicator: { ...baseIndicator, state: "error" },
  },
};

export const WithPulse: Story = {
  args: {
    indicator: { ...baseIndicator, state: "active", pulse: true },
  },
};

export const WithGlow: Story = {
  args: {
    indicator: { ...baseIndicator, state: "success", glow: true },
  },
};

export const WithLabel: Story = {
  args: {
    indicator: { ...baseIndicator, label: "Online" },
  },
};

export const LargeSize: Story = {
  args: {
    indicator: { ...baseIndicator, size: 24 },
  },
};

export const SmallSize: Story = {
  args: {
    indicator: { ...baseIndicator, size: 8 },
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <StatusIndicator indicator={{ ...baseIndicator, id: "1", state: "idle" }} />
        <div style={{ marginTop: "8px", fontSize: "12px", color: "#888" }}>Idle</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <StatusIndicator indicator={{ ...baseIndicator, id: "2", state: "active" }} />
        <div style={{ marginTop: "8px", fontSize: "12px", color: "#888" }}>Active</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <StatusIndicator indicator={{ ...baseIndicator, id: "3", state: "loading", pulse: true }} />
        <div style={{ marginTop: "8px", fontSize: "12px", color: "#888" }}>Loading</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <StatusIndicator indicator={{ ...baseIndicator, id: "4", state: "success" }} />
        <div style={{ marginTop: "8px", fontSize: "12px", color: "#888" }}>Success</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <StatusIndicator indicator={{ ...baseIndicator, id: "5", state: "warning" }} />
        <div style={{ marginTop: "8px", fontSize: "12px", color: "#888" }}>Warning</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <StatusIndicator indicator={{ ...baseIndicator, id: "6", state: "error" }} />
        <div style={{ marginTop: "8px", fontSize: "12px", color: "#888" }}>Error</div>
      </div>
    </div>
  ),
};
