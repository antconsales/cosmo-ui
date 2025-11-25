/**
 * MediaCard Component Schema
 * Display images/videos with metadata - perfect for wearable content preview
 */

export type MediaCardType = "image" | "video" | "audio" | "link";

export type MediaCardSize = "small" | "medium" | "large";

export type MediaCardVariant = "default" | "featured" | "minimal" | "glass";

export interface MediaCardSource {
  /** URL of the media */
  url: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Thumbnail URL for videos */
  thumbnail?: string;
}

export interface MediaCardMetadata {
  /** Source/author name */
  source?: string;
  /** Duration for video/audio (in seconds) */
  duration?: number;
  /** Timestamp or date string */
  timestamp?: string;
  /** View/play count */
  views?: number;
}

export interface MediaCardAction {
  id: string;
  label: string;
  icon?: "play" | "pause" | "share" | "save" | "open" | "download" | "favorite";
}

export interface MediaCard {
  /** Unique identifier */
  id: string;
  /** Type of media */
  type: MediaCardType;
  /** Media source */
  media: MediaCardSource;
  /** Title of the content */
  title: string;
  /** Optional description */
  description?: string;
  /** Size variant */
  size?: MediaCardSize;
  /** Visual variant */
  variant?: MediaCardVariant;
  /** Metadata info */
  metadata?: MediaCardMetadata;
  /** Quick actions */
  actions?: MediaCardAction[];
  /** Whether card is dismissible */
  dismissible?: boolean;
}
