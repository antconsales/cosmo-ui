import type { ProgressRing } from "@cosmo/core-schema";
import { ProgressRingValidator } from "@cosmo/validator";

/**
 * Correction loop for AI-generated ProgressRings
 * Validates output and generates correction prompts
 */

export interface ProgressRingCorrectionResult {
  isValid: boolean;
  ring?: ProgressRing;
  errors?: Array<{ field: string; message: string }>;
  warnings?: Array<{ field: string; message: string }>;
  correctionPrompt?: string;
  sanitized?: ProgressRing;
}

export class ProgressRingCorrector {
  private validator = new ProgressRingValidator();

  /**
   * Validate and prepare correction if needed
   */
  validateAndCorrect(ring: Partial<ProgressRing>): ProgressRingCorrectionResult {
    // Try to sanitize first (applies safe defaults)
    const sanitized = this.validator.sanitize(ring);

    // Validate the sanitized version
    const validation = this.validator.validate(sanitized);

    if (validation.valid) {
      return {
        isValid: true,
        ring: sanitized,
        warnings: validation.warnings.length > 0 ? validation.warnings : undefined,
        sanitized,
      };
    }

    // Generate correction prompt
    const correctionPrompt = this.buildCorrectionPrompt(ring, validation.errors);

    return {
      isValid: false,
      errors: validation.errors,
      warnings: validation.warnings.length > 0 ? validation.warnings : undefined,
      correctionPrompt,
      sanitized,
    };
  }

  /**
   * Build correction prompt for invalid ring
   */
  private buildCorrectionPrompt(
    ring: Partial<ProgressRing>,
    errors: Array<{ field: string; message: string }>
  ): string {
    return `The following ProgressRing has validation errors. Please fix them:

INVALID RING:
${JSON.stringify(ring, null, 2)}

ERRORS:
${errors.map((e) => `- ${e.field}: ${e.message}`).join("\n")}

RULES REMINDER:
- value: 0-100 (required, percentage)
- size: 24-200 pixels (default 48)
- thickness: 2-20 pixels (default 6)
- variant: neutral, info, success, warning, error
- label: max 30 characters
- position: 9-position grid (top-left to bottom-right)

Please provide a corrected ProgressRing JSON.`;
  }

  /**
   * Validate multiple rings in batch
   */
  validateBatch(rings: Partial<ProgressRing>[]): Array<ProgressRingCorrectionResult> {
    return rings.map((ring) => this.validateAndCorrect(ring));
  }

  /**
   * Check if a ring is safe to render
   */
  isSafeToRender(result: ProgressRingCorrectionResult): boolean {
    return result.isValid || (result.errors?.length === 0 && result.sanitized !== undefined);
  }

  /**
   * Get human-readable error summary
   */
  getErrorSummary(result: ProgressRingCorrectionResult): string {
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
  generateHints(result: ProgressRingCorrectionResult): string[] {
    const hints: string[] = [];

    if (!result.errors) return hints;

    for (const error of result.errors) {
      if (error.field === "value") {
        hints.push("Value must be a number between 0 and 100");
      }

      if (error.field === "size") {
        hints.push("Size should be between 24-200 pixels");
      }

      if (error.field === "thickness") {
        hints.push("Thickness should be between 2-20 pixels");
      }

      if (error.field === "label" && error.message.includes("max length")) {
        hints.push("Shorten the label to 30 characters or less");
      }
    }

    return [...new Set(hints)];
  }
}

/**
 * Quick validation helper
 */
export function validateProgressRing(ring: Partial<ProgressRing>): ProgressRingCorrectionResult {
  const corrector = new ProgressRingCorrector();
  return corrector.validateAndCorrect(ring);
}

/**
 * Extract validation errors as plain text
 */
export function formatProgressRingValidationErrors(result: ProgressRingCorrectionResult): string {
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
