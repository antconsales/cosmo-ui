import type { Meta, StoryObj } from "@storybook/react";
import { MessagePreview } from "@cosmo/renderer-web";
import type { MessagePreview as MessagePreviewType } from "@cosmo/core-schema";

const meta: Meta<typeof MessagePreview> = {
  title: "Components/Communication/MessagePreview",
  component: MessagePreview,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  argTypes: {
    onReply: { action: "reply" },
    onDismiss: { action: "dismiss" },
    onOpen: { action: "open" },
  },
};

export default meta;
type Story = StoryObj<typeof MessagePreview>;

const baseMessage: MessagePreviewType = {
  id: "msg-1",
  sender: {
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?u=john",
  },
  content: "Hey! Are you free for a call later today?",
  timestamp: new Date().toISOString(),
  app: "Messages",
  variant: "default",
  read: false,
};

export const Default: Story = {
  args: {
    message: baseMessage,
  },
};

export const Unread: Story = {
  args: {
    message: { ...baseMessage, read: false },
  },
};

export const Read: Story = {
  args: {
    message: { ...baseMessage, read: true },
  },
};

export const CompactVariant: Story = {
  args: {
    message: { ...baseMessage, variant: "compact" },
  },
};

export const ExpandedVariant: Story = {
  args: {
    message: { ...baseMessage, variant: "expanded" },
  },
};

export const GlassVariant: Story = {
  args: {
    message: { ...baseMessage, variant: "glass" },
  },
};

export const WithQuickReplies: Story = {
  args: {
    message: {
      ...baseMessage,
      quickReplies: ["Yes!", "Not now", "Call me later"],
    },
  },
};

export const LongMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      content:
        "Hey! I wanted to check in about the project deadline. Do you think we can finish everything by Friday? Let me know if you need any help with the remaining tasks.",
    },
  },
};

export const FromWhatsApp: Story = {
  args: {
    message: {
      ...baseMessage,
      app: "WhatsApp",
      sender: { name: "Mom", avatar: "https://i.pravatar.cc/150?u=mom" },
      content: "Don't forget to call grandma today!",
    },
  },
};

export const FromSlack: Story = {
  args: {
    message: {
      ...baseMessage,
      app: "Slack",
      sender: { name: "Team Channel", avatar: "https://i.pravatar.cc/150?u=slack" },
      content: "New deployment successful! 🚀",
    },
  },
};

export const FromEmail: Story = {
  args: {
    message: {
      ...baseMessage,
      app: "Email",
      sender: { name: "Amazon", avatar: "https://i.pravatar.cc/150?u=amazon" },
      content: "Your order has been shipped!",
      subject: "Shipping Confirmation",
    },
  },
};

export const GroupMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      sender: { name: "Family Group", avatar: "https://i.pravatar.cc/150?u=family" },
      content: "Sarah: Who's bringing the cake?",
      isGroup: true,
    },
  },
};

export const WithAttachment: Story = {
  args: {
    message: {
      ...baseMessage,
      content: "Check out this photo!",
      hasAttachment: true,
      attachmentType: "image",
    },
  },
};

export const NoAvatar: Story = {
  args: {
    message: {
      ...baseMessage,
      sender: { name: "Unknown Sender" },
    },
  },
};

export const TimestampYesterday: Story = {
  args: {
    message: {
      ...baseMessage,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
  },
};
