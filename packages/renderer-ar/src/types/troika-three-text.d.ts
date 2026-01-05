/**
 * Type declarations for troika-three-text
 * @see https://github.com/protectwise/troika/tree/master/packages/troika-three-text
 */

declare module "troika-three-text" {
  import * as THREE from "three";

  export interface TextProps {
    text?: string;
    font?: string;
    fontSize?: number;
    color?: string | number | THREE.Color;
    maxWidth?: number;
    lineHeight?: number;
    letterSpacing?: number;
    textAlign?: "left" | "center" | "right" | "justify";
    anchorX?: "left" | "center" | "right" | number;
    anchorY?:
      | "top"
      | "top-baseline"
      | "middle"
      | "bottom-baseline"
      | "bottom"
      | number;
    fontWeight?: "normal" | "bold" | number;
    fontStyle?: "normal" | "italic";
    outlineWidth?: number | string;
    outlineColor?: string | number | THREE.Color;
    outlineBlur?: number | string;
    fillOpacity?: number;
    strokeWidth?: number;
    strokeColor?: string | number | THREE.Color;
    strokeOpacity?: number;
    depthOffset?: number;
    direction?: "auto" | "ltr" | "rtl";
    renderOrder?: number;
    visible?: boolean;
    clipRect?: [number, number, number, number] | null;
    overflowWrap?: "normal" | "break-word";
    whiteSpace?: "normal" | "nowrap" | "pre" | "pre-wrap" | "pre-line";
  }

  export class Text extends THREE.Mesh {
    text: string;
    font?: string;
    fontSize: number;
    color: string | number | THREE.Color;
    maxWidth: number;
    lineHeight: number;
    letterSpacing: number;
    textAlign: "left" | "center" | "right" | "justify";
    anchorX: "left" | "center" | "right" | number;
    anchorY:
      | "top"
      | "top-baseline"
      | "middle"
      | "bottom-baseline"
      | "bottom"
      | number;
    fontWeight: "normal" | "bold" | number;
    fontStyle: "normal" | "italic";
    outlineWidth: number | string;
    outlineColor: string | number | THREE.Color;
    outlineBlur: number | string;
    fillOpacity: number;
    strokeWidth: number;
    strokeColor: string | number | THREE.Color;
    strokeOpacity: number;
    depthOffset: number;
    direction: "auto" | "ltr" | "rtl";
    clipRect: [number, number, number, number] | null;
    overflowWrap: "normal" | "break-word";
    whiteSpace: "normal" | "nowrap" | "pre" | "pre-wrap" | "pre-line";

    sync(callback?: () => void): void;
    dispose(): void;
  }
}
