import type { Meta, StoryObj } from "@storybook/react";
import { MediaCard } from "@cosmo/renderer-web";
import type { MediaCard as MediaCardType } from "@cosmo/core-schema";

const meta: Meta<typeof MediaCard> = {
  title: "Components/Media/MediaCard",
  component: MediaCard,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  argTypes: {
    onAction: { action: "action" },
    onDismiss: { action: "dismiss" },
  },
};

export default meta;
type Story = StoryObj<typeof MediaCard>;

const baseCard: MediaCardType = {
  id: "media-1",
  type: "image",
  title: "Beautiful Sunset",
  description: "A stunning sunset over the ocean",
  thumbnail: "https://picsum.photos/seed/sunset/400/300",
  source: "https://picsum.photos/seed/sunset/1920/1080",
  variant: "default",
};

export const Default: Story = {
  args: {
    card: baseCard,
  },
};

export const ImageCard: Story = {
  args: {
    card: { ...baseCard, type: "image" },
  },
};

export const VideoCard: Story = {
  args: {
    card: {
      ...baseCard,
      type: "video",
      title: "Amazing Wildlife",
      description: "Nature documentary clip",
      duration: 245,
    },
  },
};

export const AudioCard: Story = {
  args: {
    card: {
      ...baseCard,
      type: "audio",
      title: "Podcast Episode",
      description: "Tech Talk Weekly #42",
      duration: 1845,
    },
  },
};

export const DocumentCard: Story = {
  args: {
    card: {
      ...baseCard,
      type: "document",
      title: "Project Report.pdf",
      description: "Q4 Financial Report",
      fileSize: 2456000,
    },
  },
};

export const CompactVariant: Story = {
  args: {
    card: { ...baseCard, variant: "compact" },
  },
};

export const GlassVariant: Story = {
  args: {
    card: { ...baseCard, variant: "glass" },
  },
};

export const FeaturedVariant: Story = {
  args: {
    card: { ...baseCard, variant: "featured" },
  },
};

export const WithMetadata: Story = {
  args: {
    card: {
      ...baseCard,
      metadata: {
        author: "John Doe",
        date: "2024-01-15",
        views: 12500,
      },
    },
  },
};

export const WithActions: Story = {
  args: {
    card: {
      ...baseCard,
      actions: [
        { id: "play", label: "Play", icon: "play" },
        { id: "share", label: "Share", icon: "share" },
        { id: "download", label: "Download", icon: "download" },
      ],
    },
  },
};

export const Dismissible: Story = {
  args: {
    card: { ...baseCard, dismissible: true },
  },
};

export const NoThumbnail: Story = {
  args: {
    card: {
      ...baseCard,
      thumbnail: undefined,
      title: "File Without Preview",
    },
  },
};

export const LongDescription: Story = {
  args: {
    card: {
      ...baseCard,
      description:
        "This is a very long description that should be truncated or wrapped appropriately to fit within the card boundaries.",
    },
  },
};

export const PlaylistCard: Story = {
  args: {
    card: {
      ...baseCard,
      type: "playlist",
      title: "Workout Mix",
      description: "25 songs • 1h 32m",
      itemCount: 25,
    },
  },
};
