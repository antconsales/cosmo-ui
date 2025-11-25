import type { HUDCardVariant } from "@cosmo/core-schema";
import * as THREE from "three";

/**
 * AR styling system - Three.js materials
 * Maps HUDCard variants to 3D materials
 */

export interface ARCardColors {
  background: THREE.Color;
  border: THREE.Color;
  text: THREE.Color;
}

/**
 * Get colors for card variant
 */
export function getVariantColors(variant: HUDCardVariant = "neutral"): ARCardColors {
  switch (variant) {
    case "info":
      return {
        background: new THREE.Color(0x3b82f6), // blue-500
        border: new THREE.Color(0x2563eb), // blue-600
        text: new THREE.Color(0xffffff), // white
      };

    case "success":
      return {
        background: new THREE.Color(0x10b981), // green-500
        border: new THREE.Color(0x059669), // green-600
        text: new THREE.Color(0xffffff), // white
      };

    case "warning":
      return {
        background: new THREE.Color(0xf59e0b), // amber-500
        border: new THREE.Color(0xd97706), // amber-600
        text: new THREE.Color(0xffffff), // white
      };

    case "error":
      return {
        background: new THREE.Color(0xef4444), // red-500
        border: new THREE.Color(0xdc2626), // red-600
        text: new THREE.Color(0xffffff), // white
      };

    case "neutral":
    default:
      return {
        background: new THREE.Color(0x374151), // gray-700
        border: new THREE.Color(0x1f2937), // gray-800
        text: new THREE.Color(0xffffff), // white
      };
  }
}

/**
 * Create material for card background
 */
export function createBackgroundMaterial(
  variant: HUDCardVariant,
  opacity: number = 0.95
): THREE.MeshBasicMaterial {
  const colors = getVariantColors(variant);

  return new THREE.MeshBasicMaterial({
    color: colors.background,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
    depthWrite: false, // Prevent depth fighting
  });
}

/**
 * Create material for card border
 */
export function createBorderMaterial(
  variant: HUDCardVariant
): THREE.LineBasicMaterial {
  const colors = getVariantColors(variant);

  return new THREE.LineBasicMaterial({
    color: colors.border,
    linewidth: 2, // Note: linewidth > 1 only works with WebGLRenderer
  });
}

/**
 * Get icon emoji for rendering
 */
export function getIconEmoji(icon: string): string {
  switch (icon) {
    case "info":
      return "ℹ️";
    case "check":
      return "✓";
    case "alert":
      return "⚠";
    case "error":
      return "✕";
    case "bell":
      return "🔔";
    case "clock":
      return "🕐";
    case "star":
      return "⭐";
    case "none":
    default:
      return "";
  }
}
