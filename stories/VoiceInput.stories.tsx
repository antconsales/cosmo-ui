import type { Meta, StoryObj } from "@storybook/react";
import { VoiceInput } from "@cosmo/renderer-web";
import type { VoiceInput as VoiceInputType } from "@cosmo/core-schema";

const meta: Meta<typeof VoiceInput> = {
  title: "Components/Productivity/VoiceInput",
  component: VoiceInput,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  argTypes: {
    onStart: { action: "start" },
    onStop: { action: "stop" },
    onResult: { action: "result" },
    onError: { action: "error" },
  },
};

export default meta;
type Story = StoryObj<typeof VoiceInput>;

const baseVoice: VoiceInputType = {
  id: "voice-1",
  state: "idle",
  variant: "default",
};

export const Default: Story = {
  args: {
    input: baseVoice,
  },
};

export const Idle: Story = {
  args: {
    input: { ...baseVoice, state: "idle" },
  },
};

export const Listening: Story = {
  args: {
    input: { ...baseVoice, state: "listening" },
  },
};

export const Processing: Story = {
  args: {
    input: { ...baseVoice, state: "processing" },
  },
};

export const CompactVariant: Story = {
  args: {
    input: { ...baseVoice, variant: "compact" },
  },
};

export const GlassVariant: Story = {
  args: {
    input: { ...baseVoice, variant: "glass" },
  },
};

export const FloatingVariant: Story = {
  args: {
    input: { ...baseVoice, variant: "floating" },
  },
};

export const InlineVariant: Story = {
  args: {
    input: { ...baseVoice, variant: "inline" },
  },
};

export const WithTranscript: Story = {
  args: {
    input: {
      ...baseVoice,
      state: "listening",
      transcript: "Send a message to...",
    },
  },
};

export const WithFullTranscript: Story = {
  args: {
    input: {
      ...baseVoice,
      state: "processing",
      transcript: "Send a message to John saying I'll be there in 10 minutes",
    },
  },
};

export const WithPlaceholder: Story = {
  args: {
    input: {
      ...baseVoice,
      placeholder: "Tap to speak...",
    },
  },
};

export const WithLanguage: Story = {
  args: {
    input: {
      ...baseVoice,
      language: "en-US",
      showLanguage: true,
    },
  },
};

export const ErrorState: Story = {
  args: {
    input: {
      ...baseVoice,
      state: "error",
      errorMessage: "Could not access microphone",
    },
  },
};

export const WithWaveform: Story = {
  args: {
    input: {
      ...baseVoice,
      state: "listening",
      showWaveform: true,
      audioLevel: 0.7,
    },
  },
};

export const WithDuration: Story = {
  args: {
    input: {
      ...baseVoice,
      state: "listening",
      duration: 5,
      maxDuration: 60,
    },
  },
};

export const WithHints: Story = {
  args: {
    input: {
      ...baseVoice,
      hints: ["Send message", "Set timer", "Play music", "Call mom"],
    },
  },
};

export const Disabled: Story = {
  args: {
    input: {
      ...baseVoice,
      disabled: true,
    },
  },
};

export const ContinuousMode: Story = {
  args: {
    input: {
      ...baseVoice,
      state: "listening",
      continuous: true,
      transcript: "Continuous listening mode active...",
    },
  },
};
