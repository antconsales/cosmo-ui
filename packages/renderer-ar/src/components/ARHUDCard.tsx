import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { HUDCard } from "@cosmo/core-schema";
import {
  getARPosition,
  getARCardSize,
  getPriorityZOffset,
} from "../utils/positioning";
import {
  createBackgroundMaterial,
  getVariantColors,
} from "../utils/styling";
import {
  getAnchorFromMetadata,
  isWorldSpaceCard,
  type WorldAnchor,
} from "../utils/anchoring";
import { useHitTest } from "../hooks/useHitTest";
import { ARText, calculateARFontSize } from "./ARText";

/**
 * ARHUDCard - 3D HUD Card for AR environments
 *
 * v1.0: Full text rendering with troika-three-text
 * - Screen-space: follows camera, uses position enum
 * - World-space: fixed in 3D space, uses metadata.worldPosition or auto-anchor
 * - Rich text rendering with SDF fonts
 */

export interface ARHUDCardProps {
  card: HUDCard;
  index?: number; // Stack index for same position (screen-space only)
  onDismiss?: (id: string) => void;
  onAction?: (cardId: string, actionId: string) => void;
}

export function ARHUDCard({
  card,
  index = 0,
  onDismiss,
  onAction: _onAction,
}: ARHUDCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Check if this is a world-space card
  const isWorldSpace = isWorldSpaceCard(card.metadata);

  // Hit-testing for surface anchoring
  const needsHitTest = card.metadata?.autoAnchor === "surface";
  const hitTestResult = useHitTest(needsHitTest);

  // World-space anchor (computed once at spawn)
  const [worldAnchor, setWorldAnchor] = useState<WorldAnchor | null>(null);

  // Compute anchor on mount
  useEffect(() => {
    if (!isWorldSpace) return;

    // For surface anchoring, wait for hit-test result
    if (needsHitTest && hitTestResult) {
      setWorldAnchor({
        position: hitTestResult.position,
        rotation: new THREE.Euler().setFromQuaternion(hitTestResult.rotation),
        isWorldSpace: true,
      });
      return;
    }

    // For other anchor modes, compute immediately
    if (!needsHitTest) {
      const anchor = getAnchorFromMetadata(card.metadata, camera);
      setWorldAnchor(anchor);
    }
  }, [isWorldSpace, card.metadata, camera, needsHitTest, hitTestResult]);

  // Position calculation
  const position = useMemo(() => {
    // World-space: use anchor position
    if (isWorldSpace && worldAnchor) {
      return [
        worldAnchor.position.x,
        worldAnchor.position.y,
        worldAnchor.position.z,
      ] as [number, number, number];
    }

    // Screen-space: use NDC position with stack offset
    const basePos = getARPosition(card.position);
    const stackOffset = index * -0.02; // 2cm vertical offset per card
    const priorityOffset = getPriorityZOffset(card.priority ?? 3);

    return [
      basePos.x,
      basePos.y + stackOffset,
      basePos.z + priorityOffset,
    ] as [number, number, number];
  }, [card.position, index, card.priority, isWorldSpace, worldAnchor]);

  // Card size
  const size = useMemo(() => getARCardSize(), []);

  // Material
  const material = useMemo(
    () => createBackgroundMaterial(card.variant ?? "neutral", 0.95),
    [card.variant]
  );

  // Auto-hide timer
  useEffect(() => {
    if (
      card.autoHideAfterSeconds &&
      card.autoHideAfterSeconds > 0 &&
      onDismiss
    ) {
      const timer = setTimeout(() => {
        onDismiss(card.id);
      }, card.autoHideAfterSeconds * 1000);

      return () => clearTimeout(timer);
    }
  }, [card.autoHideAfterSeconds, card.id, onDismiss]);

  // Billboard behavior (screen-space only) OR world-space rotation
  useFrame(({ camera: cam }) => {
    if (!groupRef.current) return;

    if (isWorldSpace) {
      // World-space: use fixed rotation from anchor
      if (worldAnchor) {
        groupRef.current.rotation.copy(worldAnchor.rotation);
      }
    } else {
      // Screen-space: billboard behavior (always face camera)
      groupRef.current.quaternion.copy(cam.quaternion);
    }
  });

  // Colors for border
  const colors = useMemo(
    () => getVariantColors(card.variant ?? "neutral"),
    [card.variant]
  );

  // Text styling based on card distance
  const textDistance = 0.5; // Default distance for AR text sizing
  const titleFontSize = calculateARFontSize(textDistance, 0.03);
  const contentFontSize = calculateARFontSize(textDistance, 0.02);
  const buttonFontSize = calculateARFontSize(textDistance, 0.016);

  // Text colors - convert THREE.Color to hex string
  const textColor = colors.text ? `#${colors.text.getHexString()}` : "#ffffff";
  const mutedColor = "rgba(255, 255, 255, 0.7)";

  // Calculate padding
  const padding = 0.015;
  const contentStartY = size.height / 2 - padding - titleFontSize;

  return (
    <group ref={groupRef} position={position}>
      {/* Card background */}
      <mesh ref={meshRef} material={material}>
        <planeGeometry args={[size.width, size.height]} />
      </mesh>

      {/* Border */}
      <lineSegments>
        <edgesGeometry
          attach="geometry"
          args={[new THREE.PlaneGeometry(size.width, size.height)]}
        />
        <lineBasicMaterial attach="material" color={colors.border} />
      </lineSegments>

      {/* Title text */}
      <ARText
        position={[-size.width / 2 + padding, contentStartY, 0.001]}
        color={textColor}
        fontSize={titleFontSize}
        anchorX="left"
        anchorY="top"
        maxWidth={size.width - padding * 2}
        fontWeight="bold"
        outlineWidth={0.001}
        outlineColor="#000000"
      >
        {card.title}
      </ARText>

      {/* Content text */}
      <ARText
        position={[-size.width / 2 + padding, contentStartY - titleFontSize - 0.01, 0.001]}
        color={mutedColor}
        fontSize={contentFontSize}
        anchorX="left"
        anchorY="top"
        maxWidth={size.width - padding * 2}
        lineHeight={1.4}
        outlineWidth={0.0005}
        outlineColor="#000000"
      >
        {card.content}
      </ARText>

      {/* Action buttons */}
      {card.actions && card.actions.length > 0 && (
        <group position={[0, -size.height / 2 + padding + 0.02, 0.002]}>
          {card.actions.map((action, index) => {
            const buttonWidth = 0.06;
            const buttonHeight = 0.025;
            const buttonSpacing = 0.01;
            const totalWidth = card.actions!.length * buttonWidth + (card.actions!.length - 1) * buttonSpacing;
            const startX = -totalWidth / 2 + buttonWidth / 2;
            const buttonX = startX + index * (buttonWidth + buttonSpacing);

            const buttonColor = action.variant === "primary"
              ? colors.border
              : action.variant === "destructive"
              ? "#ef4444"
              : "rgba(255, 255, 255, 0.2)";

            return (
              <group key={action.id} position={[buttonX, 0, 0]}>
                {/* Button background */}
                <mesh>
                  <planeGeometry args={[buttonWidth, buttonHeight]} />
                  <meshBasicMaterial
                    color={buttonColor}
                    transparent
                    opacity={0.9}
                  />
                </mesh>
                {/* Button label */}
                <ARText
                  position={[0, 0, 0.001]}
                  color={action.variant === "primary" ? "#ffffff" : textColor}
                  fontSize={buttonFontSize}
                  anchorX="center"
                  anchorY="middle"
                  fontWeight="bold"
                >
                  {action.label}
                </ARText>
              </group>
            );
          })}
        </group>
      )}

      {/* Dismiss button (if dismissible) */}
      {card.dismissible !== false && (
        <group position={[size.width / 2 - padding, size.height / 2 - padding, 0.002]}>
          <ARText
            color={mutedColor}
            fontSize={titleFontSize}
            anchorX="right"
            anchorY="top"
          >
            ×
          </ARText>
        </group>
      )}
    </group>
  );
}
