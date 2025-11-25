"use client";

import { Canvas } from "@react-three/fiber";
import { createXRStore, XR } from "@react-three/xr";
import { useState } from "react";
import { ARHUDCardManager, useHUDCardManager } from "@cosmo/renderer-ar";
import type { HUDCard } from "@cosmo/core-schema";

// Create XR store for AR mode
const xrStore = createXRStore({
  depthSensing: true,
});

/**
 * Demo cards for AR testing
 */
const DEMO_CARDS: Record<string, HUDCard> = {
  welcome: {
    id: "welcome",
    title: "Welcome to Cosmo UI AR",
    content: "AI-first AR UI framework. Cards rendered in 3D space!",
    variant: "info",
    priority: 3,
    position: "top-right",
    icon: "info",
    dismissible: true,
  },

  notification: {
    id: "notification",
    title: "New Message",
    content: "You have 3 unread messages.",
    variant: "neutral",
    priority: 2,
    position: "top-left",
    icon: "bell",
    dismissible: true,
    autoHideAfterSeconds: 5,
  },

  warning: {
    id: "warning",
    title: "Low Battery",
    content: "Device battery at 15%.",
    variant: "warning",
    priority: 4,
    position: "top-center",
    icon: "alert",
    dismissible: false,
  },

  error: {
    id: "error",
    title: "Connection Error",
    content: "Failed to connect to server.",
    variant: "error",
    priority: 5,
    position: "top-center",
    icon: "error",
    dismissible: false,
  },
};

/**
 * AR Scene with HUD cards
 */
function ARScene() {
  const { addCard, clearAll } = useHUDCardManager();

  return (
    <>
      {/* Ambient light for better visibility */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Cards are rendered by ARHUDCardManager */}
      {/* They appear as 3D billboards in front of the camera */}
    </>
  );
}

/**
 * Control panel for testing (visible before entering AR)
 */
function ControlPanel() {
  const { addCard, clearAll, cards } = useHUDCardManager();

  const handleAddCard = (cardKey: string) => {
    const card = DEMO_CARDS[cardKey];
    if (card) {
      addCard(card);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: "20px",
        borderRadius: "8px",
        color: "white",
        zIndex: 1000,
        maxWidth: "90vw",
        width: "600px",
      }}
    >
      <h3 style={{ margin: "0 0 12px 0" }}>AR HUD Demo Controls</h3>
      <p style={{ fontSize: "14px", margin: "0 0 16px 0", opacity: 0.8 }}>
        Active cards: {cards.size} / 5
      </p>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button
          onClick={() => handleAddCard("welcome")}
          style={buttonStyle}
        >
          Add Welcome
        </button>
        <button
          onClick={() => handleAddCard("notification")}
          style={buttonStyle}
        >
          Add Notification
        </button>
        <button
          onClick={() => handleAddCard("warning")}
          style={{ ...buttonStyle, backgroundColor: "#f59e0b" }}
        >
          Add Warning
        </button>
        <button
          onClick={() => handleAddCard("error")}
          style={{ ...buttonStyle, backgroundColor: "#ef4444" }}
        >
          Add Error
        </button>
        <button
          onClick={clearAll}
          style={{ ...buttonStyle, backgroundColor: "#dc2626" }}
        >
          Clear All
        </button>
      </div>

      <p
        style={{
          fontSize: "12px",
          margin: "16px 0 0 0",
          opacity: 0.6,
          fontStyle: "italic",
        }}
      >
        💡 Click "Enter AR" button below to view cards in AR mode
      </p>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: "8px 16px",
  backgroundColor: "#3b82f6",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 500,
};

export default function HomePage() {
  const [supported, setSupported] = useState<boolean | null>(null);

  // Check WebXR support on mount
  if (typeof window !== "undefined" && supported === null) {
    if (navigator.xr) {
      navigator.xr
        .isSessionSupported("immersive-ar")
        .then((isSupported) => setSupported(isSupported))
        .catch(() => setSupported(false));
    } else {
      setSupported(false);
    }
  }

  return (
    <main style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* AR Canvas */}
      <Canvas>
        <XR store={xrStore}>
          <ARHUDCardManager>
            <ARScene />
            <ControlPanel />
          </ARHUDCardManager>
        </XR>
      </Canvas>

      {/* Info overlay */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          zIndex: 1000,
        }}
      >
        <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "white", margin: 0 }}>
          Cosmo UI - AR Demo
        </h1>
        <p style={{ fontSize: "16px", color: "white", margin: "8px 0 0 0", opacity: 0.8 }}>
          AI-first cross-reality UI framework
        </p>
        {supported === false && (
          <p
            style={{
              fontSize: "14px",
              color: "#ef4444",
              margin: "12px 0 0 0",
              backgroundColor: "rgba(0,0,0,0.8)",
              padding: "8px 16px",
              borderRadius: "6px",
            }}
          >
            ⚠️ WebXR AR not supported on this device
          </p>
        )}
      </div>

      {/* AR Button */}
      {supported && (
        <button
          onClick={() => xrStore.enterAR()}
          style={{
            position: "absolute",
            bottom: "100px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1001,
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Enter AR
        </button>
      )}
    </main>
  );
}
