import type { HUDCard } from "@cosmo/core-schema";
import { HUDCardValidator } from "@cosmo/validator";
import { buildCorrectionPrompt } from "./prompts/templates";

/**
 * Correction loop for AI-generated HUDCards
 * Validates output and generates correction prompts
 */

export interface CorrectionResult {
  isValid: boolean;
  card?: HUDCard;
  errors?: Array<{ field: string; message: string }>;
  warnings?: Array<{ field: string; message: string }>;
  correctionPrompt?: string;
  sanitized?: HUDCard;
}

export class HUDCardCorrector {
  private validator = new HUDCardValidator();

  /**
   * Validate and prepare correction if needed
   */
  validateAndCorrect(card: Partial<HUDCard>): CorrectionResult {
    // Try to sanitize first (applies safe defaults)
    const sanitized = this.validator.sanitize(card);

    // Validate the sanitized version
    const validation = this.validator.validate(sanitized);

    if (validation.valid) {
      return {
        isValid: true,
        card: sanitized,
        warnings:
          validation.warnings.length > 0 ? validation.warnings : undefined,
        sanitized,
      };
    }

    // Generate correction prompt
    const correctionPrompt = buildCorrectionPrompt(card, validation.errors);

    return {
      isValid: false,
      errors: validation.errors,
      warnings:
        validation.warnings.length > 0 ? validation.warnings : undefined,
      correctionPrompt,
      sanitized, // Include sanitized version (may still have errors)
    };
  }

  /**
   * Validate multiple cards in batch
   */
  validateBatch(
    cards: Partial<HUDCard>[]
  ): Array<CorrectionResult> {
    return cards.map((card) => this.validateAndCorrect(card));
  }

  /**
   * Check if a card is safe to render
   * (valid or has only warnings)
   */
  isSafeToRender(result: CorrectionResult): boolean {
    return result.isValid || (result.errors?.length === 0 && result.sanitized !== undefined);
  }

  /**
   * Get human-readable error summary
   */
  getErrorSummary(result: CorrectionResult): string {
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
  generateHints(result: CorrectionResult): string[] {
    const hints: string[] = [];

    if (!result.errors) return hints;

    for (const error of result.errors) {
      if (error.field === "title" && error.message.includes("max length")) {
        hints.push("Shorten the title to 60 characters or less");
      }

      if (error.field === "content" && error.message.includes("max length")) {
        hints.push("Reduce content to 200 characters or less");
      }

      if (error.field.startsWith("actions")) {
        if (error.message.includes("max")) {
          hints.push("Remove extra actions (max 2 allowed)");
        }
        if (error.message.includes("label")) {
          hints.push("Shorten action labels to 20 characters or less");
        }
      }

      if (error.field === "autoHideAfterSeconds") {
        hints.push("Set auto-hide between 3-30 seconds, or null");
      }
    }

    return [...new Set(hints)]; // Remove duplicates
  }
}

/**
 * Quick validation helper
 */
export function validateHUDCard(card: Partial<HUDCard>): CorrectionResult {
  const corrector = new HUDCardCorrector();
  return corrector.validateAndCorrect(card);
}

/**
 * Extract validation errors as plain text
 */
export function formatValidationErrors(result: CorrectionResult): string {
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
