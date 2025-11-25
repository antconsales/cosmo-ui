/**
 * MessagePreview Component Schema
 * Incoming message display - key for wearable communication
 */

export type MessagePreviewType = "text" | "image" | "voice" | "video" | "file";

export type MessagePreviewVariant = "default" | "compact" | "expanded" | "glass";

export type MessagePreviewPriority = "low" | "normal" | "high" | "urgent";

export interface MessagePreviewSender {
  /** Sender name */
  name: string;
  /** Avatar URL */
  avatar?: string;
  /** Online status */
  online?: boolean;
  /** Verified/trusted sender */
  verified?: boolean;
}

export interface MessagePreviewAction {
  id: string;
  label: string;
  icon?: "reply" | "archive" | "delete" | "mute" | "call" | "video";
}

export interface MessagePreview {
  /** Unique identifier */
  id: string;
  /** Message type */
  type: MessagePreviewType;
  /** Sender info */
  sender: MessagePreviewSender;
  /** Message content/preview */
  content: string;
  /** Timestamp */
  timestamp: string;
  /** Priority level */
  priority?: MessagePreviewPriority;
  /** Visual variant */
  variant?: MessagePreviewVariant;
  /** Number of unread messages in thread */
  unreadCount?: number;
  /** App/source of message */
  app?: string;
  /** Quick reply options */
  quickReplies?: string[];
  /** Actions */
  actions?: MessagePreviewAction[];
  /** Whether message is read */
  read?: boolean;
  /** Auto-dismiss after seconds */
  autoHideAfterSeconds?: number;
}
