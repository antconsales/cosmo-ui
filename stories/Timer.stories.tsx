import type { Meta, StoryObj } from "@storybook/react";
import { Timer } from "@cosmo/renderer-web";
import type { Timer as TimerType } from "@cosmo/core-schema";

const meta: Meta<typeof Timer> = {
  title: "Components/Productivity/Timer",
  component: Timer,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  argTypes: {
    onStart: { action: "start" },
    onPause: { action: "pause" },
    onReset: { action: "reset" },
    onComplete: { action: "complete" },
  },
};

export default meta;
type Story = StoryObj<typeof Timer>;

const baseTimer: TimerType = {
  id: "timer-1",
  mode: "countdown",
  initialSeconds: 300,
  currentSeconds: 245,
  state: "running",
  variant: "default",
};

export const Default: Story = {
  args: {
    timer: baseTimer,
  },
};

export const CountdownRunning: Story = {
  args: {
    timer: { ...baseTimer, mode: "countdown", state: "running" },
  },
};

export const CountdownPaused: Story = {
  args: {
    timer: { ...baseTimer, mode: "countdown", state: "paused" },
  },
};

export const StopwatchRunning: Story = {
  args: {
    timer: {
      ...baseTimer,
      mode: "stopwatch",
      initialSeconds: 0,
      currentSeconds: 127,
      state: "running",
    },
  },
};

export const StopwatchPaused: Story = {
  args: {
    timer: {
      ...baseTimer,
      mode: "stopwatch",
      initialSeconds: 0,
      currentSeconds: 3661,
      state: "paused",
    },
  },
};

export const CompactVariant: Story = {
  args: {
    timer: { ...baseTimer, variant: "compact" },
  },
};

export const GlassVariant: Story = {
  args: {
    timer: { ...baseTimer, variant: "glass" },
  },
};

export const LargeVariant: Story = {
  args: {
    timer: { ...baseTimer, variant: "large" },
  },
};

export const WithLabel: Story = {
  args: {
    timer: { ...baseTimer, label: "Workout Timer" },
  },
};

export const NearZero: Story = {
  args: {
    timer: {
      ...baseTimer,
      currentSeconds: 5,
      state: "running",
    },
  },
};

export const Completed: Story = {
  args: {
    timer: {
      ...baseTimer,
      currentSeconds: 0,
      state: "stopped",
    },
  },
};
