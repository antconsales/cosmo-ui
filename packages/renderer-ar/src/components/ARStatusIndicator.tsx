import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { StatusIndicator, StatusIndicatorMetadata, StatusIndicatorPosition, HUDCardPosition } from "@cosmo/core-schema";
import {
  getARPosition,
  getPriorityZOffset,
  type ARPosition,
} from "../utils/positioning";
import {
  type WorldAnchor,
} from "../utils/anchoring";
import { useHitTest } from "../hooks/useHitTest";

/**
 * Get AR position for StatusIndicator, handling "center" position specially
 */
function getIndicatorARPosition(position?: StatusIndicatorPosition): ARPosition {
  if (position === "center") {
    return { x: 0, y: 0, z: -0.5 }; // Center of view, 50cm away
  }
  return getARPosition(position as HUDCardPosition);
}

/**
 * ARStatusIndicator - 3D Status Dot for AR environments
 *
 * Minimal sphere indicator for showing status
 * Supports screen-space (billboard) and world-space anchoring
 */

export interface ARStatusIndicatorProps {
  indicator: StatusIndicator;
  index?: number;
  onDismiss?: (id: string) => void;
}

// Default indicator size in meters
const DEFAULT_INDICATOR_SIZE = 0.008; // 8mm

/**
 * State color mapping for AR
 */
const STATE_COLORS: Record<string, { main: THREE.Color; glow: THREE.Color }> = {
  idle: {
    main: new THREE.Color(0x9ca3af),  // Gray-400
    glow: new THREE.Color(0x9ca3af),
  },
  active: {
    main: new THREE.Color(0x3b82f6),  // Blue-500
    glow: new THREE.Color(0x3b82f6),
  },
  loading: {
    main: new THREE.Color(0x3b82f6),  // Blue-500
    glow: new THREE.Color(0x3b82f6),
  },
  success: {
    main: new THREE.Color(0x22c55e),  // Green-500
    glow: new THREE.Color(0x22c55e),
  },
  warning: {
    main: new THREE.Color(0xf59e0b),  // Amber-500
    glow: new THREE.Color(0xf59e0b),
  },
  error: {
    main: new THREE.Color(0xef4444),  // Red-500
    glow: new THREE.Color(0xef4444),
  },
};

/**
 * Check if indicator is world-space
 */
function isWorldSpaceIndicator(metadata?: StatusIndicatorMetadata): boolean {
  return metadata?.anchorType === "world-space";
}

/**
 * Get indicator anchor from metadata
 */
function getIndicatorAnchorFromMetadata(
  metadata?: StatusIndicatorMetadata,
  camera?: THREE.Camera
): WorldAnchor | null {
  if (!metadata || metadata.anchorType !== "world-space") {
    return null;
  }

  const position = new THREE.Vector3();
  const rotation = new THREE.Euler();

  // Auto-anchor modes
  if (metadata.autoAnchor && camera) {
    const distance = metadata.autoAnchorDistance ?? 0.3; // 30cm default for indicators

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

export function ARStatusIndicator({
  indicator,
  index = 0,
}: ARStatusIndicatorProps) {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const isWorldSpace = isWorldSpaceIndicator(indicator.metadata);

  // Hit-testing for surface anchoring
  const needsHitTest = indicator.metadata?.autoAnchor === "surface";
  const hitTestResult = useHitTest(needsHitTest);

  // World anchor state
  const [worldAnchor, setWorldAnchor] = useState<WorldAnchor | null>(null);

  // Size calculation
  const size = indicator.size ?? 12;
  const sphereRadius = (size / 12) * DEFAULT_INDICATOR_SIZE;

  // State
  const state = indicator.state || "idle";
  const shouldPulse = indicator.pulse ?? (state === "loading");
  const showGlow = indicator.glow ?? false;

  // Get colors
  const colors = useMemo(() => {
    return STATE_COLORS[state] ?? STATE_COLORS.idle!;
  }, [state]);

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
      const anchor = getIndicatorAnchorFromMetadata(indicator.metadata, camera);
      setWorldAnchor(anchor);
    }
  }, [isWorldSpace, indicator.metadata, camera, needsHitTest, hitTestResult]);

  // Position calculation
  const position = useMemo(() => {
    if (isWorldSpace && worldAnchor) {
      return [
        worldAnchor.position.x,
        worldAnchor.position.y,
        worldAnchor.position.z,
      ] as [number, number, number];
    }

    // Screen-space positioning - use indicator-specific helper that handles "center"
    const basePos = getIndicatorARPosition(indicator.position);
    const stackOffset = index * -0.015; // 1.5cm offset per indicator
    const priorityOffset = getPriorityZOffset(2);

    return [
      basePos.x,
      basePos.y + stackOffset,
      basePos.z + priorityOffset,
    ] as [number, number, number];
  }, [indicator.position, index, isWorldSpace, worldAnchor]);

  // Main sphere material
  const mainMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: colors.main,
        transparent: true,
        opacity: 1,
      }),
    [colors.main]
  );

  // Glow material (outer transparent sphere)
  const glowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: colors.glow,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide,
      }),
    [colors.glow]
  );

  // Animation loop
  useFrame(({ camera: cam, clock }) => {
    if (!groupRef.current) return;

    // Billboard behavior
    if (isWorldSpace) {
      if (worldAnchor) {
        groupRef.current.rotation.copy(worldAnchor.rotation);
      }
    } else {
      groupRef.current.quaternion.copy(cam.quaternion);
    }

    // Pulse animation
    if (shouldPulse) {
      const pulseScale = 1 + Math.sin(clock.getElapsedTime() * 4) * 0.2;
      if (sphereRef.current) {
        sphereRef.current.scale.setScalar(pulseScale);
      }
      if (glowRef.current) {
        (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.2 + Math.sin(clock.getElapsedTime() * 4) * 0.15;
      }
    }

    // Glow animation (subtle pulse even when not pulsing)
    if (showGlow && glowRef.current && !shouldPulse) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.25 + Math.sin(clock.getElapsedTime() * 2) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Main status sphere */}
      <mesh ref={sphereRef} material={mainMaterial}>
        <sphereGeometry args={[sphereRadius, 16, 16]} />
      </mesh>

      {/* Glow effect (outer sphere) */}
      {(showGlow || shouldPulse) && (
        <mesh ref={glowRef} material={glowMaterial}>
          <sphereGeometry args={[sphereRadius * 2, 16, 16]} />
        </mesh>
      )}
    </group>
  );
}
