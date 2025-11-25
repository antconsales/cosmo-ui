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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [arSupported, setArSupported] = useState<boolean | null>(null);
  const [arActive, setArActive] = useState(false);
  const [webcamActive, setWebcamActive] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ComponentType>("hudcard");
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [componentPosition, setComponentPosition] = useState({ x: 50, y: 50 });
  const [componentScale, setComponentScale] = useState(1);

  const sessionRef = useRef<XRSession | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isDragging = useRef(false);

  // Handle mouse drag for component repositioning
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setComponentPosition({
        x: Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100)),
        y: Math.max(10, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100)),
      });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    // Check WebXR AR support with timeout
    const checkARSupport = async () => {
      // Timeout after 3 seconds if check hangs
      const timeout = setTimeout(() => {
        setArSupported(false);
      }, 3000);

      try {
        if (typeof navigator !== "undefined" && navigator.xr) {
          const supported = await navigator.xr.isSessionSupported("immersive-ar");
          clearTimeout(timeout);
          setArSupported(supported);
        } else {
          clearTimeout(timeout);
          setArSupported(false);
        }
      } catch {
        clearTimeout(timeout);
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

  const startWebcamPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setWebcamActive(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to access webcam");
    }
  };

  const stopWebcamPreview = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setWebcamActive(false);
  };

  const placeComponent = () => {
    setPlaced(true);
  };

  const handleDismiss = () => {
    // Cycle to next component
    const types = Object.keys(DEMO_COMPONENTS) as ComponentType[];
    const currentIndex = types.indexOf(selectedComponent);
    const nextIndex = (currentIndex + 1) % types.length;
    setSelectedComponent(types[nextIndex]);
    setComponentPosition({ x: 50, y: 50 }); // Reset position
  };

  const renderSelectedComponent = () => {
    const comp = DEMO_COMPONENTS[selectedComponent];
    const data = comp.data;

    switch (selectedComponent) {
      case "hudcard":
        return <HUDCard card={data as unknown as Parameters<typeof HUDCard>[0]["card"]} onDismiss={handleDismiss} />;
      case "badge":
        return <ContextBadge badge={data as unknown as Parameters<typeof ContextBadge>[0]["badge"]} onDismiss={handleDismiss} />;
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
        minHeight: "100vh",
        backgroundColor: arActive || webcamActive ? "transparent" : "#0a0a0a",
        position: "relative",
        overflow: arActive || webcamActive ? "hidden" : "auto",
      }}
    >
      {/* Header - always visible */}
      <div
        style={{
          position: arActive || webcamActive ? "absolute" : "sticky",
          top: 0,
          left: 0,
          right: 0,
          padding: "16px 24px",
          background: arActive || webcamActive ? "rgba(0,0,0,0.7)" : "#0a0a0a",
          backdropFilter: arActive || webcamActive ? "blur(10px)" : "none",
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
      {!arActive && !webcamActive && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "32px 24px 48px",
          }}
        >
          {arSupported === null && (
            <div style={{ color: "#888", fontSize: "1.1rem" }}>
              Checking WebXR AR support...
            </div>
          )}

          {arSupported === false && !webcamActive && (
            <div style={{ textAlign: "center", maxWidth: "500px" }}>
              <div style={{ fontSize: "4rem", marginBottom: "16px" }}>📹</div>
              <h2 style={{ color: "#fff", marginBottom: "8px" }}>Webcam Preview Mode</h2>
              <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "24px" }}>
                WebXR AR not available on this device. Use webcam preview instead!
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
                onClick={startWebcamPreview}
                style={{
                  padding: "16px 48px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "#fff",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(16, 185, 129, 0.4)",
                }}
              >
                📹 Start Webcam Preview
              </button>

              <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#1a1a1a", borderRadius: "8px" }}>
                <p style={{ color: "#666", fontSize: "0.8rem", margin: 0 }}>
                  💡 For full AR: open on Chrome Android or Safari iOS
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
      )}

      {/* AR Mode UI - only when AR is active */}
      {arActive && (
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

      {/* Webcam Preview Mode */}
      {webcamActive && (
        <>
          {/* Video feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 1,
            }}
          />

          {/* Component overlay */}
          <div
            style={{
              position: "absolute",
              left: `${componentPosition.x}%`,
              top: `${componentPosition.y}%`,
              transform: `translate(-50%, -50%) scale(${componentScale})`,
              zIndex: 10,
              cursor: "grab",
              userSelect: "none",
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              isDragging.current = true;
            }}
          >
            {renderSelectedComponent()}
          </div>

          {/* Controls */}
          <div
            style={{
              position: "absolute",
              bottom: "24px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "12px",
              alignItems: "center",
              zIndex: 20,
              backgroundColor: "rgba(0,0,0,0.7)",
              padding: "16px 24px",
              borderRadius: "16px",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Component selector */}
            <select
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value as ComponentType)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #333",
                backgroundColor: "#1a1a1a",
                color: "#fff",
                fontSize: "0.85rem",
              }}
            >
              {(Object.keys(DEMO_COMPONENTS) as ComponentType[]).map((type) => (
                <option key={type} value={type}>
                  {DEMO_COMPONENTS[type].emoji} {DEMO_COMPONENTS[type].name}
                </option>
              ))}
            </select>

            {/* Scale controls */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                onClick={() => setComponentScale((s) => Math.max(0.5, s - 0.1))}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  border: "1px solid #333",
                  backgroundColor: "#1a1a1a",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                }}
              >
                -
              </button>
              <span style={{ color: "#888", fontSize: "0.8rem", minWidth: "40px", textAlign: "center" }}>
                {Math.round(componentScale * 100)}%
              </span>
              <button
                onClick={() => setComponentScale((s) => Math.min(2, s + 0.1))}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  border: "1px solid #333",
                  backgroundColor: "#1a1a1a",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                }}
              >
                +
              </button>
            </div>

            {/* Exit button */}
            <button
              onClick={stopWebcamPreview}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #ef4444",
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                color: "#ef4444",
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              Exit
            </button>
          </div>

          {/* Drag hint */}
          <div
            style={{
              position: "absolute",
              top: "100px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "#fff",
              fontSize: "0.85rem",
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: "8px 16px",
              borderRadius: "8px",
              zIndex: 20,
            }}
          >
            Drag component to reposition
          </div>
        </>
      )}
    </div>
  );
}
