import { describe, it, expect } from "vitest";
import { StatusIndicatorValidator } from "./StatusIndicatorValidator";
import type { StatusIndicator } from "@cosmo/core-schema";

const validator = new StatusIndicatorValidator();

const validIndicator: StatusIndicator = {
  id: "indicator-1",
  state: "active",
  size: 16,
  pulse: false,
  glow: false,
  position: "top-right",
};

describe("StatusIndicatorValidator", () => {
  describe("validate", () => {
    describe("required fields", () => {
      it("should pass validation for valid indicator", () => {
        const result = validator.validate(validIndicator);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it("should fail when id is missing", () => {
        const indicator = { ...validIndicator, id: "" };
        const result = validator.validate(indicator);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "id" })
        );
      });

      it("should fail when state is missing", () => {
        const indicator = { ...validIndicator, state: undefined as any };
        const result = validator.validate(indicator);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "state" })
        );
      });
    });

    describe("state validation", () => {
      it("should fail on invalid state", () => {
        const indicator = { ...validIndicator, state: "invalid" as any };
        const result = validator.validate(indicator);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "state" })
        );
      });

      it.each(["idle", "active", "loading", "success", "warning", "error"])(
        "should accept valid state: %s",
        (state) => {
          const indicator = { ...validIndicator, state: state as any };
          const result = validator.validate(indicator);
          expect(result.valid).toBe(true);
        }
      );
    });

    describe("size constraints", () => {
      it("should warn when size is out of range", () => {
        const indicator = { ...validIndicator, size: 100 };
        const result = validator.validate(indicator);
        expect(result.warnings).toContainEqual(
          expect.objectContaining({ field: "size" })
        );
      });

      it("should fail when size is not a number", () => {
        const indicator = { ...validIndicator, size: "large" as any };
        const result = validator.validate(indicator);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "size" })
        );
      });
    });

    describe("label constraints", () => {
      it("should fail when label exceeds max length", () => {
        const indicator = { ...validIndicator, label: "a".repeat(50) };
        const result = validator.validate(indicator);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "label" })
        );
      });
    });

    describe("boolean fields", () => {
      it("should fail when pulse is not boolean", () => {
        const indicator = { ...validIndicator, pulse: "yes" as any };
        const result = validator.validate(indicator);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "pulse" })
        );
      });

      it("should fail when glow is not boolean", () => {
        const indicator = { ...validIndicator, glow: 1 as any };
        const result = validator.validate(indicator);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "glow" })
        );
      });
    });

    describe("position validation", () => {
      it("should fail on invalid position", () => {
        const indicator = { ...validIndicator, position: "invalid" as any };
        const result = validator.validate(indicator);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "position" })
        );
      });
    });
  });

  describe("sanitize", () => {
    it("should generate id if missing", () => {
      const indicator = { state: "active" as const };
      const result = validator.sanitize(indicator);
      expect(result.id).toMatch(/^indicator-\d+$/);
    });

    it("should clamp size to valid range", () => {
      const indicator = { ...validIndicator, size: 100 };
      const result = validator.sanitize(indicator);
      expect(result.size).toBeLessThanOrEqual(32);
    });

    it("should apply defaults for missing optional fields", () => {
      const indicator = { id: "test", state: "active" as const };
      const result = validator.sanitize(indicator);
      expect(result.glow).toBe(false);
      expect(result.position).toBe("top-right");
    });

    it("should default pulse to true for loading state", () => {
      const indicator = { id: "test", state: "loading" as const };
      const result = validator.sanitize(indicator);
      expect(result.pulse).toBe(true);
    });

    it("should default pulse to false for non-loading state", () => {
      const indicator = { id: "test", state: "active" as const };
      const result = validator.sanitize(indicator);
      expect(result.pulse).toBe(false);
    });

    it("should truncate label to max length", () => {
      const indicator = { ...validIndicator, label: "a".repeat(50) };
      const result = validator.sanitize(indicator);
      expect(result.label?.length).toBeLessThanOrEqual(20);
    });
  });
});
