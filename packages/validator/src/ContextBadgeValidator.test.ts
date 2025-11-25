import { describe, it, expect } from "vitest";
import { ContextBadgeValidator } from "./ContextBadgeValidator";
import type { ContextBadge } from "@cosmo/core-schema";

const validator = new ContextBadgeValidator();

const validBadge: ContextBadge = {
  id: "badge-1",
  label: "Status",
  variant: "info",
  icon: "info",
  position: "top-right",
  dismissible: true,
  pulse: false,
  autoDismissMs: null,
};

describe("ContextBadgeValidator", () => {
  describe("validate", () => {
    describe("required fields", () => {
      it("should pass validation for valid badge", () => {
        const result = validator.validate(validBadge);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it("should fail when id is missing", () => {
        const badge = { ...validBadge, id: "" };
        const result = validator.validate(badge);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "id" })
        );
      });

      it("should fail when label is missing", () => {
        const badge = { ...validBadge, label: "" };
        const result = validator.validate(badge);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "label" })
        );
      });
    });

    describe("length constraints", () => {
      it("should fail when label exceeds max length", () => {
        const badge = { ...validBadge, label: "a".repeat(50) };
        const result = validator.validate(badge);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "label" })
        );
      });
    });

    describe("variant validation", () => {
      it("should fail on invalid variant", () => {
        const badge = { ...validBadge, variant: "invalid" as any };
        const result = validator.validate(badge);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "variant" })
        );
      });
    });

    describe("contextual color validation", () => {
      it("should fail on invalid hex color", () => {
        const badge = { ...validBadge, contextualColor: "not-a-color" };
        const result = validator.validate(badge);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "contextualColor" })
        );
      });

      it("should pass on valid hex color", () => {
        const badge = { ...validBadge, contextualColor: "#ff5500" };
        const result = validator.validate(badge);
        expect(result.valid).toBe(true);
      });
    });

    describe("auto-dismiss constraints", () => {
      it("should warn when autoDismissMs is below minimum", () => {
        const badge = { ...validBadge, autoDismissMs: 100 };
        const result = validator.validate(badge);
        expect(result.warnings).toContainEqual(
          expect.objectContaining({ field: "autoDismissMs" })
        );
      });

      it("should warn when autoDismissMs is above maximum", () => {
        const badge = { ...validBadge, autoDismissMs: 100000 };
        const result = validator.validate(badge);
        expect(result.warnings).toContainEqual(
          expect.objectContaining({ field: "autoDismissMs" })
        );
      });
    });

    describe("metadata validation", () => {
      it("should fail on invalid anchorType", () => {
        const badge = {
          ...validBadge,
          metadata: { anchorType: "invalid" as any },
        };
        const result = validator.validate(badge);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "metadata.anchorType" })
        );
      });

      it("should fail on empty followTarget", () => {
        const badge = {
          ...validBadge,
          metadata: { followTarget: "" },
        };
        const result = validator.validate(badge);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "metadata.followTarget" })
        );
      });
    });
  });

  describe("sanitize", () => {
    it("should generate id if missing", () => {
      const badge = { label: "Test" };
      const result = validator.sanitize(badge);
      expect(result.id).toMatch(/^badge-\d+$/);
    });

    it("should truncate label to max length", () => {
      const badge = { ...validBadge, label: "a".repeat(50) };
      const result = validator.sanitize(badge);
      expect(result.label.length).toBeLessThanOrEqual(30);
    });

    it("should apply defaults for missing optional fields", () => {
      const badge = { id: "test", label: "Test" };
      const result = validator.sanitize(badge);
      expect(result.variant).toBe("neutral");
      expect(result.icon).toBe("none");
      expect(result.position).toBe("top-right");
      expect(result.pulse).toBe(false);
      expect(result.dismissible).toBe(true);
    });

    it("should remove invalid contextualColor", () => {
      const badge = { ...validBadge, contextualColor: "invalid" };
      const result = validator.sanitize(badge);
      expect(result.contextualColor).toBeUndefined();
    });

    it("should clamp autoDismissMs to valid range", () => {
      const badge = { ...validBadge, autoDismissMs: 100 };
      const result = validator.sanitize(badge);
      expect(result.autoDismissMs).toBeGreaterThanOrEqual(500);
    });
  });
});
