/**
 * Cosmo UI AR Text Component v1.0
 *
 * High-quality text rendering for AR/3D using troika-three-text.
 * Provides SDF (Signed Distance Field) text rendering for crisp text at any scale.
 */

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text as TroikaText } from "troika-three-text";
import * as THREE from "three";

// ============================================================================
// TYPES
// ============================================================================

export interface ARTextProps {
  /** Text content to display */
  children: string;

  /** Font size in world units (meters for AR) */
  fontSize?: number;

  /** Text color */
  color?: string | number;

  /** Maximum width before wrapping (0 = no wrap) */
  maxWidth?: number;

  /** Line height multiplier */
  lineHeight?: number;

  /** Letter spacing */
  letterSpacing?: number;

  /** Text alignment */
  textAlign?: "left" | "center" | "right" | "justify";

  /** Anchor point for positioning */
  anchorX?: "left" | "center" | "right" | number;
  anchorY?: "top" | "top-baseline" | "middle" | "bottom-baseline" | "bottom" | number;

  /** Font family or URL to font file */
  font?: string;

  /** Font weight (if font supports it) */
  fontWeight?: "normal" | "bold" | number;

  /** Font style */
  fontStyle?: "normal" | "italic";

  /** Outline width */
  outlineWidth?: number | string;

  /** Outline color */
  outlineColor?: string | number;

  /** Outline blur */
  outlineBlur?: number | string;

  /** Fill opacity */
  fillOpacity?: number;

  /** Stroke width */
  strokeWidth?: number;

  /** Stroke color */
  strokeColor?: string | number;

  /** Stroke opacity */
  strokeOpacity?: number;

  /** Material type */
  material?: THREE.Material;

  /** Depth offset to prevent z-fighting */
  depthOffset?: number;

  /** Direction for RTL languages */
  direction?: "auto" | "ltr" | "rtl";

  /** Whether to render as billboard (always face camera) */
  billboard?: boolean;

  /** Position in 3D space */
  position?: [number, number, number];

  /** Rotation in radians */
  rotation?: [number, number, number];

  /** Scale */
  scale?: number | [number, number, number];

  /** Callback when text is synced */
  onSync?: (text: TroikaText) => void;

  /** Render order for transparency sorting */
  renderOrder?: number;

  /** Whether text should be visible */
  visible?: boolean;

  /** Clipping rect [minX, minY, maxX, maxY] */
  clipRect?: [number, number, number, number];

  /** Text decoration */
  textDecoration?: "none" | "underline" | "line-through";

  /** Overflow mode */
  overflowWrap?: "normal" | "break-word";

  /** White space handling */
  whiteSpace?: "normal" | "nowrap" | "pre" | "pre-wrap" | "pre-line";
}

// ============================================================================
// DEFAULT FONTS
// ============================================================================

export const AR_FONTS = {
  /** System sans-serif (uses browser default) */
  system: undefined,
  /** Inter - clean, modern sans-serif */
  inter: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2",
  /** Roboto - Google's signature font */
  roboto: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2",
  /** Roboto Mono - monospace */
  mono: "https://fonts.gstatic.com/s/robotomono/v22/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_3vq_ROW4.woff2",
  /** SF Pro - Apple-like (open source alternative) */
  sfPro: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2",
} as const;

// ============================================================================
// AR TEXT PRESETS
// ============================================================================

export const AR_TEXT_PRESETS = {
  /** Title text - large, bold */
  title: {
    fontSize: 0.04,
    fontWeight: "bold" as const,
    letterSpacing: -0.01,
  },
  /** Body text - normal reading size */
  body: {
    fontSize: 0.025,
    fontWeight: "normal" as const,
    lineHeight: 1.5,
  },
  /** Caption text - small, secondary */
  caption: {
    fontSize: 0.018,
    fontWeight: "normal" as const,
    fillOpacity: 0.7,
  },
  /** Label text - very small */
  label: {
    fontSize: 0.014,
    fontWeight: "normal" as const,
    letterSpacing: 0.02,
  },
  /** Badge text - small, tight */
  badge: {
    fontSize: 0.016,
    fontWeight: "bold" as const,
    letterSpacing: 0.01,
  },
  /** HUD text - optimized for AR glasses */
  hud: {
    fontSize: 0.022,
    fontWeight: "normal" as const,
    outlineWidth: 0.002,
    outlineColor: "#000000",
    fillOpacity: 1,
  },
} as const;

// ============================================================================
// AR TEXT COMPONENT
// ============================================================================

/**
 * ARText - High-quality 3D text for AR using troika-three-text
 */
export function ARText({
  children,
  fontSize = 0.025,
  color = "#ffffff",
  maxWidth = 0,
  lineHeight = 1.4,
  letterSpacing = 0,
  textAlign = "left",
  anchorX = "center",
  anchorY = "middle",
  font,
  fontWeight = "normal",
  fontStyle = "normal",
  outlineWidth = 0,
  outlineColor = "#000000",
  outlineBlur = 0,
  fillOpacity = 1,
  strokeWidth = 0,
  strokeColor = "#000000",
  strokeOpacity = 1,
  depthOffset = 0,
  direction = "auto",
  billboard = false,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onSync,
  renderOrder = 0,
  visible = true,
  clipRect,
  textDecoration = "none",
  overflowWrap = "break-word",
  whiteSpace = "normal",
}: ARTextProps) {
  const textRef = useRef<TroikaText>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Create text mesh
  const textMesh = useMemo(() => {
    const text = new TroikaText();
    return text;
  }, []);

  // Update text properties
  useEffect(() => {
    if (!textMesh) return;

    textMesh.text = children;
    textMesh.fontSize = fontSize;
    textMesh.color = color;
    textMesh.maxWidth = maxWidth;
    textMesh.lineHeight = lineHeight;
    textMesh.letterSpacing = letterSpacing;
    textMesh.textAlign = textAlign;
    textMesh.anchorX = anchorX;
    textMesh.anchorY = anchorY;
    textMesh.font = font ?? AR_FONTS.inter;
    textMesh.fontWeight = fontWeight;
    textMesh.fontStyle = fontStyle;
    textMesh.outlineWidth = outlineWidth;
    textMesh.outlineColor = outlineColor;
    textMesh.outlineBlur = outlineBlur;
    textMesh.fillOpacity = fillOpacity;
    textMesh.strokeWidth = strokeWidth;
    textMesh.strokeColor = strokeColor;
    textMesh.strokeOpacity = strokeOpacity;
    textMesh.depthOffset = depthOffset;
    textMesh.direction = direction;
    textMesh.renderOrder = renderOrder;
    textMesh.visible = visible;
    textMesh.clipRect = clipRect ?? null;
    textMesh.overflowWrap = overflowWrap;
    textMesh.whiteSpace = whiteSpace;

    // Handle text decoration
    if (textDecoration === "underline") {
      // Troika doesn't have built-in underline, would need custom implementation
    }

    // Sync text geometry
    textMesh.sync(() => {
      onSync?.(textMesh);
    });

    return () => {
      textMesh.dispose();
    };
  }, [
    textMesh,
    children,
    fontSize,
    color,
    maxWidth,
    lineHeight,
    letterSpacing,
    textAlign,
    anchorX,
    anchorY,
    font,
    fontWeight,
    fontStyle,
    outlineWidth,
    outlineColor,
    outlineBlur,
    fillOpacity,
    strokeWidth,
    strokeColor,
    strokeOpacity,
    depthOffset,
    direction,
    renderOrder,
    visible,
    clipRect,
    textDecoration,
    overflowWrap,
    whiteSpace,
    onSync,
  ]);

  // Billboard behavior - always face camera
  useFrame(({ camera }) => {
    if (billboard && groupRef.current) {
      groupRef.current.quaternion.copy(camera.quaternion);
    }
  });

  // Compute scale
  const scaleArray = useMemo(() => {
    if (typeof scale === "number") {
      return [scale, scale, scale] as [number, number, number];
    }
    return scale;
  }, [scale]);

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scaleArray}
    >
      <primitive ref={textRef} object={textMesh} />
    </group>
  );
}

// ============================================================================
// PRESET COMPONENTS
// ============================================================================

/**
 * ARTitle - Large title text
 */
export function ARTitle(props: Omit<ARTextProps, keyof typeof AR_TEXT_PRESETS.title>) {
  return <ARText {...AR_TEXT_PRESETS.title} {...props} />;
}

/**
 * ARBody - Standard body text
 */
export function ARBody(props: Omit<ARTextProps, keyof typeof AR_TEXT_PRESETS.body>) {
  return <ARText {...AR_TEXT_PRESETS.body} {...props} />;
}

/**
 * ARCaption - Small caption text
 */
export function ARCaption(props: Omit<ARTextProps, keyof typeof AR_TEXT_PRESETS.caption>) {
  return <ARText {...AR_TEXT_PRESETS.caption} {...props} />;
}

/**
 * ARLabel - Very small label text
 */
export function ARLabel(props: Omit<ARTextProps, keyof typeof AR_TEXT_PRESETS.label>) {
  return <ARText {...AR_TEXT_PRESETS.label} {...props} />;
}

/**
 * ARBadge - Small badge text
 */
export function ARBadge(props: Omit<ARTextProps, keyof typeof AR_TEXT_PRESETS.badge>) {
  return <ARText {...AR_TEXT_PRESETS.badge} {...props} />;
}

/**
 * ARHUDText - HUD-optimized text with outline for readability
 */
export function ARHUDText(props: Omit<ARTextProps, keyof typeof AR_TEXT_PRESETS.hud>) {
  return <ARText {...AR_TEXT_PRESETS.hud} {...props} />;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate optimal font size for AR based on distance
 * @param distanceMeters - Distance from user in meters
 * @param baseSize - Base font size at 1 meter
 * @returns Adjusted font size
 */
export function calculateARFontSize(
  distanceMeters: number,
  baseSize: number = 0.025
): number {
  // Linear scaling: text should appear same visual size regardless of distance
  return baseSize * distanceMeters;
}

/**
 * Calculate max width for text at a given distance to fill percentage of FOV
 * @param distanceMeters - Distance from user in meters
 * @param fovPercent - Percentage of field of view to fill (0-1)
 * @param fovDegrees - Horizontal field of view in degrees
 * @returns Max width in meters
 */
export function calculateARMaxWidth(
  distanceMeters: number,
  fovPercent: number = 0.3,
  fovDegrees: number = 90
): number {
  const fovRadians = (fovDegrees * Math.PI) / 180;
  const fullWidth = 2 * distanceMeters * Math.tan(fovRadians / 2);
  return fullWidth * fovPercent;
}

/**
 * Get contrasting text color for background
 */
export function getContrastingColor(backgroundColor: string): string {
  // Simple luminance check
  const hex = backgroundColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}
