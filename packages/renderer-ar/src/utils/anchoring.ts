import * as THREE from "three";
import type { HUDCardMetadata } from "@cosmo/core-schema";

/**
 * World-space anchoring utilities for AR
 * Handles fixed transforms and auto-anchor modes
 */

export interface WorldAnchor {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  isWorldSpace: boolean;
}

/**
 * Get anchor from metadata
 * Returns world-space position/rotation or null for screen-space
 */
export function getAnchorFromMetadata(
  metadata?: HUDCardMetadata,
  camera?: THREE.Camera
): WorldAnchor | null {
  if (!metadata || metadata.anchorType !== "world-space") {
    return null; // Screen-space card
  }

  const position = new THREE.Vector3();
  const rotation = new THREE.Euler();

  // Auto-anchor modes (require camera)
  if (metadata.autoAnchor && camera) {
    const distance = metadata.autoAnchorDistance ?? 0.5;

    switch (metadata.autoAnchor) {
      case "face":
        return getAutoAnchorFace(camera, distance);

      case "gaze":
        return getAutoAnchorGaze(camera, distance);

      case "surface":
        // Surface anchoring requires hit-testing, handled separately
        return getAutoAnchorFace(camera, distance); // Fallback to face
    }
  }

  // Explicit world position
  if (metadata.worldPosition) {
    position.set(
      metadata.worldPosition[0],
      metadata.worldPosition[1],
      metadata.worldPosition[2]
    );
  }

  // Explicit world rotation
  if (metadata.worldRotation) {
    rotation.set(
      metadata.worldRotation[0],
      metadata.worldRotation[1],
      metadata.worldRotation[2]
    );
  }

  return {
    position,
    rotation,
    isWorldSpace: true,
  };
}

/**
 * Auto-anchor: Face mode
 * Position card in front of user's face at spawn time
 */
function getAutoAnchorFace(camera: THREE.Camera, distance: number): WorldAnchor {
  const position = new THREE.Vector3();
  const rotation = new THREE.Euler();

  // Get camera forward direction
  const forward = new THREE.Vector3(0, 0, -1);
  forward.applyQuaternion(camera.quaternion);

  // Position at distance in front of camera
  position.copy(camera.position).add(forward.multiplyScalar(distance));

  // Face the camera
  const lookAt = camera.position.clone();
  const direction = new THREE.Vector3().subVectors(lookAt, position).normalize();
  rotation.setFromVector3(direction);

  return {
    position,
    rotation,
    isWorldSpace: true,
  };
}

/**
 * Auto-anchor: Gaze mode
 * Position card where user is looking (center of view)
 */
function getAutoAnchorGaze(camera: THREE.Camera, distance: number): WorldAnchor {
  const position = new THREE.Vector3();
  const rotation = new THREE.Euler();

  // Raycast from camera center
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

  // Position along ray at distance
  position.copy(raycaster.ray.origin).add(
    raycaster.ray.direction.clone().multiplyScalar(distance)
  );

  // Face the camera
  rotation.setFromQuaternion(camera.quaternion);

  return {
    position,
    rotation,
    isWorldSpace: true,
  };
}

/**
 * Check if card should use world-space anchoring
 */
export function isWorldSpaceCard(metadata?: HUDCardMetadata): boolean {
  return metadata?.anchorType === "world-space";
}

/**
 * Get default anchor distance
 */
export function getDefaultAnchorDistance(): number {
  return 0.5; // 50cm
}

/**
 * Convert Euler rotation to quaternion for Three.js
 */
export function eulerToQuaternion(euler: THREE.Euler): THREE.Quaternion {
  return new THREE.Quaternion().setFromEuler(euler);
}
