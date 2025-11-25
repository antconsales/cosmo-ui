"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  HUDCard,
  ContextBadge,
  ProgressRing,
  StatusIndicator,
  MiniPlayer,
  Timer,
  WeatherWidget,
  QuickSettings,
  ActivityRing,
} from "@cosmo/renderer-web";

type ComponentType = "hudcard" | "badge" | "ring" | "status" | "miniplayer" | "timer" | "weather" | "settings" | "activity";

const DEMO_COMPONENTS: Record<ComponentType, { name: string; emoji: string; data: Record<string, unknown> }> = {
  hudcard: {
    name: "HUDCard",
    emoji: "📋",
    data: {
      id: "ar-hud",
      title: "AR Mode Active",
      message: "Component placed in your space!",
      type: "info",
      variant: "glass",
    },
  },
  badge: {
    name: "ContextBadge",
    emoji: "🏷️",
    data: {
      id: "ar-badge",
      label: "AR Preview",
      type: "status",
      status: "online",
      variant: "glass",
    },
  },
  ring: {
    name: "ProgressRing",
    emoji: "⭕",
    data: {
      id: "ar-ring",
      value: 75,
      max: 100,
      size: "large",
      variant: "gradient",
      label: "Progress",
    },
  },
  status: {
    name: "StatusIndicator",
    emoji: "🔴",
    data: {
      id: "ar-status",
      status: "online",
      label: "AR Active",
      variant: "default",
    },
  },
  miniplayer: {
    name: "MiniPlayer",
    emoji: "🎵",
    data: {
      id: "ar-player",
      state: "playing",
      track: {
        title: "Spatial Audio",
        artist: "COSMO UI",
        album: "AR Experience",
      },
      progress: {
        current: 120,
        duration: 300,
      },
      variant: "glass",
    },
  },
  timer: {
    name: "Timer",
    emoji: "⏱️",
    data: {
      id: "ar-timer",
      mode: "countdown",
      initialSeconds: 300,
      currentSeconds: 245,
      state: "running",
      variant: "glass",
    },
  },
  weather: {
    name: "WeatherWidget",
    emoji: "🌤️",
    data: {
      id: "ar-weather",
      location: "Your Location",
      temperature: 22,
      unit: "celsius",
      condition: "partly-cloudy",
      humidity: 65,
      variant: "glass",
      size: "medium",
    },
  },
  settings: {
    name: "QuickSettings",
    emoji: "⚙️",
    data: {
      id: "ar-settings",
      items: [
        { id: "wifi", type: "wifi", enabled: true },
        { id: "bt", type: "bluetooth", enabled: false },
        { id: "loc", type: "location", enabled: true },
        { id: "dnd", type: "dnd", enabled: false },
      ],
      layout: "grid",
      columns: 2,
      variant: "glass",
    },
  },
  activity: {
    name: "ActivityRing",
    emoji: "⭕",
    data: {
      id: "ar-activity",
      rings: [
        { id: "move", label: "Move", value: 450, goal: 500, color: "red" },
        { id: "exercise", label: "Exercise", value: 25, goal: 30, color: "green" },
        { id: "stand", label: "Stand", value: 10, goal: 12, color: "blue" },
      ],
      variant: "default",
      size: "large",
    },
  },
};

export default function ARPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [arSupported, setArSupported] = useState<boolean | null>(null);
  const [arActive, setArActive] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ComponentType>("hudcard");
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionRef = useRef<XRSession | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    // Check WebXR AR support
    const checkARSupport = async () => {
      if (navigator.xr) {
        try {
          const supported = await navigator.xr.isSessionSupported("immersive-ar");
          setArSupported(supported);
        } catch {
          setArSupported(false);
        }
      } else {
        setArSupported(false);
      }
    };
    checkARSupport();
  }, []);

  const startAR = async () => {
    if (!navigator.xr) {
      setError("WebXR not supported");
      return;
    }

    try {
      const session = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test", "dom-overlay"],
        domOverlay: { root: containerRef.current! },
      } as XRSessionInit);

      sessionRef.current = session;
      setArActive(true);
      setPlaced(false);

      // Create Three.js renderer
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      renderer.xr.setReferenceSpaceType("local");
      rendererRef.current = renderer;

      // Create scene and camera
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

      // Add ambient light
      const light = new THREE.AmbientLight(0xffffff, 1);
      scene.add(light);

      // Set XR session
      await renderer.xr.setSession(session);

      // Get reference space
      const referenceSpace = await session.requestReferenceSpace("local");

      // Request hit test source
      let hitTestSource: XRHitTestSource | null | undefined = null;
      if (session.requestHitTestSource) {
        const viewerSpace = await session.requestReferenceSpace("viewer");
        hitTestSource = await session.requestHitTestSource({ space: viewerSpace });
      }

      // Reticle for placement
      const reticleGeometry = new THREE.RingGeometry(0.05, 0.06, 32);
      reticleGeometry.rotateX(-Math.PI / 2);
      const reticleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
      reticle.visible = false;
      scene.add(reticle);

      // Animation loop
      renderer.setAnimationLoop((timestamp, frame) => {
        if (frame && hitTestSource) {
          const hitTestResults = frame.getHitTestResults?.(hitTestSource);
          if (hitTestResults && hitTestResults.length > 0) {
            const hit = hitTestResults[0];
            const pose = hit.getPose(referenceSpace);
            if (pose) {
              reticle.visible = true;
              reticle.position.set(
                pose.transform.position.x,
                pose.transform.position.y,
                pose.transform.position.z
              );
            }
          } else {
            reticle.visible = false;
          }
        }
        renderer.render(scene, camera);
      });

      // Handle session end
      session.addEventListener("end", () => {
        setArActive(false);
        setPlaced(false);
        sessionRef.current = null;
        if (hitTestSource) hitTestSource.cancel();
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start AR");
      setArActive(false);
    }
  };

  const stopAR = async () => {
    if (sessionRef.current) {
      await sessionRef.current.end();
    }
  };

  const placeComponent = () => {
    setPlaced(true);
  };

  const renderSelectedComponent = () => {
    const comp = DEMO_COMPONENTS[selectedComponent];
    const data = comp.data;

    switch (selectedComponent) {
      case "hudcard":
        return <HUDCard card={data as unknown as Parameters<typeof HUDCard>[0]["card"]} />;
      case "badge":
        return <ContextBadge badge={data as unknown as Parameters<typeof ContextBadge>[0]["badge"]} />;
      case "ring":
        return <ProgressRing ring={data as unknown as Parameters<typeof ProgressRing>[0]["ring"]} />;
      case "status":
        return <StatusIndicator indicator={data as unknown as Parameters<typeof StatusIndicator>[0]["indicator"]} />;
      case "miniplayer":
        return <MiniPlayer player={data as unknown as Parameters<typeof MiniPlayer>[0]["player"]} />;
      case "timer":
        return <Timer timer={data as unknown as Parameters<typeof Timer>[0]["timer"]} />;
      case "weather":
        return <WeatherWidget weather={data as unknown as Parameters<typeof WeatherWidget>[0]["weather"]} />;
      case "settings":
        return <QuickSettings settings={data as unknown as Parameters<typeof QuickSettings>[0]["settings"]} />;
      case "activity":
        return <ActivityRing ring={data as unknown as Parameters<typeof ActivityRing>[0]["ring"]} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: arActive ? "transparent" : "#0a0a0a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header - always visible */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "16px 24px",
          background: arActive ? "rgba(0,0,0,0.5)" : "transparent",
          backdropFilter: arActive ? "blur(10px)" : "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 100,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "1.2rem", color: "#fff" }}>
            🥽 COSMO UI AR
          </h1>
          <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#888" }}>
            WebXR Augmented Reality
          </p>
        </div>
        <a
          href="/"
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            backgroundColor: "#333",
            color: "#fff",
            textDecoration: "none",
            fontSize: "0.85rem",
          }}
        >
          ← Back to Demo
        </a>
      </div>

      {/* Main content */}
      {!arActive ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: "100px 24px 24px",
          }}
        >
          {arSupported === null && (
            <div style={{ color: "#888", fontSize: "1.1rem" }}>
              Checking WebXR AR support...
            </div>
          )}

          {arSupported === false && (
            <div style={{ textAlign: "center", maxWidth: "400px" }}>
              <div style={{ fontSize: "4rem", marginBottom: "16px" }}>😔</div>
              <h2 style={{ color: "#fff", marginBottom: "8px" }}>AR Not Supported</h2>
              <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "24px" }}>
                WebXR AR requires a compatible device and browser:
              </p>
              <ul style={{ color: "#666", fontSize: "0.85rem", textAlign: "left", lineHeight: 1.8 }}>
                <li>Chrome on Android (ARCore devices)</li>
                <li>Safari on iOS 15+ (limited support)</li>
                <li>HTTPS connection required</li>
              </ul>
              <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#1a1a1a", borderRadius: "8px" }}>
                <p style={{ color: "#888", fontSize: "0.8rem", margin: 0 }}>
                  💡 Try opening this page on your phone with Chrome
                </p>
              </div>
            </div>
          )}

          {arSupported === true && (
            <div style={{ textAlign: "center", maxWidth: "500px" }}>
              <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🥽</div>
              <h2 style={{ color: "#fff", marginBottom: "8px" }}>AR Ready!</h2>
              <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "32px" }}>
                Select a component and tap Start AR to place it in your space
              </p>

              {/* Component selector */}
              <div style={{ marginBottom: "32px" }}>
                <label style={{ color: "#888", fontSize: "0.8rem", display: "block", marginBottom: "12px" }}>
                  Choose Component
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                  {(Object.keys(DEMO_COMPONENTS) as ComponentType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedComponent(type)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "8px",
                        border: selectedComponent === type ? "2px solid #6366f1" : "1px solid #333",
                        backgroundColor: selectedComponent === type ? "#1e1b4b" : "#1a1a1a",
                        color: selectedComponent === type ? "#a5b4fc" : "#888",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                      }}
                    >
                      {DEMO_COMPONENTS[type].emoji} {DEMO_COMPONENTS[type].name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div
                style={{
                  backgroundColor: "#1a1a1a",
                  borderRadius: "12px",
                  padding: "24px",
                  marginBottom: "32px",
                }}
              >
                <p style={{ color: "#666", fontSize: "0.8rem", marginBottom: "16px" }}>Preview</p>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {renderSelectedComponent()}
                </div>
              </div>

              <button
                onClick={startAR}
                style={{
                  padding: "16px 48px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(99, 102, 241, 0.4)",
                }}
              >
                🚀 Start AR Experience
              </button>
            </div>
          )}

          {error && (
            <div
              style={{
                marginTop: "24px",
                padding: "16px 24px",
                backgroundColor: "#7f1d1d",
                borderRadius: "8px",
                color: "#fca5a5",
                fontSize: "0.9rem",
              }}
            >
              ❌ {error}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* AR Overlay UI */}
          <div
            style={{
              position: "absolute",
              bottom: "100px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 100,
            }}
          >
            {!placed ? (
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#fff", fontSize: "0.9rem", marginBottom: "16px", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                  Point at a surface and tap to place
                </p>
                <button
                  onClick={placeComponent}
                  style={{
                    padding: "16px 48px",
                    borderRadius: "50px",
                    border: "none",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "#fff",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(16, 185, 129, 0.4)",
                  }}
                >
                  📍 Place Component
                </button>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#10b981", fontSize: "0.9rem", marginBottom: "8px" }}>
                  ✓ Component placed!
                </p>
              </div>
            )}
          </div>

          {/* Placed component overlay */}
          {placed && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 50,
              }}
            >
              {renderSelectedComponent()}
            </div>
          )}

          {/* Exit button */}
          <div
            style={{
              position: "absolute",
              bottom: "24px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 100,
            }}
          >
            <button
              onClick={stopAR}
              style={{
                padding: "12px 32px",
                borderRadius: "8px",
                border: "1px solid #ef4444",
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                color: "#ef4444",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              Exit AR
            </button>
          </div>
        </>
      )}
    </div>
  );
}
