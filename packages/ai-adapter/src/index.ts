/**
 * @cosmo/ai-adapter
 * AI integration layer for Cosmo UI
 *
 * This package provides prompts, examples, and validation helpers
 * for AI models to generate Cosmo UI component schemas.
 *
 * v0.3: Added ContextBadge support
 */

// === HUDCard ===

// System prompts and schema docs
export { COSMO_UI_SYSTEM_PROMPT, HUDCARD_SCHEMA_DOCS } from "./prompts/system";

// Examples dataset
export {
  HUDCARD_EXAMPLES,
  getRandomExamples,
  getExamplesByVariant,
  getExamplesByPriority,
} from "./prompts/examples";

// Prompt templates
export {
  buildGenerationPrompt,
  buildCorrectionPrompt,
  buildBatchGenerationPrompt,
  buildQuickPrompt,
  buildConstrainedPrompt,
} from "./prompts/templates";
export type { GenerationOptions } from "./prompts/templates";

// Correction loop
export {
  HUDCardCorrector,
  validateHUDCard,
  formatValidationErrors,
} from "./corrector";
export type { CorrectionResult } from "./corrector";

// === ContextBadge ===

// System prompts and schema docs
export {
  CONTEXTBADGE_SYSTEM_PROMPT,
  CONTEXTBADGE_SCHEMA_DOCS,
} from "./prompts/system";

// Examples dataset
export {
  CONTEXTBADGE_EXAMPLES,
  getRandomContextBadgeExamples,
  getContextBadgeExamplesByVariant,
} from "./prompts/contextBadgeExamples";

// Correction loop
export {
  ContextBadgeCorrector,
  validateContextBadge,
  formatContextBadgeValidationErrors,
} from "./contextBadgeCorrector";
export type { ContextBadgeCorrectionResult } from "./contextBadgeCorrector";

// === ProgressRing ===

// System prompts and schema docs
export {
  PROGRESSRING_SYSTEM_PROMPT,
  PROGRESSRING_SCHEMA_DOCS,
} from "./prompts/system";

// Examples dataset
export {
  PROGRESSRING_EXAMPLES,
  getRandomProgressRingExamples,
  getProgressRingExamplesByVariant,
} from "./prompts/progressRingExamples";

// Correction loop
export {
  ProgressRingCorrector,
  validateProgressRing,
  formatProgressRingValidationErrors,
} from "./progressRingCorrector";
export type { ProgressRingCorrectionResult } from "./progressRingCorrector";

// === StatusIndicator ===

// System prompts and schema docs
export {
  STATUSINDICATOR_SYSTEM_PROMPT,
  STATUSINDICATOR_SCHEMA_DOCS,
} from "./prompts/system";

// Examples dataset
export {
  STATUSINDICATOR_EXAMPLES,
  getRandomStatusIndicatorExamples,
  getStatusIndicatorExamplesByState,
} from "./prompts/statusIndicatorExamples";

// Correction loop
export {
  StatusIndicatorCorrector,
  validateStatusIndicator,
  formatStatusIndicatorValidationErrors,
} from "./statusIndicatorCorrector";
export type { StatusIndicatorCorrectionResult } from "./statusIndicatorCorrector";

// === ActionBar ===

// System prompts
export { ACTIONBAR_SYSTEM_PROMPT } from "./prompts/system";

// === Tooltip ===

// System prompts
export { TOOLTIP_SYSTEM_PROMPT } from "./prompts/system";

// === NEW COMPONENTS (v1.0) ===

// Media Components
export {
  MEDIACARD_SYSTEM_PROMPT,
  MINIPLAYER_SYSTEM_PROMPT,
  TIMER_SYSTEM_PROMPT,
} from "./prompts/system";

// Communication Components
export {
  MESSAGEPREVIEW_SYSTEM_PROMPT,
  CONTACTCARD_SYSTEM_PROMPT,
} from "./prompts/system";

// Productivity Components
export {
  EVENTCARD_SYSTEM_PROMPT,
  WEATHERWIDGET_SYSTEM_PROMPT,
} from "./prompts/system";

// System Components
export {
  QUICKSETTINGS_SYSTEM_PROMPT,
  ACTIVITYRING_SYSTEM_PROMPT,
} from "./prompts/system";

// Navigation Components
export { DIRECTIONARROW_SYSTEM_PROMPT } from "./prompts/system";
