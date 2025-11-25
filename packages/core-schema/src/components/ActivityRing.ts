/**
 * ActivityRing Component Schema
 * Fitness progress rings - Apple Watch style for wearables
 */

export type ActivityRingVariant = "default" | "minimal" | "detailed" | "glass";

export type ActivityRingSize = "small" | "medium" | "large";

export interface ActivityRingData {
  /** Ring identifier */
  id: string;
  /** Ring label (e.g., "Move", "Exercise", "Stand") */
  label: string;
  /** Current value */
  current: number;
  /** Goal value */
  goal: number;
  /** Unit of measurement */
  unit?: string;
  /** Ring color */
  color: "red" | "green" | "blue" | "yellow" | "purple" | "orange" | "pink";
  /** Icon for the ring */
  icon?: "move" | "exercise" | "stand" | "steps" | "heart" | "calories" | "distance" | "custom";
}

export interface ActivityRing {
  /** Unique identifier */
  id: string;
  /** Ring data (1-4 rings) */
  rings: ActivityRingData[];
  /** Visual variant */
  variant?: ActivityRingVariant;
  /** Size */
  size?: ActivityRingSize;
  /** Show labels inside */
  showLabels?: boolean;
  /** Show percentage */
  showPercentage?: boolean;
  /** Show goal text */
  showGoals?: boolean;
  /** Animation enabled */
  animated?: boolean;
  /** Title/header */
  title?: string;
  /** Subtitle (e.g., date) */
  subtitle?: string;
  /** Ring thickness */
  strokeWidth?: number;
}
