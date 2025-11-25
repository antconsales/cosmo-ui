import { describe, it, expect } from "vitest";
import { ProgressRingValidator } from "./ProgressRingValidator";
import type { ProgressRing } from "@cosmo/core-schema";

const validator = new ProgressRingValidator();

const validRing: ProgressRing = {
  id: "ring-1",
  value: 50,
  size: 64,
  thickness: 8,
  variant: "info",
  animated: true,
  showValue: true,
  position: "center",
};

describe("ProgressRingValidator", () => {
  describe("validate", () => {
    describe("required fields", () => {
      it("should pass validation for valid ring", () => {
        const result = validator.validate(validRing);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it("should fail when id is missing", () => {
        const ring = { ...validRing, id: "" };
        const result = validator.validate(ring);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "id" })
        );
      });

      it("should fail when value is missing", () => {
        const ring = { ...validRing, value: undefined as any };
        const result = validator.validate(ring);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "value" })
        );
      });
    });

    describe("value constraints", () => {
      it("should warn when value is below minimum", () => {
        const ring = { ...validRing, value: -10 };
        const result = validator.validate(ring);
        expect(result.warnings).toContainEqual(
          expect.objectContaining({ field: "value" })
        );
      });

      it("should warn when value exceeds maximum", () => {
        const ring = { ...validRing, value: 150 };
        const result = validator.validate(ring);
        expect(result.warnings).toContainEqual(
          expect.objectContaining({ field: "value" })
        );
      });

      it("should fail when value is not a number", () => {
        const ring = { ...validRing, value: "fifty" as any };
        const result = validator.validate(ring);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "value" })
        );
      });
    });

    describe("size constraints", () => {
      it("should warn when size is out of range", () => {
        const ring = { ...validRing, size: 500 };
        const result = validator.validate(ring);
        expect(result.warnings).toContainEqual(
          expect.objectContaining({ field: "size" })
        );
      });

      it("should fail when size is not a number", () => {
        const ring = { ...validRing, size: "large" as any };
        const result = validator.validate(ring);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "size" })
        );
      });
    });

    describe("label constraints", () => {
      it("should fail when label exceeds max length", () => {
        const ring = { ...validRing, label: "a".repeat(50) };
        const result = validator.validate(ring);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "label" })
        );
      });
    });

    describe("variant validation", () => {
      it("should fail on invalid variant", () => {
        const ring = { ...validRing, variant: "invalid" as any };
        const result = validator.validate(ring);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "variant" })
        );
      });
    });

    describe("position validation", () => {
      it("should fail on invalid position", () => {
        const ring = { ...validRing, position: "invalid" as any };
        const result = validator.validate(ring);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "position" })
        );
      });
    });
  });

  describe("sanitize", () => {
    it("should generate id if missing", () => {
      const ring = { value: 50 };
      const result = validator.sanitize(ring);
      expect(result.id).toMatch(/^ring-\d+$/);
    });

    it("should clamp value to valid range", () => {
      const ring = { ...validRing, value: 150 };
      const result = validator.sanitize(ring);
      expect(result.value).toBeLessThanOrEqual(100);
    });

    it("should clamp size to valid range", () => {
      const ring = { ...validRing, size: 500 };
      const result = validator.sanitize(ring);
      expect(result.size).toBeLessThanOrEqual(256);
    });

    it("should apply defaults for missing optional fields", () => {
      const ring = { id: "test", value: 50 };
      const result = validator.sanitize(ring);
      expect(result.variant).toBe("neutral");
      expect(result.animated).toBe(true);
      expect(result.showValue).toBe(false);
      expect(result.position).toBe("center");
    });

    it("should truncate label to max length", () => {
      const ring = { ...validRing, label: "a".repeat(50) };
      const result = validator.sanitize(ring);
      expect(result.label?.length).toBeLessThanOrEqual(30);
    });
  });
});
