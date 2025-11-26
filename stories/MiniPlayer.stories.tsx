import type { Meta, StoryObj } from "@storybook/react";
import { MiniPlayer } from "@cosmo/renderer-web";
import type { MiniPlayer as MiniPlayerType } from "@cosmo/core-schema";

const meta: Meta<typeof MiniPlayer> = {
  title: "Components/Media/MiniPlayer",
  component: MiniPlayer,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  argTypes: {
    onPlay: { action: "play" },
    onPause: { action: "pause" },
    onNext: { action: "next" },
    onPrevious: { action: "previous" },
    onSeek: { action: "seek" },
  },
};

export default meta;
type Story = StoryObj<typeof MiniPlayer>;

const basePlayer: MiniPlayerType = {
  id: "player-1",
  state: "playing",
  track: {
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    artwork: "https://picsum.photos/seed/album/200",
  },
  progress: {
    current: 120,
    duration: 354,
  },
  variant: "default",
};

export const Default: Story = {
  args: {
    player: basePlayer,
  },
};

export const Playing: Story = {
  args: {
    player: { ...basePlayer, state: "playing" },
  },
};

export const Paused: Story = {
  args: {
    player: { ...basePlayer, state: "paused" },
  },
};

export const CompactVariant: Story = {
  args: {
    player: { ...basePlayer, variant: "compact" },
  },
};

export const GlassVariant: Story = {
  args: {
    player: { ...basePlayer, variant: "glass" },
  },
};

export const WithLongTitle: Story = {
  args: {
    player: {
      ...basePlayer,
      track: {
        ...basePlayer.track,
        title: "This Is A Very Long Song Title That Should Truncate",
        artist: "Artist With A Really Long Name",
      },
    },
  },
};

export const AtStart: Story = {
  args: {
    player: {
      ...basePlayer,
      progress: { current: 0, duration: 354 },
    },
  },
};

export const NearEnd: Story = {
  args: {
    player: {
      ...basePlayer,
      progress: { current: 340, duration: 354 },
    },
  },
};

export const NoArtwork: Story = {
  args: {
    player: {
      ...basePlayer,
      track: {
        title: "Unknown Track",
        artist: "Unknown Artist",
      },
    },
  },
};
