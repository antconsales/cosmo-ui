import type { Meta, StoryObj } from "@storybook/react";
import { ActivityRing } from "@cosmo/renderer-web";
import type { ActivityRing as ActivityRingType } from "@cosmo/core-schema";

const meta: Meta<typeof ActivityRing> = {
  title: "Components/Core/ActivityRing",
  component: ActivityRing,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
};

export default meta;
type Story = StoryObj<typeof ActivityRing>;

const baseRing: ActivityRingType = {
  id: "activity-1",
  rings: [
    { id: "move", label: "Move", value: 450, goal: 500, color: "red" },
    { id: "exercise", label: "Exercise", value: 25, goal: 30, color: "green" },
    { id: "stand", label: "Stand", value: 10, goal: 12, color: "blue" },
  ],
  variant: "default",
  size: "medium",
};

export const Default: Story = {
  args: {
    ring: baseRing,
  },
};

export const SmallSize: Story = {
  args: {
    ring: { ...baseRing, size: "small" },
  },
};

export const LargeSize: Story = {
  args: {
    ring: { ...baseRing, size: "large" },
  },
};

export const CompactVariant: Story = {
  args: {
    ring: { ...baseRing, variant: "compact" },
  },
};

export const DetailedVariant: Story = {
  args: {
    ring: { ...baseRing, variant: "detailed" },
  },
};

export const AllGoalsComplete: Story = {
  args: {
    ring: {
      ...baseRing,
      rings: [
        { id: "move", label: "Move", value: 550, goal: 500, color: "red" },
        { id: "exercise", label: "Exercise", value: 35, goal: 30, color: "green" },
        { id: "stand", label: "Stand", value: 12, goal: 12, color: "blue" },
      ],
    },
  },
};

export const JustStarted: Story = {
  args: {
    ring: {
      ...baseRing,
      rings: [
        { id: "move", label: "Move", value: 50, goal: 500, color: "red" },
        { id: "exercise", label: "Exercise", value: 5, goal: 30, color: "green" },
        { id: "stand", label: "Stand", value: 2, goal: 12, color: "blue" },
      ],
    },
  },
};

export const HalfwayThere: Story = {
  args: {
    ring: {
      ...baseRing,
      rings: [
        { id: "move", label: "Move", value: 250, goal: 500, color: "red" },
        { id: "exercise", label: "Exercise", value: 15, goal: 30, color: "green" },
        { id: "stand", label: "Stand", value: 6, goal: 12, color: "blue" },
      ],
    },
  },
};

export const SingleRing: Story = {
  args: {
    ring: {
      ...baseRing,
      rings: [{ id: "steps", label: "Steps", value: 7500, goal: 10000, color: "blue" }],
    },
  },
};

export const TwoRings: Story = {
  args: {
    ring: {
      ...baseRing,
      rings: [
        { id: "calories", label: "Calories", value: 1800, goal: 2000, color: "orange" },
        { id: "active", label: "Active", value: 45, goal: 60, color: "purple" },
      ],
    },
  },
};

export const CustomColors: Story = {
  args: {
    ring: {
      ...baseRing,
      rings: [
        { id: "ring1", label: "Ring 1", value: 75, goal: 100, color: "purple" },
        { id: "ring2", label: "Ring 2", value: 60, goal: 100, color: "orange" },
        { id: "ring3", label: "Ring 3", value: 90, goal: 100, color: "cyan" },
      ],
    },
  },
};

export const WithShowLabels: Story = {
  args: {
    ring: { ...baseRing, showLabels: true },
  },
};

export const OverGoal: Story = {
  args: {
    ring: {
      ...baseRing,
      rings: [
        { id: "move", label: "Move", value: 750, goal: 500, color: "red" },
        { id: "exercise", label: "Exercise", value: 45, goal: 30, color: "green" },
        { id: "stand", label: "Stand", value: 14, goal: 12, color: "blue" },
      ],
    },
  },
};
