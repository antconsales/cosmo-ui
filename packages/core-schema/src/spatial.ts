/**
 * Cosmo UI Spatial Intent System v1.0
 *
 * Revolutionary approach to UI positioning: instead of explicit coordinates,
 * AI declares the INTENT of where UI should appear, and the system
 * determines optimal placement based on context, device, and user state.
 */

// ============================================================================
// SPATIAL INTENT
// ============================================================================

/**
 * Semantic spatial intents - AI declares WHAT the UI wants to achieve,
 * not WHERE it should be placed.
 */
export type SpatialIntent =
  | "attention"      // Demands immediate attention - front and center
  | "peripheral"     // Glanceable - edge of vision, non-intrusive
  | "ambient"        // Background info - lowest visual priority
  | "contextual"     // Near the relevant object/surface in AR
  | "anchored"       // Fixed to a specific real-world position
  | "following"      // Follows user's gaze with smooth lag
  | "docked"         // Attached to screen edge (like a toolbar)
  | "floating"       // Free-floating, user can reposition
  | "immersive";     // Full-screen takeover (use sparingly)

/**
 * Urgency level affects how aggressively the UI demands attention
 */
export type UrgencyLevel =
  | "passive"    // Can be ignored indefinitely
  | "low"        // Should be noticed eventually
  | "medium"     // Should be noticed soon
  | "high"       // Needs attention now
  | "critical";  // Cannot be ignored

/**
 * Spatial zone preferences for 2D screens
 */
export type SpatialZone =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "center"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

/**
 * AR-specific spatial preferences
 */
export type ARSpatialPreference =
  | "head-locked"      // Moves with head (HUD-style)
  | "world-locked"     // Fixed in world space
  | "body-locked"      // Moves with body, not head
  | "gaze-directed"    // Appears where user looks
  | "surface-attached" // Attached to detected surface
  | "object-attached"; // Attached to tracked object

/**
 * Complete spatial configuration
 */
export interface SpatialConfig {
  // Primary intent (required)
  intent: SpatialIntent;

  // Urgency affects animation, sound, haptics
  urgency?: UrgencyLevel;

  // Preferred zone (system uses as hint, may override)
  preferredZone?: SpatialZone;

  // AR-specific preference
  arPreference?: ARSpatialPreference;

  // Distance from user (AR only, in meters)
  preferredDistance?: number;

  // Scale factor (1.0 = default)
  scale?: number;

  // Persist across sessions?
  persistent?: boolean;

  // Allow user to reposition?
  userMovable?: boolean;

  // Stack order (higher = on top)
  layer?: number;

  // Collision behavior
  collision?: "avoid" | "stack" | "replace" | "overlap";

  // Animation entrance
  entrance?: "fade" | "slide" | "scale" | "spring" | "none";

  // Animation exit
  exit?: "fade" | "slide" | "scale" | "collapse" | "none";
}

// ============================================================================
// SPATIAL CONTEXT (Runtime information)
// ============================================================================

/**
 * Information about the current viewing environment
 */
export interface ViewingContext {
  // Device type
  device: "desktop" | "mobile" | "tablet" | "ar-glasses" | "vr-headset";

  // Screen dimensions (2D) or field of view (AR/VR)
  viewport: {
    width: number;
    height: number;
    fov?: number;          // Field of view in degrees
    aspectRatio: number;
  };

  // Current orientation
  orientation: "portrait" | "landscape";

  // Pixel density
  pixelRatio: number;

  // AR-specific
  ar?: {
    isARSession: boolean;
    hasDepthSensing: boolean;
    hasSurfaceDetection: boolean;
    hasHandTracking: boolean;
    hasEyeTracking: boolean;
    lightEstimate?: {
      ambientIntensity: number;
      ambientColorTemperature: number;
    };
  };
}

/**
 * User's current state
 */
export interface UserContext {
  // Activity level (affects UI complexity)
  activity: "stationary" | "walking" | "running" | "driving" | "cycling";

  // Attention state (from eye tracking or inference)
  attention?: "focused" | "distracted" | "idle";

  // Current cognitive load estimate
  cognitiveLoad?: "low" | "medium" | "high";

  // Ambient environment
  environment?: "indoor" | "outdoor" | "transit" | "unknown";

  // Lighting conditions
  lighting?: "bright" | "dim" | "dark";

  // Noise level (affects audio feedback)
  noiseLevel?: "quiet" | "moderate" | "loud";

  // User preferences
  preferences?: {
    reducedMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
    voiceFeedback: boolean;
  };
}

// ============================================================================
// SPATIAL ANCHOR (Computed position)
// ============================================================================

/**
 * Computed 3D position in world or screen space
 */
export interface SpatialAnchor {
  // Position type
  space: "screen" | "world";

  // 2D position (screen space) - normalized 0-1
  screen?: {
    x: number;  // 0 = left, 1 = right
    y: number;  // 0 = top, 1 = bottom
  };

  // 3D position (world space) - meters
  world?: {
    x: number;
    y: number;
    z: number;
  };

  // Rotation (world space) - euler angles in radians
  rotation?: {
    x: number;
    y: number;
    z: number;
  };

  // Scale multiplier
  scale: number;

  // Computed z-index for screen space
  zIndex?: number;

  // Distance from camera (world space)
  distance?: number;

  // Whether position was user-modified
  userModified: boolean;

  // Original spatial config that generated this anchor
  source: SpatialConfig;
}

// ============================================================================
// SPATIAL RESOLVER (Computes actual positions)
// ============================================================================

/**
 * Default distances for different intents (in meters for AR)
 */
export const INTENT_DEFAULTS: Record<
  SpatialIntent,
  {
    distance: number;
    scale: number;
    zonePreference: SpatialZone;
    urgencyDefault: UrgencyLevel;
  }
> = {
  attention: {
    distance: 0.5,
    scale: 1.2,
    zonePreference: "center",
    urgencyDefault: "high",
  },
  peripheral: {
    distance: 0.7,
    scale: 0.9,
    zonePreference: "top-right",
    urgencyDefault: "low",
  },
  ambient: {
    distance: 1.0,
    scale: 0.8,
    zonePreference: "bottom",
    urgencyDefault: "passive",
  },
  contextual: {
    distance: 0.4,
    scale: 1.0,
    zonePreference: "center",
    urgencyDefault: "medium",
  },
  anchored: {
    distance: 0.6,
    scale: 1.0,
    zonePreference: "center",
    urgencyDefault: "medium",
  },
  following: {
    distance: 0.6,
    scale: 1.0,
    zonePreference: "center",
    urgencyDefault: "medium",
  },
  docked: {
    distance: 0.8,
    scale: 0.9,
    zonePreference: "bottom",
    urgencyDefault: "low",
  },
  floating: {
    distance: 0.6,
    scale: 1.0,
    zonePreference: "center",
    urgencyDefault: "medium",
  },
  immersive: {
    distance: 0.4,
    scale: 1.5,
    zonePreference: "center",
    urgencyDefault: "critical",
  },
};

/**
 * Screen-space zone to normalized coordinates mapping
 */
export const ZONE_COORDINATES: Record<SpatialZone, { x: number; y: number }> = {
  "top-left": { x: 0.1, y: 0.1 },
  "top": { x: 0.5, y: 0.1 },
  "top-right": { x: 0.9, y: 0.1 },
  "left": { x: 0.1, y: 0.5 },
  "center": { x: 0.5, y: 0.5 },
  "right": { x: 0.9, y: 0.5 },
  "bottom-left": { x: 0.1, y: 0.9 },
  "bottom": { x: 0.5, y: 0.9 },
  "bottom-right": { x: 0.9, y: 0.9 },
};

/**
 * Resolve spatial config to concrete anchor
 */
export function resolveSpatialConfig(
  config: SpatialConfig,
  viewingContext: ViewingContext,
  _userContext?: UserContext
): SpatialAnchor {
  const defaults = INTENT_DEFAULTS[config.intent];
  const zone = config.preferredZone ?? defaults.zonePreference;
  const zoneCoords = ZONE_COORDINATES[zone];

  // Base anchor
  const anchor: SpatialAnchor = {
    space: viewingContext.ar?.isARSession ? "world" : "screen",
    scale: config.scale ?? defaults.scale,
    userModified: false,
    source: config,
  };

  if (anchor.space === "screen") {
    // Screen-space positioning
    anchor.screen = {
      x: zoneCoords.x,
      y: zoneCoords.y,
    };
    anchor.zIndex = computeZIndex(config);
  } else {
    // World-space positioning
    const distance = config.preferredDistance ?? defaults.distance;
    anchor.world = computeWorldPosition(config, distance);
    anchor.rotation = { x: 0, y: 0, z: 0 };
    anchor.distance = distance;
  }

  return anchor;
}

/**
 * Compute z-index based on urgency and layer
 */
function computeZIndex(config: SpatialConfig): number {
  const baseZ = {
    passive: 100,
    low: 200,
    medium: 300,
    high: 400,
    critical: 500,
  };

  const urgency = config.urgency ?? INTENT_DEFAULTS[config.intent].urgencyDefault;
  return baseZ[urgency] + (config.layer ?? 0) * 10;
}

/**
 * Compute world position based on intent and distance
 */
function computeWorldPosition(
  config: SpatialConfig,
  distance: number
): { x: number; y: number; z: number } {
  const zone = config.preferredZone ?? INTENT_DEFAULTS[config.intent].zonePreference;
  const coords = ZONE_COORDINATES[zone];

  // Convert 2D zone to 3D position (assuming camera at origin looking at -Z)
  // Map x: 0-1 to -0.5 to 0.5 (spread across field of view)
  // Map y: 0-1 to 0.3 to -0.2 (top to bottom in view)
  const x = (coords.x - 0.5) * distance * 0.8;
  const y = (0.5 - coords.y) * distance * 0.5;
  const z = -distance;

  return { x, y, z };
}

// ============================================================================
// COLLISION DETECTION
// ============================================================================

/**
 * Check if two spatial anchors would overlap
 */
export function checkCollision(
  anchor1: SpatialAnchor,
  anchor2: SpatialAnchor,
  _componentSize1: { width: number; height: number },
  _componentSize2: { width: number; height: number }
): boolean {
  if (anchor1.space !== anchor2.space) return false;

  if (anchor1.space === "screen" && anchor1.screen && anchor2.screen) {
    // Simple proximity check for screen space
    const dx = Math.abs(anchor1.screen.x - anchor2.screen.x);
    const dy = Math.abs(anchor1.screen.y - anchor2.screen.y);
    return dx < 0.15 && dy < 0.15; // 15% threshold
  }

  if (anchor1.space === "world" && anchor1.world && anchor2.world) {
    // Distance check for world space
    const dx = anchor1.world.x - anchor2.world.x;
    const dy = anchor1.world.y - anchor2.world.y;
    const dz = anchor1.world.z - anchor2.world.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return distance < 0.1; // 10cm threshold
  }

  return false;
}

/**
 * Resolve collision by adjusting position
 */
export function resolveCollision(
  anchor: SpatialAnchor,
  existingAnchors: SpatialAnchor[],
  behavior: "avoid" | "stack" | "replace" | "overlap"
): SpatialAnchor {
  if (behavior === "overlap" || behavior === "replace") {
    return anchor;
  }

  const componentSize = { width: 0.2, height: 0.1 }; // Default size
  let adjustedAnchor = { ...anchor };

  for (const existing of existingAnchors) {
    if (checkCollision(adjustedAnchor, existing, componentSize, componentSize)) {
      if (behavior === "stack") {
        // Stack vertically
        if (adjustedAnchor.screen) {
          adjustedAnchor = {
            ...adjustedAnchor,
            screen: {
              x: adjustedAnchor.screen.x,
              y: adjustedAnchor.screen.y + 0.12, // Stack below
            },
          };
        } else if (adjustedAnchor.world) {
          adjustedAnchor = {
            ...adjustedAnchor,
            world: {
              x: adjustedAnchor.world.x,
              y: adjustedAnchor.world.y - 0.08, // Stack below in world space
              z: adjustedAnchor.world.z,
            },
          };
        }
      } else if (behavior === "avoid") {
        // Find nearest free position
        if (adjustedAnchor.screen) {
          adjustedAnchor = {
            ...adjustedAnchor,
            screen: {
              x: adjustedAnchor.screen.x + 0.15,
              y: adjustedAnchor.screen.y,
            },
          };
        }
      }
    }
  }

  return adjustedAnchor;
}

// ============================================================================
// SPATIAL LAYOUT MANAGER
// ============================================================================

export interface SpatialLayoutState {
  anchors: Map<string, SpatialAnchor>;
  viewingContext: ViewingContext;
  userContext?: UserContext;
}

/**
 * Create initial layout state
 */
export function createSpatialLayoutState(
  viewingContext: ViewingContext,
  userContext?: UserContext
): SpatialLayoutState {
  return {
    anchors: new Map(),
    viewingContext,
    userContext,
  };
}

/**
 * Add component to layout
 */
export function addToLayout(
  state: SpatialLayoutState,
  id: string,
  config: SpatialConfig
): SpatialLayoutState {
  const anchor = resolveSpatialConfig(
    config,
    state.viewingContext,
    state.userContext
  );

  // Resolve collisions
  const existingAnchors = Array.from(state.anchors.values());
  const resolvedAnchor = resolveCollision(
    anchor,
    existingAnchors,
    config.collision ?? "stack"
  );

  const newAnchors = new Map(state.anchors);
  newAnchors.set(id, resolvedAnchor);

  return {
    ...state,
    anchors: newAnchors,
  };
}

/**
 * Remove component from layout
 */
export function removeFromLayout(
  state: SpatialLayoutState,
  id: string
): SpatialLayoutState {
  const newAnchors = new Map(state.anchors);
  newAnchors.delete(id);

  return {
    ...state,
    anchors: newAnchors,
  };
}

/**
 * Update user context and recalculate affected anchors
 */
export function updateUserContext(
  state: SpatialLayoutState,
  userContext: UserContext
): SpatialLayoutState {
  // Recalculate all anchors with new context
  const newAnchors = new Map<string, SpatialAnchor>();

  for (const [id, anchor] of state.anchors) {
    const newAnchor = resolveSpatialConfig(
      anchor.source,
      state.viewingContext,
      userContext
    );
    newAnchors.set(id, newAnchor);
  }

  return {
    ...state,
    anchors: newAnchors,
    userContext,
  };
}
