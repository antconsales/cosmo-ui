import { describe, it, expect } from "vitest";
import { TooltipValidator } from "./TooltipValidator";
import type { Tooltip } from "@cosmo/core-schema";

const validator = new TooltipValidator();

const validTooltip: Tooltip = {
  id: "tooltip-1",
  content: "This is a tooltip",
  position: "top",
  trigger: "hover",
  variant: "dark",
  showArrow: true,
  delayShow: 300,
  delayHide: 0,
  maxWidth: 250,
};

describe("TooltipValidator", () => {
  describe("validate", () => {
    describe("required fields", () => {
      it("should pass validation for valid tooltip", () => {
        const result = validator.validate(validTooltip);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it("should fail when id is missing", () => {
        const tooltip = { ...validTooltip, id: "" };
        const result = validator.validate(tooltip);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "id" })
        );
      });

      it("should fail when content is missing", () => {
        const tooltip = { ...validTooltip, content: "" };
        const result = validator.validate(tooltip);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "content" })
        );
      });
    });

    describe("content constraints", () => {
      it("should fail when content exceeds max length", () => {
        const tooltip = { ...validTooltip, content: "a".repeat(250) };
        const result = validator.validate(tooltip);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "content" })
        );
      });
    });

    describe("position validation", () => {
      it("should fail on invalid position", () => {
        const tooltip = { ...validTooltip, position: "invalid" as any };
        const result = validator.validate(tooltip);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "position" })
        );
      });

      it.each(["top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"])(
        "should accept valid position: %s",
        (position) => {
          const tooltip = { ...validTooltip, position: position as any };
          const result = validator.validate(tooltip);
          expect(result.valid).toBe(true);
        }
      );
    });

    describe("trigger validation", () => {
      it("should fail on invalid trigger", () => {
        const tooltip = { ...validTooltip, trigger: "invalid" as any };
        const result = validator.validate(tooltip);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "trigger" })
        );
      });

      it.each(["hover", "click", "focus", "manual"])(
        "should accept valid trigger: %s",
        (trigger) => {
          const tooltip = { ...validTooltip, trigger: trigger as any };
          const result = validator.validate(tooltip);
          expect(result.valid).toBe(true);
        }
      );
    });

    describe("variant validation", () => {
      it("should fail on invalid variant", () => {
        const tooltip = { ...validTooltip, variant: "invalid" as any };
        const result = validator.validate(tooltip);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "variant" })
        );
      });
    });

    describe("maxWidth constraints", () => {
      it("should warn when maxWidth is out of range", () => {
        const tooltip = { ...validTooltip, maxWidth: 500 };
        const result = validator.validate(tooltip);
        expect(result.warnings).toContainEqual(
          expect.objectContaining({ field: "maxWidth" })
        );
      });
    });
  });

  describe("sanitize", () => {
    it("should generate id if missing", () => {
      const tooltip = { content: "Test" } as any;
      const result = validator.sanitize(tooltip);
      expect(result.id).toMatch(/^tooltip-\d+$/);
    });

    it("should truncate content to max length", () => {
      const tooltip = { ...validTooltip, content: "a".repeat(250) };
      const result = validator.sanitize(tooltip);
      expect(result.content.length).toBeLessThanOrEqual(200);
    });

    it("should clamp maxWidth to valid range", () => {
      const tooltip = { ...validTooltip, maxWidth: 500 };
      const result = validator.sanitize(tooltip);
      expect(result.maxWidth).toBeLessThanOrEqual(400);
    });

    it("should apply defaults for missing optional fields", () => {
      const tooltip = { id: "test", content: "Test" } as any;
      const result = validator.sanitize(tooltip);
      expect(result.position).toBe("top");
      expect(result.trigger).toBe("hover");
      expect(result.variant).toBe("dark");
      expect(result.showArrow).toBe(true);
      expect(result.delayShow).toBe(300);
    });
  });
});
