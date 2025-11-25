import { useEffect, useState } from "react";
import { useXR } from "@react-three/xr";
import * as THREE from "three";

/**
 * Hook for WebXR hit-testing (surface detection)
 * Returns the latest hit-test result position
 */

export interface HitTestResult {
  position: THREE.Vector3;
  rotation: THREE.Quaternion;
  timestamp: number;
}

export function useHitTest(enabled: boolean = false): HitTestResult | null {
  const { session } = useXR();
  const [hitResult, setHitResult] = useState<HitTestResult | null>(null);

  useEffect(() => {
    if (!enabled || !session) return;

    let hitTestSource: XRHitTestSource | null = null;
    let rafId: number | null = null;
    let refSpace: XRReferenceSpace | null = null;

    // Request hit-test source
    const requestHitTestSource = async () => {
      if (!session.requestHitTestSource) {
        console.warn("Hit-testing not supported in this session");
        return;
      }

      try {
        const viewerSpace = await session.requestReferenceSpace("viewer");
        refSpace = await session.requestReferenceSpace("local");
        const source = await session.requestHitTestSource({
          space: viewerSpace,
        });
        hitTestSource = source ?? null;
      } catch (error) {
        console.error("Failed to request hit-test source:", error);
      }
    };

    requestHitTestSource();

    // Update hit-test results every frame
    const handleFrame = (time: number, frame: XRFrame | undefined) => {
      if (!hitTestSource || !frame || !refSpace) return;

      const hitTestResults = frame.getHitTestResults(hitTestSource);

      if (hitTestResults && hitTestResults.length > 0) {
        const hit = hitTestResults[0];
        if (!hit) return;

        const pose = hit.getPose(refSpace);

        if (pose) {
          const position = new THREE.Vector3(
            pose.transform.position.x,
            pose.transform.position.y,
            pose.transform.position.z
          );

          const rotation = new THREE.Quaternion(
            pose.transform.orientation.x,
            pose.transform.orientation.y,
            pose.transform.orientation.z,
            pose.transform.orientation.w
          );

          setHitResult({
            position,
            rotation,
            timestamp: time,
          });
        }
      }
    };

    // Register animation frame callback
    rafId = session.requestAnimationFrame(handleFrame);

    return () => {
      if (rafId !== null) {
        session.cancelAnimationFrame(rafId);
      }
      if (hitTestSource) {
        hitTestSource.cancel();
      }
    };
  }, [enabled, session]);

  return hitResult;
}

/**
 * Hook for one-time hit-test (e.g., place on tap)
 * Returns a function that performs hit-test at current gaze/pointer
 */
export function useHitTestOnce() {
  const { session } = useXR();

  const performHitTest = async (): Promise<HitTestResult | null> => {
    if (!session || !session.requestHitTestSource) {
      return null;
    }

    try {
      // Request hit-test source
      const viewerSpace = await session.requestReferenceSpace("viewer");
      const refSpace = await session.requestReferenceSpace("local");
      const source = await session.requestHitTestSource({
        space: viewerSpace,
      });

      if (!source) return null;

      return new Promise((resolve) => {
        const checkHit = (time: number, frame: XRFrame | undefined) => {
          if (!frame || !source) {
            resolve(null);
            return;
          }

          const hitTestResults = frame.getHitTestResults(source);

          if (hitTestResults && hitTestResults.length > 0) {
            const hit = hitTestResults[0];
            if (!hit) {
              resolve(null);
              return;
            }

            const pose = hit.getPose(refSpace);

            if (pose) {
              const position = new THREE.Vector3(
                pose.transform.position.x,
                pose.transform.position.y,
                pose.transform.position.z
              );

              const rotation = new THREE.Quaternion(
                pose.transform.orientation.x,
                pose.transform.orientation.y,
                pose.transform.orientation.z,
                pose.transform.orientation.w
              );

              source.cancel();
              resolve({
                position,
                rotation,
                timestamp: time,
              });
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        };

        session.requestAnimationFrame(checkHit);
      });
    } catch (error) {
      console.error("Hit-test failed:", error);
      return null;
    }
  };

  return performHitTest;
}
