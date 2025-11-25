import type { StatusIndicator } from "@cosmo/core-schema";
import { StatusIndicatorValidator } from "@cosmo/validator";

/**
 * Correction loop for AI-generated StatusIndicators
 * Validates output and generates correction prompts
 */

export interface StatusIndicatorCorrectionResult {
  isValid: boolean;
  indicator?: StatusIndicator;
  errors?: Array<{ field: string; message: string }>;
  warnings?: Array<{ field: string; message: string }>;
  correctionPrompt?: string;
  sanitized?: StatusIndicator;
}

export class StatusIndicatorCorrector {
  private validator = new StatusIndicatorValidator();

  /**
   * Validate and prepare correction if needed
   */
  validateAndCorrect(indicator: Partial<StatusIndicator>): StatusIndicatorCorrectionResult {
    // Try to sanitize first (applies safe defaults)
    const sanitized = this.validator.sanitize(indicator);

    // Validate the sanitized version
    const validation = this.validator.validate(sanitized);

    if (validation.valid) {
      return {
        isValid: true,
        indicator: sanitized,
        warnings: validation.warnings.length > 0 ? validation.warnings : undefined,
        sanitized,
      };
    }

    // Generate correction prompt
    const correctionPrompt = this.buildCorrectionPrompt(indicator, validation.errors);

    return {
      isValid: false,
      errors: validation.errors,
      warnings: validation.warnings.length > 0 ? validation.warnings : undefined,
      correctionPrompt,
      sanitized,
    };
  }

  /**
   * Build correction prompt for invalid indicator
   */
  private buildCorrectionPrompt(
    indicator: Partial<StatusIndicator>,
    errors: Array<{ field: string; message: string }>
  ): string {
    return `The following StatusIndicator has validation errors. Please fix them:

INVALID INDICATOR:
${JSON.stringify(indicator, null, 2)}

ERRORS:
${errors.map((e) => `- ${e.field}: ${e.message}`).join("\n")}

RULES REMINDER:
- state: idle, active, loading, success, warning, error (required)
- size: 8-32 pixels (default 12)
- label: max 20 characters
- pulse: boolean (default true for loading state)
- glow: boolean (default false)
- position: 9-position grid (top-left to bottom-right)

Please provide a corrected StatusIndicator JSON.`;
  }

  /**
   * Validate multiple indicators in batch
   */
  validateBatch(indicators: Partial<StatusIndicator>[]): Array<StatusIndicatorCorrectionResult> {
    return indicators.map((indicator) => this.validateAndCorrect(indicator));
  }

  /**
   * Check if an indicator is safe to render
   */
  isSafeToRender(result: StatusIndicatorCorrectionResult): boolean {
    return result.isValid || (result.errors?.length === 0 && result.sanitized !== undefined);
  }

  /**
   * Get human-readable error summary
   */
  getErrorSummary(result: StatusIndicatorCorrectionResult): string {
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
  generateHints(result: StatusIndicatorCorrectionResult): string[] {
    const hints: string[] = [];

    if (!result.errors) return hints;

    for (const error of result.errors) {
      if (error.field === "state") {
        hints.push("State must be one of: idle, active, loading, success, warning, error");
      }

      if (error.field === "size") {
        hints.push("Size should be between 8-32 pixels");
      }

      if (error.field === "label" && error.message.includes("max length")) {
        hints.push("Shorten the label to 20 characters or less");
      }
    }

    return [...new Set(hints)];
  }
}

/**
 * Quick validation helper
 */
export function validateStatusIndicator(indicator: Partial<StatusIndicator>): StatusIndicatorCorrectionResult {
  const corrector = new StatusIndicatorCorrector();
  return corrector.validateAndCorrect(indicator);
}

/**
 * Extract validation errors as plain text
 */
export function formatStatusIndicatorValidationErrors(result: StatusIndicatorCorrectionResult): string {
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
