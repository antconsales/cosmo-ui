/**
 * Cosmo UI System Constraints
 * These constraints ensure safe, non-invasive UI across all renderers
 */

export const HUDCARD_CONSTRAINTS = {
  title: { maxLength: 60 },
  content: { maxLength: 200 },
  actions: { maxCount: 2, labelMaxLength: 20 },
  autoHide: { min: 3, max: 30 }, // seconds
  maxConcurrentCards: 5, // system-level: max 5 cards visible at once
} as const;

export type HUDCardConstraints = typeof HUDCARD_CONSTRAINTS;

export const CONTEXTBADGE_CONSTRAINTS = {
  label: { maxLength: 30 },
  autoDismiss: { min: 1000, max: 30000 }, // milliseconds
  maxConcurrentBadges: 8, // badges are smaller, allow more
  contextualColor: { pattern: /^#[0-9a-fA-F]{6}$/ }, // hex color
} as const;

export type ContextBadgeConstraints = typeof CONTEXTBADGE_CONSTRAINTS;

export const PROGRESSRING_CONSTRAINTS = {
  value: { min: 0, max: 100 },
  size: { min: 24, max: 200, default: 48 },
  thickness: { min: 2, max: 20, default: 6 },
  label: { maxLength: 30 },
  maxConcurrentRings: 6,
} as const;

export type ProgressRingConstraints = typeof PROGRESSRING_CONSTRAINTS;

export const STATUSINDICATOR_CONSTRAINTS = {
  size: { min: 8, max: 32, default: 12 },
  label: { maxLength: 20 },
  maxConcurrentIndicators: 10, // very small, allow many
  pulseInterval: { min: 500, max: 2000, default: 1000 }, // milliseconds
} as const;

export type StatusIndicatorConstraints = typeof STATUSINDICATOR_CONSTRAINTS;

export const ACTIONBAR_CONSTRAINTS = {
  items: { minCount: 1, maxCount: 6 }, // 1-6 items for usability
  label: { maxLength: 12 }, // short labels under icons
  badge: { max: 99 }, // max badge count shown
  maxConcurrentBars: 2, // typically one per edge
} as const;

export type ActionBarConstraints = typeof ACTIONBAR_CONSTRAINTS;

export const TOOLTIP_CONSTRAINTS = {
  content: { maxLength: 200 },
  maxWidth: { min: 100, max: 400, default: 250 },
  delay: { min: 0, max: 2000, default: 300 }, // milliseconds
  maxConcurrentTooltips: 3,
} as const;

export type TooltipConstraints = typeof TOOLTIP_CONSTRAINTS;
