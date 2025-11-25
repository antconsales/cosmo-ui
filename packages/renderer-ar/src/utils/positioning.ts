import type { HUDCardPosition } from "@cosmo/core-schema";

/**
 * AR positioning system - screen-space coordinates
 * Maps position enum to normalized device coordinates (NDC)
 *
 * Screen-space in AR:
 * - Cards rendered as 3D planes in front of camera
 * - Positioned using NDC: [-1, 1] for X and Y
 * - Z distance fixed at comfortable viewing distance
 */

export interface ARPosition {
  x: number; // NDC X: -1 (left) to 1 (right)
  y: number; // NDC Y: -1 (bottom) to 1 (top)
  z: number; // Distance from camera (meters)
}

/**
 * Convert HUDCard position to AR screen-space coordinates
 */
export function getARPosition(
  position: HUDCardPosition = "top-right"
): ARPosition {
  const z = -0.5; // 50cm in front of camera (comfortable AR viewing distance)

  switch (position) {
    case "top-left":
      return { x: -0.7, y: 0.7, z };
    case "top-center":
      return { x: 0, y: 0.7, z };
    case "top-right":
      return { x: 0.7, y: 0.7, z };

    case "center-left":
      return { x: -0.7, y: 0, z };
    case "center-right":
      return { x: 0.7, y: 0, z };

    case "bottom-left":
      return { x: -0.7, y: -0.7, z };
    case "bottom-center":
      return { x: 0, y: -0.7, z };
    case "bottom-right":
      return { x: 0.7, y: -0.7, z };

    default:
      return { x: 0.7, y: 0.7, z }; // default to top-right
  }
}

/**
 * Get card dimensions for AR (in meters)
 * Scaled for comfortable AR viewing
 */
export function getARCardSize(): { width: number; height: number } {
  return {
    width: 0.25, // 25cm wide
    height: 0.15, // 15cm tall
  };
}

/**
 * Calculate spacing between stacked cards in same position
 */
export function getARStackOffset(index: number): { x: number; y: number } {
  return {
    x: 0,
    y: -0.02 * index, // Stack vertically with 2cm spacing
  };
}

/**
 * Convert priority to Z-offset (higher priority = closer to camera)
 */
export function getPriorityZOffset(priority: number): number {
  return (priority - 1) * 0.01; // 1cm per priority level
}
