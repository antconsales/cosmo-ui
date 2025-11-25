import type { ContextBadge } from "@cosmo/core-schema";
import { ContextBadgeValidator } from "@cosmo/validator";

/**
 * Correction loop for AI-generated ContextBadges
 * Validates output and generates correction prompts
 */

export interface ContextBadgeCorrectionResult {
  isValid: boolean;
  badge?: ContextBadge;
  errors?: Array<{ field: string; message: string }>;
  warnings?: Array<{ field: string; message: string }>;
  correctionPrompt?: string;
  sanitized?: ContextBadge;
}

export class ContextBadgeCorrector {
  private validator = new ContextBadgeValidator();

  /**
   * Validate and prepare correction if needed
   */
  validateAndCorrect(badge: Partial<ContextBadge>): ContextBadgeCorrectionResult {
    // Try to sanitize first (applies safe defaults)
    const sanitized = this.validator.sanitize(badge);

    // Validate the sanitized version
    const validation = this.validator.validate(sanitized);

    if (validation.valid) {
      return {
        isValid: true,
        badge: sanitized,
        warnings: validation.warnings.length > 0 ? validation.warnings : undefined,
        sanitized,
      };
    }

    // Generate correction prompt
    const correctionPrompt = this.buildCorrectionPrompt(badge, validation.errors);

    return {
      isValid: false,
      errors: validation.errors,
      warnings: validation.warnings.length > 0 ? validation.warnings : undefined,
      correctionPrompt,
      sanitized,
    };
  }

  /**
   * Build correction prompt for invalid badge
   */
  private buildCorrectionPrompt(
    badge: Partial<ContextBadge>,
    errors: Array<{ field: string; message: string }>
  ): string {
    return `The following ContextBadge has validation errors. Please fix them:

INVALID BADGE:
${JSON.stringify(badge, null, 2)}

ERRORS:
${errors.map((e) => `- ${e.field}: ${e.message}`).join("\n")}

RULES REMINDER:
- label: max 30 characters
- autoDismissMs: 1000-30000 (milliseconds) or null
- contextualColor: must be hex format like #ff5500
- variant: neutral, info, success, warning, error

Please provide a corrected ContextBadge JSON.`;
  }

  /**
   * Validate multiple badges in batch
   */
  validateBatch(badges: Partial<ContextBadge>[]): Array<ContextBadgeCorrectionResult> {
    return badges.map((badge) => this.validateAndCorrect(badge));
  }

  /**
   * Check if a badge is safe to render
   */
  isSafeToRender(result: ContextBadgeCorrectionResult): boolean {
    return result.isValid || (result.errors?.length === 0 && result.sanitized !== undefined);
  }

  /**
   * Get human-readable error summary
   */
  getErrorSummary(result: ContextBadgeCorrectionResult): string {
    if (result.isValid) return "Valid";

    const errorCount = result.errors?.length || 0;
    const warningCount = result.warnings?.length || 0;

    const parts: string[] = [];

    if (errorCount > 0) {
      parts.push(`${errorCount} error${errorCount > 1 ? "s" : ""}`);
    }

    if (warningCount > 0) {
      parts.push(`${warningCount} warning${warningCount > 1 ? "s" : ""}`);
    }

    return parts.join(", ");
  }

  /**
   * Generate correction hints for common mistakes
   */
  generateHints(result: ContextBadgeCorrectionResult): string[] {
    const hints: string[] = [];

    if (!result.errors) return hints;

    for (const error of result.errors) {
      if (error.field === "label" && error.message.includes("max length")) {
        hints.push("Shorten the label to 30 characters or less");
      }

      if (error.field === "contextualColor") {
        hints.push("Use hex color format like #ff5500");
      }

      if (error.field === "autoDismissMs") {
        hints.push("Set autoDismissMs between 1000-30000ms, or null");
      }
    }

    return [...new Set(hints)];
  }
}

/**
 * Quick validation helper
 */
export function validateContextBadge(badge: Partial<ContextBadge>): ContextBadgeCorrectionResult {
  const corrector = new ContextBadgeCorrector();
  return corrector.validateAndCorrect(badge);
}

/**
 * Extract validation errors as plain text
 */
export function formatContextBadgeValidationErrors(result: ContextBadgeCorrectionResult): string {
  if (result.isValid) return "No errors";

  const lines: string[] = [];

  if (result.errors && result.errors.length > 0) {
    lines.push("Errors:");
    result.errors.forEach((err, idx) => {
      lines.push(`  ${idx + 1}. [${err.field}] ${err.message}`);
    });
  }

  if (result.warnings && result.warnings.length > 0) {
    if (lines.length > 0) lines.push("");
    lines.push("Warnings:");
    result.warnings.forEach((warn, idx) => {
      lines.push(`  ${idx + 1}. [${warn.field}] ${warn.message}`);
    });
  }

  return lines.join("\n");
}
