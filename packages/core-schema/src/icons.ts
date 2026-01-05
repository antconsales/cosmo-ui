/**
 * Cosmo UI Icon System v1.0
 *
 * A comprehensive icon system supporting multiple icon libraries,
 * custom icons, and AR-optimized rendering.
 */

// ============================================================================
// ICON CATEGORIES
// ============================================================================

/**
 * Icon category for semantic grouping
 */
export type IconCategory =
  | "navigation"    // Navigation and arrows
  | "action"        // User actions
  | "status"        // Status indicators
  | "media"         // Media controls
  | "communication" // Messages, calls
  | "system"        // System icons
  | "weather"       // Weather conditions
  | "fitness"       // Health and fitness
  | "time"          // Time-related
  | "social"        // Social features
  | "commerce"      // Commerce/shopping
  | "file"          // Files and documents
  | "device"        // Device features
  | "brand"         // Brand icons
  | "misc";         // Miscellaneous

// ============================================================================
// ICON REGISTRY
// ============================================================================

/**
 * Icon definition
 */
export interface IconDefinition {
  /** Icon name (unique identifier) */
  name: string;

  /** Category */
  category: IconCategory;

  /** SVG path data (d attribute) */
  path: string;

  /** ViewBox dimensions */
  viewBox?: string;

  /** Multiple paths for complex icons */
  paths?: string[];

  /** Fill rule */
  fillRule?: "nonzero" | "evenodd";

  /** Stroke-based icon */
  stroke?: boolean;

  /** Stroke width */
  strokeWidth?: number;

  /** Keywords for search */
  keywords?: string[];

  /** Aliases for this icon */
  aliases?: string[];
}

/**
 * Complete icon registry
 */
export const ICON_REGISTRY: Record<string, IconDefinition> = {
  // ============ NAVIGATION ============
  "arrow-up": {
    name: "arrow-up",
    category: "navigation",
    path: "M12 19V5m0 0l-7 7m7-7l7 7",
    stroke: true,
    strokeWidth: 2,
    keywords: ["up", "north", "direction"],
  },
  "arrow-down": {
    name: "arrow-down",
    category: "navigation",
    path: "M12 5v14m0 0l7-7m-7 7l-7-7",
    stroke: true,
    strokeWidth: 2,
    keywords: ["down", "south", "direction"],
  },
  "arrow-left": {
    name: "arrow-left",
    category: "navigation",
    path: "M19 12H5m0 0l7 7m-7-7l7-7",
    stroke: true,
    strokeWidth: 2,
    keywords: ["left", "west", "back"],
  },
  "arrow-right": {
    name: "arrow-right",
    category: "navigation",
    path: "M5 12h14m0 0l-7-7m7 7l-7 7",
    stroke: true,
    strokeWidth: 2,
    keywords: ["right", "east", "forward"],
  },
  "chevron-up": {
    name: "chevron-up",
    category: "navigation",
    path: "M18 15l-6-6-6 6",
    stroke: true,
    strokeWidth: 2,
    keywords: ["up", "expand", "collapse"],
  },
  "chevron-down": {
    name: "chevron-down",
    category: "navigation",
    path: "M6 9l6 6 6-6",
    stroke: true,
    strokeWidth: 2,
    keywords: ["down", "expand", "dropdown"],
  },
  home: {
    name: "home",
    category: "navigation",
    path: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    stroke: true,
    strokeWidth: 2,
    keywords: ["house", "main", "start"],
  },
  menu: {
    name: "menu",
    category: "navigation",
    path: "M4 6h16M4 12h16M4 18h16",
    stroke: true,
    strokeWidth: 2,
    keywords: ["hamburger", "lines", "nav"],
  },
  back: {
    name: "back",
    category: "navigation",
    path: "M10 19l-7-7m0 0l7-7m-7 7h18",
    stroke: true,
    strokeWidth: 2,
    keywords: ["return", "previous"],
  },

  // ============ ACTIONS ============
  check: {
    name: "check",
    category: "action",
    path: "M5 13l4 4L19 7",
    stroke: true,
    strokeWidth: 2,
    keywords: ["done", "complete", "success", "tick"],
    aliases: ["done", "tick"],
  },
  "check-circle": {
    name: "check-circle",
    category: "action",
    path: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["done", "complete", "success"],
  },
  x: {
    name: "x",
    category: "action",
    path: "M6 18L18 6M6 6l12 12",
    stroke: true,
    strokeWidth: 2,
    keywords: ["close", "cancel", "remove", "delete"],
    aliases: ["close", "cancel"],
  },
  "x-circle": {
    name: "x-circle",
    category: "action",
    path: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["close", "error", "remove"],
  },
  plus: {
    name: "plus",
    category: "action",
    path: "M12 4v16m8-8H4",
    stroke: true,
    strokeWidth: 2,
    keywords: ["add", "new", "create"],
    aliases: ["add"],
  },
  minus: {
    name: "minus",
    category: "action",
    path: "M20 12H4",
    stroke: true,
    strokeWidth: 2,
    keywords: ["remove", "subtract", "less"],
  },
  search: {
    name: "search",
    category: "action",
    path: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["find", "look", "query"],
  },
  settings: {
    name: "settings",
    category: "action",
    path: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["gear", "cog", "preferences", "config"],
    aliases: ["gear", "cog"],
  },
  edit: {
    name: "edit",
    category: "action",
    path: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["pencil", "modify", "write"],
    aliases: ["pencil"],
  },
  trash: {
    name: "trash",
    category: "action",
    path: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
    stroke: true,
    strokeWidth: 2,
    keywords: ["delete", "remove", "bin"],
    aliases: ["delete", "bin"],
  },
  share: {
    name: "share",
    category: "action",
    path: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["send", "export", "distribute"],
  },
  refresh: {
    name: "refresh",
    category: "action",
    path: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    stroke: true,
    strokeWidth: 2,
    keywords: ["reload", "sync", "update"],
    aliases: ["reload", "sync"],
  },

  // ============ STATUS ============
  info: {
    name: "info",
    category: "status",
    path: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["information", "help", "about"],
    aliases: ["information"],
  },
  alert: {
    name: "alert",
    category: "status",
    path: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["warning", "caution", "attention"],
    aliases: ["warning", "caution"],
  },
  error: {
    name: "error",
    category: "status",
    path: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["danger", "problem", "issue"],
    aliases: ["danger"],
  },
  bell: {
    name: "bell",
    category: "status",
    path: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    stroke: true,
    strokeWidth: 2,
    keywords: ["notification", "alarm", "ring"],
    aliases: ["notification"],
  },

  // ============ MEDIA ============
  play: {
    name: "play",
    category: "media",
    path: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["start", "video", "audio"],
  },
  pause: {
    name: "pause",
    category: "media",
    path: "M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["stop", "halt"],
  },
  stop: {
    name: "stop",
    category: "media",
    path: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["end", "terminate"],
  },
  "skip-forward": {
    name: "skip-forward",
    category: "media",
    path: "M9 5l7 7-7 7",
    stroke: true,
    strokeWidth: 2,
    keywords: ["next", "forward"],
  },
  "skip-back": {
    name: "skip-back",
    category: "media",
    path: "M15 19l-7-7 7-7",
    stroke: true,
    strokeWidth: 2,
    keywords: ["previous", "back"],
  },
  volume: {
    name: "volume",
    category: "media",
    path: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["sound", "audio", "speaker"],
    aliases: ["speaker"],
  },
  "volume-mute": {
    name: "volume-mute",
    category: "media",
    path: "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2",
    stroke: true,
    strokeWidth: 2,
    keywords: ["silent", "mute"],
  },
  mic: {
    name: "mic",
    category: "media",
    path: "M19 10v1a7 7 0 01-14 0v-1m7 4v4m-4 0h8m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["microphone", "record", "voice"],
    aliases: ["microphone"],
  },
  camera: {
    name: "camera",
    category: "media",
    path: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["photo", "picture", "image"],
  },

  // ============ TIME ============
  clock: {
    name: "clock",
    category: "time",
    path: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["time", "watch", "schedule"],
    aliases: ["time"],
  },
  calendar: {
    name: "calendar",
    category: "time",
    path: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["date", "schedule", "event"],
  },

  // ============ COMMUNICATION ============
  mail: {
    name: "mail",
    category: "communication",
    path: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["email", "message", "inbox"],
    aliases: ["email"],
  },
  chat: {
    name: "chat",
    category: "communication",
    path: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["message", "conversation", "bubble"],
    aliases: ["message"],
  },
  phone: {
    name: "phone",
    category: "communication",
    path: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["call", "telephone", "contact"],
    aliases: ["call"],
  },

  // ============ SYSTEM ============
  wifi: {
    name: "wifi",
    category: "system",
    path: "M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0",
    stroke: true,
    strokeWidth: 2,
    keywords: ["wireless", "internet", "network"],
  },
  bluetooth: {
    name: "bluetooth",
    category: "system",
    path: "M6.5 6.5l11 11L12 23V1l5.5 5.5-11 11",
    stroke: true,
    strokeWidth: 2,
    keywords: ["wireless", "connect"],
  },
  battery: {
    name: "battery",
    category: "system",
    path: "M17 6h2a2 2 0 012 2v8a2 2 0 01-2 2h-2v4H7v-4H5a2 2 0 01-2-2V8a2 2 0 012-2h2V2h10v4z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["power", "charge", "energy"],
  },
  location: {
    name: "location",
    category: "system",
    path: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["gps", "map", "pin", "place"],
    aliases: ["pin", "gps"],
  },

  // ============ SOCIAL ============
  user: {
    name: "user",
    category: "social",
    path: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["person", "profile", "account"],
    aliases: ["person", "profile"],
  },
  users: {
    name: "users",
    category: "social",
    path: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["people", "group", "team"],
    aliases: ["people", "group"],
  },
  heart: {
    name: "heart",
    category: "social",
    path: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["love", "like", "favorite"],
    aliases: ["love", "favorite"],
  },
  star: {
    name: "star",
    category: "social",
    path: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["favorite", "rate", "bookmark"],
  },

  // ============ FITNESS ============
  activity: {
    name: "activity",
    category: "fitness",
    path: "M22 12h-4l-3 9L9 3l-3 9H2",
    stroke: true,
    strokeWidth: 2,
    keywords: ["heartbeat", "pulse", "health"],
    aliases: ["pulse", "heartbeat"],
  },

  // ============ WEATHER ============
  sun: {
    name: "sun",
    category: "weather",
    path: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["sunny", "day", "bright"],
    aliases: ["sunny", "clear"],
  },
  cloud: {
    name: "cloud",
    category: "weather",
    path: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
    stroke: true,
    strokeWidth: 2,
    keywords: ["cloudy", "overcast"],
    aliases: ["cloudy"],
  },
  "cloud-rain": {
    name: "cloud-rain",
    category: "weather",
    path: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z M8 19v2m4-2v2m4-2v2",
    stroke: true,
    strokeWidth: 2,
    keywords: ["rainy", "rain"],
    aliases: ["rain", "rainy"],
  },
};

// ============================================================================
// ICON UTILITIES
// ============================================================================

/**
 * Get icon by name (supports aliases)
 */
export function getIcon(name: string): IconDefinition | undefined {
  // Direct lookup
  if (ICON_REGISTRY[name]) {
    return ICON_REGISTRY[name];
  }

  // Search aliases
  for (const icon of Object.values(ICON_REGISTRY)) {
    if (icon.aliases?.includes(name)) {
      return icon;
    }
  }

  return undefined;
}

/**
 * Get icons by category
 */
export function getIconsByCategory(category: IconCategory): IconDefinition[] {
  return Object.values(ICON_REGISTRY).filter((icon) => icon.category === category);
}

/**
 * Search icons by keyword
 */
export function searchIcons(query: string): IconDefinition[] {
  const lowerQuery = query.toLowerCase();

  return Object.values(ICON_REGISTRY).filter((icon) => {
    if (icon.name.toLowerCase().includes(lowerQuery)) return true;
    if (icon.aliases?.some((a) => a.toLowerCase().includes(lowerQuery))) return true;
    if (icon.keywords?.some((k) => k.toLowerCase().includes(lowerQuery))) return true;
    return false;
  });
}

/**
 * Get all available icon names
 */
export function getAllIconNames(): string[] {
  const names: Set<string> = new Set();

  for (const icon of Object.values(ICON_REGISTRY)) {
    names.add(icon.name);
    if (icon.aliases) {
      for (const alias of icon.aliases) {
        names.add(alias);
      }
    }
  }

  return Array.from(names).sort();
}

/**
 * Generate SVG string for icon
 */
export function iconToSVG(
  icon: IconDefinition,
  size: number = 24,
  color: string = "currentColor"
): string {
  const viewBox = icon.viewBox ?? "0 0 24 24";

  if (icon.stroke) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}" fill="none" stroke="${color}" stroke-width="${icon.strokeWidth ?? 2}" stroke-linecap="round" stroke-linejoin="round"><path d="${icon.path}"/></svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}" fill="${color}"><path d="${icon.path}" fill-rule="${icon.fillRule ?? "nonzero"}"/></svg>`;
}

/**
 * Get icon as data URL
 */
export function iconToDataURL(
  icon: IconDefinition,
  size: number = 24,
  color: string = "currentColor"
): string {
  const svg = iconToSVG(icon, size, color);
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// ============================================================================
// ICON TYPES FOR COMPONENTS
// ============================================================================

/**
 * Standard icon names for use in component schemas
 */
export type IconName =
  | "none"
  // Navigation
  | "arrow-up"
  | "arrow-down"
  | "arrow-left"
  | "arrow-right"
  | "chevron-up"
  | "chevron-down"
  | "home"
  | "menu"
  | "back"
  // Actions
  | "check"
  | "check-circle"
  | "x"
  | "x-circle"
  | "plus"
  | "minus"
  | "search"
  | "settings"
  | "edit"
  | "trash"
  | "share"
  | "refresh"
  // Status
  | "info"
  | "alert"
  | "error"
  | "bell"
  // Media
  | "play"
  | "pause"
  | "stop"
  | "skip-forward"
  | "skip-back"
  | "volume"
  | "volume-mute"
  | "mic"
  | "camera"
  // Time
  | "clock"
  | "calendar"
  // Communication
  | "mail"
  | "chat"
  | "phone"
  // System
  | "wifi"
  | "bluetooth"
  | "battery"
  | "location"
  // Social
  | "user"
  | "users"
  | "heart"
  | "star"
  // Fitness
  | "activity"
  // Weather
  | "sun"
  | "cloud"
  | "cloud-rain";

/**
 * Validate if name is valid icon
 */
export function isValidIconName(name: string): name is IconName {
  return name === "none" || getIcon(name) !== undefined;
}
