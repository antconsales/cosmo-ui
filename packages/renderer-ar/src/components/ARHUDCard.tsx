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

/**
 * ARHUDCard - 3D HUD Card for AR environments
 *
 * v0.2: Supports both screen-space (billboard) and world-space (fixed) anchoring
 * - Screen-space: follows camera, uses position enum
 * - World-space: fixed in 3D space, uses metadata.worldPosition or auto-anchor
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

      {/* Text rendering would require troika-three-text or THREE.TextGeometry */}
      {/* For v0.1, we keep it minimal - text will be added in next iteration */}
    </group>
  );
}
