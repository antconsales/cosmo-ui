/**
 * ContactCard Component Schema
 * Person info with quick actions - essential for wearable communication
 */

export type ContactCardVariant = "default" | "compact" | "detailed" | "glass";

export type ContactCardStatus = "online" | "offline" | "busy" | "away" | "dnd";

export interface ContactCardAction {
  id: string;
  type: "call" | "message" | "video" | "email" | "location" | "favorite";
  label?: string;
}

export interface ContactCard {
  /** Unique identifier */
  id: string;
  /** Contact name */
  name: string;
  /** Avatar URL */
  avatar?: string;
  /** Status */
  status?: ContactCardStatus;
  /** Title/role */
  title?: string;
  /** Organization/company */
  organization?: string;
  /** Phone number */
  phone?: string;
  /** Email address */
  email?: string;
  /** Last seen/contacted */
  lastSeen?: string;
  /** Visual variant */
  variant?: ContactCardVariant;
  /** Quick actions */
  actions?: ContactCardAction[];
  /** Whether contact is favorite */
  favorite?: boolean;
  /** Location if available */
  location?: string;
  /** Relationship label */
  relationship?: string;
}
