import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { ProgressRing, ProgressRingMetadata, ProgressRingPosition, HUDCardPosition } from "@cosmo/core-schema";
import {
  getARPosition,
  getPriorityZOffset,
  type ARPosition,
} from "../utils/positioning";
import {
  getVariantColors,
} from "../utils/styling";
import {
  type WorldAnchor,
} from "../utils/anchoring";
import { useHitTest } from "../hooks/useHitTest";

/**
 * Get AR position for ProgressRing, handling "center" position specially
 */
function getRingARPosition(position?: ProgressRingPosition): ARPosition {
  if (position === "center") {
    return { x: 0, y: 0, z: -0.5 }; // Center of view, 50cm away
  }
  return getARPosition(position as HUDCardPosition);
}

/**
 * ARProgressRing - 3D Progress Ring for AR environments
 *
 * Circular progress indicator using torus geometry
 * Supports screen-space (billboard) and world-space anchoring
 */

export interface ARProgressRingProps {
  ring: ProgressRing;
  index?: number;
  onDismiss?: (id: string) => void;
}

// Ring dimensions in meters
const DEFAULT_RING_SIZE = 0.06; // 6cm diameter
const DEFAULT_RING_THICKNESS = 0.006; // 6mm tube thickness

/**
 * Check if ring is world-space
 */
function isWorldSpaceRing(metadata?: ProgressRingMetadata): boolean {
  return metadata?.anchorType === "world-space";
}

/**
 * Get ring anchor from metadata
 */
function getRingAnchorFromMetadata(
  metadata?: ProgressRingMetadata,
  camera?: THREE.Camera
): WorldAnchor | null {
  if (!metadata || metadata.anchorType !== "world-space") {
    return null;
  }

  const position = new THREE.Vector3();
  const rotation = new THREE.Euler();

  // Auto-anchor modes
  if (metadata.autoAnchor && camera) {
    const distance = metadata.autoAnchorDistance ?? 0.4; // 40cm default for rings

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

/**
 * Create partial torus geometry for progress arc
 */
function createProgressGeometry(
  radius: number,
  tubeRadius: number,
  progress: number
): THREE.BufferGeometry {
  const arc = (progress / 100) * Math.PI * 2;
  const segments = Math.max(8, Math.floor(48 * (progress / 100)));

  if (progress <= 0) {
    return new THREE.BufferGeometry();
  }

  return new THREE.TorusGeometry(radius, tubeRadius, 8, segments, arc);
}

export function ARProgressRing({
  ring,
  index = 0,
}: ARProgressRingProps) {
  const groupRef = useRef<THREE.Group>(null);
  const progressMeshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const isWorldSpace = isWorldSpaceRing(ring.metadata);

  // Animated value state
  const [displayedValue, setDisplayedValue] = useState(ring.value);
  const targetValueRef = useRef(ring.value);

  // Hit-testing for surface anchoring
  const needsHitTest = ring.metadata?.autoAnchor === "surface";
  const hitTestResult = useHitTest(needsHitTest);

  // World anchor state
  const [worldAnchor, setWorldAnchor] = useState<WorldAnchor | null>(null);

  // Size calculations
  const size = ring.size ?? 48;
  const thickness = ring.thickness ?? 6;
  const ringRadius = (size / 48) * DEFAULT_RING_SIZE / 2;
  const tubeRadius = (thickness / 6) * DEFAULT_RING_THICKNESS / 2;

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
      const anchor = getRingAnchorFromMetadata(ring.metadata, camera);
      setWorldAnchor(anchor);
    }
  }, [isWorldSpace, ring.metadata, camera, needsHitTest, hitTestResult]);

  // Position calculation
  const position = useMemo(() => {
    if (isWorldSpace && worldAnchor) {
      return [
        worldAnchor.position.x,
        worldAnchor.position.y,
        worldAnchor.position.z,
      ] as [number, number, number];
    }

    // Screen-space positioning - use ring-specific helper that handles "center"
    const basePos = getRingARPosition(ring.position);
    const stackOffset = index * -0.02; // 2cm offset per ring
    const priorityOffset = getPriorityZOffset(3);

    return [
      basePos.x,
      basePos.y + stackOffset,
      basePos.z + priorityOffset,
    ] as [number, number, number];
  }, [ring.position, index, isWorldSpace, worldAnchor]);

  // Get colors
  const colors = useMemo(() => {
    return getVariantColors(ring.variant ?? "neutral");
  }, [ring.variant]);

  // Track material
  const trackMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: colors.background.clone().multiplyScalar(0.5),
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [colors.background]
  );

  // Progress material
  const progressMaterial = useMemo(
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

  // Track geometry (full circle)
  const trackGeometry = useMemo(
    () => new THREE.TorusGeometry(ringRadius, tubeRadius, 8, 48),
    [ringRadius, tubeRadius]
  );

  // Update target value when prop changes
  useEffect(() => {
    targetValueRef.current = ring.value;
  }, [ring.value]);

  // Animation loop
  useFrame(({ camera: cam }) => {
    if (!groupRef.current) return;

    // Billboard behavior
    if (isWorldSpace) {
      if (worldAnchor) {
        groupRef.current.rotation.copy(worldAnchor.rotation);
      }
    } else {
      groupRef.current.quaternion.copy(cam.quaternion);
    }

    // Animate value
    if (ring.animated !== false) {
      const diff = targetValueRef.current - displayedValue;
      if (Math.abs(diff) > 0.1) {
        const newValue = displayedValue + diff * 0.1;
        setDisplayedValue(newValue);
      } else if (Math.abs(diff) > 0) {
        setDisplayedValue(targetValueRef.current);
      }
    } else {
      setDisplayedValue(targetValueRef.current);
    }

    // Update progress geometry
    if (progressMeshRef.current) {
      const clampedValue = Math.max(0, Math.min(100, displayedValue));
      progressMeshRef.current.geometry.dispose();
      progressMeshRef.current.geometry = createProgressGeometry(
        ringRadius,
        tubeRadius,
        clampedValue
      );
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
      {/* Track (background ring) */}
      <mesh geometry={trackGeometry} material={trackMaterial} />

      {/* Progress arc */}
      <mesh ref={progressMeshRef} material={progressMaterial}>
        <torusGeometry args={[ringRadius, tubeRadius, 8, 48, (displayedValue / 100) * Math.PI * 2]} />
      </mesh>

      {/* Center indicator dot */}
      {ring.showValue && (
        <mesh position={[0, 0, 0.001]}>
          <circleGeometry args={[tubeRadius * 0.8, 16]} />
          <meshBasicMaterial
            color={colors.text}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
