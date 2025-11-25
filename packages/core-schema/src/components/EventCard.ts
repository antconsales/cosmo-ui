/**
 * EventCard Component Schema
 * Calendar event display - productivity on wearables
 */

export type EventCardVariant = "default" | "compact" | "detailed" | "glass";

export type EventCardStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export type EventCardType = "meeting" | "reminder" | "task" | "birthday" | "travel" | "other";

export interface EventCardLocation {
  /** Location name */
  name: string;
  /** Address */
  address?: string;
  /** Virtual meeting link */
  meetingUrl?: string;
  /** Is virtual meeting */
  isVirtual?: boolean;
}

export interface EventCardAttendee {
  name: string;
  avatar?: string;
  status?: "accepted" | "declined" | "tentative" | "pending";
}

export interface EventCardAction {
  id: string;
  type: "join" | "snooze" | "dismiss" | "directions" | "call";
  label?: string;
}

export interface EventCard {
  /** Unique identifier */
  id: string;
  /** Event title */
  title: string;
  /** Event type */
  type?: EventCardType;
  /** Start time (ISO string) */
  startTime: string;
  /** End time (ISO string) */
  endTime?: string;
  /** All day event */
  allDay?: boolean;
  /** Event status */
  status?: EventCardStatus;
  /** Location info */
  location?: EventCardLocation;
  /** Description/notes */
  description?: string;
  /** Attendees */
  attendees?: EventCardAttendee[];
  /** Visual variant */
  variant?: EventCardVariant;
  /** Color/category */
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "orange";
  /** Quick actions */
  actions?: EventCardAction[];
  /** Minutes until event starts */
  minutesUntil?: number;
  /** Reminder enabled */
  reminder?: boolean;
}
