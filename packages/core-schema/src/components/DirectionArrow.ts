/**
 * DirectionArrow Component Schema
 * Navigation arrow pointing to destination - AR wayfinding
 */

export type DirectionArrowVariant = "default" | "minimal" | "detailed" | "glass" | "ar";

export type DirectionArrowSize = "small" | "medium" | "large";

export type DirectionArrowMode = "walking" | "driving" | "cycling" | "transit";

export interface DirectionArrowDestination {
  /** Destination name */
  name: string;
  /** Address */
  address?: string;
  /** Category/type */
  category?: string;
}

export interface DirectionArrow {
  /** Unique identifier */
  id: string;
  /** Destination info */
  destination: DirectionArrowDestination;
  /** Direction in degrees (0-360, 0 = North) */
  bearing: number;
  /** Distance to destination */
  distance: number;
  /** Distance unit */
  distanceUnit?: "meters" | "kilometers" | "feet" | "miles";
  /** Estimated time in minutes */
  estimatedTime?: number;
  /** Navigation mode */
  mode?: DirectionArrowMode;
  /** Current instruction */
  instruction?: string;
  /** Next instruction */
  nextInstruction?: string;
  /** Visual variant */
  variant?: DirectionArrowVariant;
  /** Size */
  size?: DirectionArrowSize;
  /** Show compass */
  showCompass?: boolean;
  /** Arrow color */
  color?: "blue" | "green" | "orange" | "red";
  /** Pulse animation for close destinations */
  pulse?: boolean;
  /** Show ETA */
  showETA?: boolean;
}
