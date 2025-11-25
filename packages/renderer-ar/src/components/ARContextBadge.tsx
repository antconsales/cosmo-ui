import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { ContextBadge, ContextBadgeMetadata } from "@cosmo/core-schema";
import {
  getARPosition,
  getPriorityZOffset,
} from "../utils/positioning";
import {
  getVariantColors,
} from "../utils/styling";
import {
  type WorldAnchor,
} from "../utils/anchoring";
import { useHitTest } from "../hooks/useHitTest";

/**
 * ARContextBadge - 3D Badge for AR environments
 *
 * Lightweight pill-shaped badge for contextual info
 * Supports screen-space (billboard) and world-space anchoring
 */

export interface ARContextBadgeProps {
  badge: ContextBadge;
  index?: number; // Stack index for same position
  onDismiss?: (id: string) => void;
}

// Badge dimensions (smaller than HUDCard)
const BADGE_WIDTH = 0.12; // 12cm
const BADGE_HEIGHT = 0.03; // 3cm

/**
 * Check if badge is world-space
 */
function isWorldSpaceBadge(metadata?: ContextBadgeMetadata): boolean {
  return metadata?.anchorType === "world-space";
}

/**
 * Get badge anchor from metadata (similar to HUDCard but with shorter default distance)
 */
function getBadgeAnchorFromMetadata(
  metadata?: ContextBadgeMetadata,
  camera?: THREE.Camera
): WorldAnchor | null {
  if (!metadata || metadata.anchorType !== "world-space") {
    return null;
  }

  const position = new THREE.Vector3();
  const rotation = new THREE.Euler();

  // Auto-anchor modes
  if (metadata.autoAnchor && camera) {
    const distance = metadata.autoAnchorDistance ?? 0.3; // 30cm default for badges

    switch (metadata.autoAnchor) {
      case "face": {
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(camera.quaternion);
        position.copy(camera.position).add(forward.multiplyScalar(distance));
        rotation.setFromQuaternion(camera.quaternion);
        return { position, rotation, isWorldSpace: true };
      }

      case "gaze": {
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(camera.quaternion);
        position.copy(camera.position).add(forward.multiplyScalar(distance));
        rotation.setFromQuaternion(camera.quaternion);
        return { position, rotation, isWorldSpace: true };
      }

      case "surface":
        // Surface anchoring handled via hit-test hook
        return null;
    }
  }

  // Explicit position
  if (metadata.worldPosition) {
    position.set(
      metadata.worldPosition[0],
      metadata.worldPosition[1],
      metadata.worldPosition[2]
    );
  }

  if (metadata.worldRotation) {
    rotation.set(
      metadata.worldRotation[0],
      metadata.worldRotation[1],
      metadata.worldRotation[2]
    );
  }

  return { position, rotation, isWorldSpace: true };
}

export function ARContextBadge({
  badge,
  index = 0,
  onDismiss,
}: ARContextBadgeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const isWorldSpace = isWorldSpaceBadge(badge.metadata);

  // Hit-testing for surface anchoring
  const needsHitTest = badge.metadata?.autoAnchor === "surface";
  const hitTestResult = useHitTest(needsHitTest);

  // World anchor state
  const [worldAnchor, setWorldAnchor] = useState<WorldAnchor | null>(null);

  // Pulse animation state
  const [pulseScale, setPulseScale] = useState(1);

  // Compute anchor on mount
  useEffect(() => {
    if (!isWorldSpace) return;

    if (needsHitTest && hitTestResult) {
      setWorldAnchor({
        position: hitTestResult.position,
        rotation: new THREE.Euler().setFromQuaternion(hitTestResult.rotation),
        isWorldSpace: true,
      });
      return;
    }

    if (!needsHitTest) {
      const anchor = getBadgeAnchorFromMetadata(badge.metadata, camera);
      setWorldAnchor(anchor);
    }
  }, [isWorldSpace, badge.metadata, camera, needsHitTest, hitTestResult]);

  // Position calculation
  const position = useMemo(() => {
    if (isWorldSpace && worldAnchor) {
      return [
        worldAnchor.position.x,
        worldAnchor.position.y,
        worldAnchor.position.z,
      ] as [number, number, number];
    }

    // Screen-space positioning
    const basePos = getARPosition(badge.position);
    const stackOffset = index * -0.015; // 1.5cm offset per badge
    const priorityOffset = getPriorityZOffset(3); // Badges don't have priority

    return [
      basePos.x,
      basePos.y + stackOffset,
      basePos.z + priorityOffset,
    ] as [number, number, number];
  }, [badge.position, index, isWorldSpace, worldAnchor]);

  // Get colors (support custom contextualColor)
  const colors = useMemo(() => {
    if (badge.contextualColor) {
      const customColor = new THREE.Color(badge.contextualColor);
      return {
        background: customColor,
        border: customColor.clone().multiplyScalar(0.8),
        text: new THREE.Color(0xffffff),
      };
    }
    return getVariantColors(badge.variant ?? "neutral");
  }, [badge.variant, badge.contextualColor]);

  // Material
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: colors.background,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [colors.background]
  );

  // Auto-dismiss timer
  useEffect(() => {
    if (badge.autoDismissMs && badge.autoDismissMs > 0 && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss(badge.id);
      }, badge.autoDismissMs);

      return () => clearTimeout(timer);
    }
  }, [badge.autoDismissMs, badge.id, onDismiss]);

  // Billboard behavior + pulse animation
  useFrame(({ camera: cam, clock }) => {
    if (!groupRef.current) return;

    if (isWorldSpace) {
      if (worldAnchor) {
        groupRef.current.rotation.copy(worldAnchor.rotation);
      }
    } else {
      // Billboard: always face camera
      groupRef.current.quaternion.copy(cam.quaternion);
    }

    // Pulse animation
    if (badge.pulse) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.05;
      setPulseScale(scale);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[pulseScale, pulseScale, 1]}>
      {/* Badge background - pill shape using rounded rectangle */}
      <mesh ref={meshRef} material={material}>
        <planeGeometry args={[BADGE_WIDTH, BADGE_HEIGHT]} />
      </mesh>

      {/* Border */}
      <lineSegments>
        <edgesGeometry
          attach="geometry"
          args={[new THREE.PlaneGeometry(BADGE_WIDTH, BADGE_HEIGHT)]}
        />
        <lineBasicMaterial attach="material" color={colors.border} />
      </lineSegments>

      {/* Visual indicator for pulse (glow effect) */}
      {badge.pulse && (
        <mesh position={[0, 0, -0.001]}>
          <planeGeometry args={[BADGE_WIDTH + 0.01, BADGE_HEIGHT + 0.01]} />
          <meshBasicMaterial
            color={colors.background}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
