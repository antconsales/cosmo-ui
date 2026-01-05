/**
 * useSpatialLayout Hook v1.0
 *
 * React hook for spatial-aware UI positioning.
 * Converts Spatial Intent to screen positions.
 */

import { useState, useCallback, useMemo, useEffect } from "react";
import type {
  SpatialConfig,
  SpatialZone,
  HUDCardPosition,
} from "@cosmo/core-schema";

// ============================================================================
// TYPES
// ============================================================================

export interface ResolvedPosition {
  zone: SpatialZone;
  position: HUDCardPosition;
  priority: number;
  stackOffset?: number;
}

export interface SpatialLayoutItem {
  id: string;
  spatialConfig: SpatialConfig;
  resolved?: ResolvedPosition;
  bounds?: DOMRect;
}

export interface SpatialLayoutContext {
  viewportWidth: number;
  viewportHeight: number;
  safeAreaInsets: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  isLandscape: boolean;
  isMobile: boolean;
}

export interface SpatialLayoutOptions {
  /** Enable collision detection */
  detectCollisions?: boolean;
  /** Minimum gap between items (px) */
  minimumGap?: number;
  /** Animation duration for position changes (ms) */
  animationDuration?: number;
}

export interface UseSpatialLayoutReturn {
  /** Register an item with spatial intent */
  register: (id: string, config: SpatialConfig) => void;
  /** Unregister an item */
  unregister: (id: string) => void;
  /** Update an item's bounds (for collision detection) */
  updateBounds: (id: string, bounds: DOMRect) => void;
  /** Get resolved position for an item */
  getPosition: (id: string) => ResolvedPosition | null;
  /** Get CSS styles for an item */
  getStyles: (id: string) => React.CSSProperties;
  /** Current layout context */
  context: SpatialLayoutContext;
  /** All registered items */
  items: Map<string, SpatialLayoutItem>;
  /** Force recalculation */
  recalculate: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_OPTIONS: Required<SpatialLayoutOptions> = {
  detectCollisions: true,
  minimumGap: 8,
  animationDuration: 200,
};

// Map spatial zones to web positions
const ZONE_TO_POSITION: Record<SpatialZone, HUDCardPosition> = {
  "top": "top-center",
  "bottom": "bottom-center",
  "left": "top-left",
  "right": "top-right",
  "center": "top-center",
  "top-left": "top-left",
  "top-right": "top-right",
  "bottom-left": "bottom-left",
  "bottom-right": "bottom-right",
};

// Map intents to default zones
const INTENT_TO_ZONE: Record<string, SpatialZone> = {
  "attention": "top",
  "peripheral": "top-right",
  "ambient": "bottom-right",
  "hidden": "bottom",
};

// ============================================================================
// HOOK
// ============================================================================

/**
 * useSpatialLayout - Manage spatial intents for multiple components
 *
 * @example
 * ```tsx
 * function NotificationManager() {
 *   const { register, unregister, getStyles } = useSpatialLayout();
 *
 *   useEffect(() => {
 *     register("notification-1", {
 *       intent: "attention",
 *       urgency: "high"
 *     });
 *     return () => unregister("notification-1");
 *   }, []);
 *
 *   return (
 *     <div style={getStyles("notification-1")}>
 *       Important notification!
 *     </div>
 *   );
 * }
 * ```
 */
export function useSpatialLayout(
  options: SpatialLayoutOptions = {}
): UseSpatialLayoutReturn {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Track all registered items
  const [items, setItems] = useState<Map<string, SpatialLayoutItem>>(new Map());

  // Track layout context
  const [context, setContext] = useState<SpatialLayoutContext>(() =>
    detectContext()
  );

  // Update context on resize
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setContext(detectContext());
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  // Register an item
  const register = useCallback(
    (id: string, config: SpatialConfig) => {
      setItems((prev) => {
        const next = new Map(prev);
        const resolved = resolveForWeb(config, context);
        next.set(id, {
          id,
          spatialConfig: config,
          resolved,
        });
        return next;
      });
    },
    [context]
  );

  // Unregister an item
  const unregister = useCallback((id: string) => {
    setItems((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  // Update bounds for collision detection
  const updateBounds = useCallback((id: string, bounds: DOMRect) => {
    setItems((prev) => {
      const item = prev.get(id);
      if (!item) return prev;

      const next = new Map(prev);
      next.set(id, { ...item, bounds });
      return next;
    });
  }, []);

  // Get resolved position for an item
  const getPosition = useCallback(
    (id: string): ResolvedPosition | null => {
      const item = items.get(id);
      return item?.resolved || null;
    },
    [items]
  );

  // Generate CSS styles for an item
  const getStyles = useCallback(
    (id: string): React.CSSProperties => {
      const item = items.get(id);
      if (!item?.resolved) {
        return { display: "none" };
      }

      const position = item.resolved.position;
      return getPositionStyles(position, context, opts.animationDuration);
    },
    [items, context, opts.animationDuration]
  );

  // Force recalculation of all positions
  const recalculate = useCallback(() => {
    setItems((prev) => {
      const next = new Map<string, SpatialLayoutItem>();

      prev.forEach((item, id) => {
        const resolved = resolveForWeb(item.spatialConfig, context);
        next.set(id, { ...item, resolved });
      });

      // Handle collisions if enabled
      if (opts.detectCollisions) {
        handleCollisions(next, opts);
      }

      return next;
    });
  }, [context, opts]);

  // Recalculate when context changes
  useEffect(() => {
    recalculate();
  }, [context, recalculate]);

  return {
    register,
    unregister,
    updateBounds,
    getPosition,
    getStyles,
    context,
    items,
    recalculate,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Detect current layout context
 */
function detectContext(): SpatialLayoutContext {
  if (typeof window === "undefined") {
    return {
      viewportWidth: 1920,
      viewportHeight: 1080,
      safeAreaInsets: { top: 0, right: 0, bottom: 0, left: 0 },
      isLandscape: true,
      isMobile: false,
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const isLandscape = width > height;
  const isMobile = width <= 768;

  // Detect safe area insets (for notched devices)
  const safeAreaInsets = {
    top: parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--sat"
      ) || "0"
    ),
    right: parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--sar"
      ) || "0"
    ),
    bottom: parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--sab"
      ) || "0"
    ),
    left: parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--sal"
      ) || "0"
    ),
  };

  return {
    viewportWidth: width,
    viewportHeight: height,
    safeAreaInsets,
    isLandscape,
    isMobile,
  };
}

/**
 * Resolve spatial config for web rendering
 */
function resolveForWeb(
  config: SpatialConfig,
  context: SpatialLayoutContext
): ResolvedPosition {
  // Get zone from config or map from intent
  const zone: SpatialZone = config.preferredZone ?? INTENT_TO_ZONE[config.intent] ?? "top-right";

  // Map to web position
  let position = ZONE_TO_POSITION[zone] || "top-right";

  // Adjust for mobile
  if (context.isMobile && (position === "center-left" || position === "center-right")) {
    position = "bottom-center";
  }

  // Default priority: attention=1, peripheral=2, ambient=3
  const priorityMap: Record<string, number> = {
    "attention": 1,
    "peripheral": 2,
    "ambient": 3,
    "hidden": 4,
  };
  const priority = priorityMap[config.intent] ?? 3;

  return {
    zone,
    position,
    priority,
  };
}

/**
 * Generate CSS styles for a position
 */
function getPositionStyles(
  position: HUDCardPosition,
  context: SpatialLayoutContext,
  animationDuration: number
): React.CSSProperties {
  const { safeAreaInsets } = context;
  const margin = 16;

  const baseStyles: React.CSSProperties = {
    position: "fixed",
    transition: `all ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    zIndex: 1000,
  };

  switch (position) {
    case "top-left":
      return {
        ...baseStyles,
        top: margin + safeAreaInsets.top,
        left: margin + safeAreaInsets.left,
      };

    case "top-center":
      return {
        ...baseStyles,
        top: margin + safeAreaInsets.top,
        left: "50%",
        transform: "translateX(-50%)",
      };

    case "top-right":
      return {
        ...baseStyles,
        top: margin + safeAreaInsets.top,
        right: margin + safeAreaInsets.right,
      };

    case "center-left":
      return {
        ...baseStyles,
        top: "50%",
        left: margin + safeAreaInsets.left,
        transform: "translateY(-50%)",
      };

    case "center-right":
      return {
        ...baseStyles,
        top: "50%",
        right: margin + safeAreaInsets.right,
        transform: "translateY(-50%)",
      };

    case "bottom-left":
      return {
        ...baseStyles,
        bottom: margin + safeAreaInsets.bottom,
        left: margin + safeAreaInsets.left,
      };

    case "bottom-center":
      return {
        ...baseStyles,
        bottom: margin + safeAreaInsets.bottom,
        left: "50%",
        transform: "translateX(-50%)",
      };

    case "bottom-right":
      return {
        ...baseStyles,
        bottom: margin + safeAreaInsets.bottom,
        right: margin + safeAreaInsets.right,
      };

    default:
      return {
        ...baseStyles,
        top: margin + safeAreaInsets.top,
        right: margin + safeAreaInsets.right,
      };
  }
}

/**
 * Handle collisions between items
 */
function handleCollisions(
  items: Map<string, SpatialLayoutItem>,
  opts: Required<SpatialLayoutOptions>
): void {
  // Group items by zone
  const byZone = new Map<SpatialZone, SpatialLayoutItem[]>();

  items.forEach((item) => {
    if (!item.resolved) return;
    const zone = item.resolved.zone;
    const existing = byZone.get(zone) || [];
    existing.push(item);
    byZone.set(zone, existing);
  });

  // Handle collisions in each zone
  byZone.forEach((zoneItems) => {
    if (zoneItems.length <= 1) return;

    // Sort by priority (highest first)
    zoneItems.sort((a, b) => {
      const priorityA = a.resolved?.priority || 3;
      const priorityB = b.resolved?.priority || 3;
      return priorityB - priorityA;
    });

    // Apply stacking offset
    zoneItems.forEach((item, index) => {
      if (index === 0 || !item.resolved) return;

      const offset = index * (opts.minimumGap + 60); // 60px per card height estimate

      // Modify resolved config with stack offset
      item.resolved = {
        ...item.resolved,
        stackOffset: offset,
      };
    });
  });
}

// ============================================================================
// SINGLE ITEM HOOK
// ============================================================================

/**
 * useSpatialIntent - Simplified hook for single component
 *
 * @example
 * ```tsx
 * function Notification({ intent }) {
 *   const { styles, position } = useSpatialIntent({
 *     intent: "attention",
 *     urgency: "high"
 *   });
 *
 *   return (
 *     <div style={styles}>
 *       Important!
 *     </div>
 *   );
 * }
 * ```
 */
export function useSpatialIntent(config: SpatialConfig): {
  styles: React.CSSProperties;
  resolved: ResolvedPosition;
  zone: SpatialZone;
  position: HUDCardPosition;
} {
  const [context, setContext] = useState<SpatialLayoutContext>(() =>
    detectContext()
  );

  // Update on resize
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => setContext(detectContext());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const resolved = useMemo(
    () => resolveForWeb(config, context),
    [config, context]
  );

  const styles = useMemo(
    () => getPositionStyles(resolved.position, context, 200),
    [resolved.position, context]
  );

  return {
    styles,
    resolved,
    zone: resolved.zone,
    position: resolved.position,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export { ZONE_TO_POSITION };
