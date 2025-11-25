import { describe, it, expect } from "vitest";
import { HUDCardValidator } from "./HUDCardValidator";
import type { HUDCard } from "@cosmo/core-schema";

const validator = new HUDCardValidator();

const validCard: HUDCard = {
  id: "test-1",
  title: "Test Card",
  content: "Test content",
  variant: "info",
  priority: 3,
  position: "top-right",
  icon: "info",
  dismissible: true,
  autoHideAfterSeconds: null,
  actions: [],
};

describe("HUDCardValidator", () => {
  describe("validate", () => {
    describe("required fields", () => {
      it("should pass validation for valid card", () => {
        const result = validator.validate(validCard);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it("should fail when id is missing", () => {
        const card = { ...validCard, id: "" };
        const result = validator.validate(card);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "id" })
        );
      });

      it("should fail when title is missing", () => {
        const card = { ...validCard, title: "" };
        const result = validator.validate(card);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "title" })
        );
      });

      it("should fail when content is missing", () => {
        const card = { ...validCard, content: "" };
        const result = validator.validate(card);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "content" })
        );
      });
    });

    describe("length constraints", () => {
      it("should fail when title exceeds max length", () => {
        const card = { ...validCard, title: "a".repeat(100) };
        const result = validator.validate(card);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "title" })
        );
      });

      it("should fail when content exceeds max length", () => {
        const card = { ...validCard, content: "a".repeat(500) };
        const result = validator.validate(card);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "content" })
        );
      });
    });

    describe("actions constraints", () => {
      it("should fail when too many actions", () => {
        const card = {
          ...validCard,
          actions: [
            { label: "A1", actionId: "1" },
            { label: "A2", actionId: "2" },
            { label: "A3", actionId: "3" },
            { label: "A4", actionId: "4" },
          ],
        };
        const result = validator.validate(card);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "actions" })
        );
      });

      it("should fail when action label exceeds max length", () => {
        const card = {
          ...validCard,
          actions: [{ label: "a".repeat(30), actionId: "1" }],
        };
        const result = validator.validate(card);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "actions[0].label" })
        );
      });
    });

    describe("auto-hide constraints", () => {
      it("should warn when autoHide is below minimum", () => {
        const card = { ...validCard, autoHideAfterSeconds: 0.5 };
        const result = validator.validate(card);
        expect(result.valid).toBe(true);
        expect(result.warnings).toContainEqual(
          expect.objectContaining({ field: "autoHideAfterSeconds" })
        );
      });

      it("should warn when autoHide is above maximum", () => {
        const card = { ...validCard, autoHideAfterSeconds: 120 };
        const result = validator.validate(card);
        expect(result.valid).toBe(true);
        expect(result.warnings).toContainEqual(
          expect.objectContaining({ field: "autoHideAfterSeconds" })
        );
      });
    });

    describe("priority overrides", () => {
      it("should warn when high priority card has autoHide", () => {
        const card = { ...validCard, priority: 5, autoHideAfterSeconds: 10 };
        const result = validator.validate(card);
        expect(result.warnings).toContainEqual(
          expect.objectContaining({
            field: "autoHideAfterSeconds",
            message: expect.stringContaining("priority >= 4"),
          })
        );
      });

      it("should warn when high priority card is dismissible", () => {
        const card = { ...validCard, priority: 4, dismissible: true };
        const result = validator.validate(card);
        expect(result.warnings).toContainEqual(
          expect.objectContaining({
            field: "dismissible",
            message: expect.stringContaining("priority >= 4"),
          })
        );
      });
    });

    describe("metadata validation", () => {
      it("should fail on invalid anchorType", () => {
        const card = {
          ...validCard,
          metadata: { anchorType: "invalid" as any },
        };
        const result = validator.validate(card);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "metadata.anchorType" })
        );
      });

      it("should fail on invalid worldPosition format", () => {
        const card = {
          ...validCard,
          metadata: { anchorType: "world-space" as const, worldPosition: [1, 2] as any },
        };
        const result = validator.validate(card);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "metadata.worldPosition" })
        );
      });

      it("should warn when worldPosition used with screen-space", () => {
        const card = {
          ...validCard,
          metadata: {
            anchorType: "screen-space" as const,
            worldPosition: [0, 1, 2] as [number, number, number],
          },
        };
        const result = validator.validate(card);
        expect(result.warnings).toContainEqual(
          expect.objectContaining({
            field: "metadata.worldPosition",
            message: expect.stringContaining("ignored"),
          })
        );
      });

      it("should fail on invalid autoAnchor value", () => {
        const card = {
          ...validCard,
          metadata: {
            anchorType: "world-space" as const,
            autoAnchor: "invalid" as any,
          },
        };
        const result = validator.validate(card);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "metadata.autoAnchor" })
        );
      });

      it("should fail on invalid autoAnchorDistance", () => {
        const card = {
          ...validCard,
          metadata: {
            anchorType: "world-space" as const,
            autoAnchor: "gaze" as const,
            autoAnchorDistance: -1,
          },
        };
        const result = validator.validate(card);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "metadata.autoAnchorDistance" })
        );
      });
    });
  });

  describe("sanitize", () => {
    it("should generate id if missing", () => {
      const card = { title: "Test", content: "Content" };
      const result = validator.sanitize(card);
      expect(result.id).toMatch(/^card-\d+$/);
    });

    it("should truncate title to max length", () => {
      const card = { ...validCard, title: "a".repeat(100) };
      const result = validator.sanitize(card);
      expect(result.title.length).toBeLessThanOrEqual(60);
    });

    it("should truncate content to max length", () => {
      const card = { ...validCard, content: "a".repeat(500) };
      const result = validator.sanitize(card);
      expect(result.content.length).toBeLessThanOrEqual(200);
    });

    it("should truncate actions to max count", () => {
      const card = {
        ...validCard,
        actions: [
          { label: "A1", actionId: "1" },
          { label: "A2", actionId: "2" },
          { label: "A3", actionId: "3" },
          { label: "A4", actionId: "4" },
        ],
      };
      const result = validator.sanitize(card);
      expect(result.actions?.length).toBeLessThanOrEqual(2);
    });

    it("should apply defaults for missing optional fields", () => {
      const card = { id: "test", title: "Test", content: "Content" };
      const result = validator.sanitize(card);
      expect(result.variant).toBe("neutral");
      expect(result.priority).toBe(3);
      expect(result.position).toBe("top-right");
      expect(result.icon).toBe("none");
      expect(result.dismissible).toBe(true);
    });

    it("should force high priority cards to not be dismissible", () => {
      const card = { ...validCard, priority: 5, dismissible: true };
      const result = validator.sanitize(card);
      expect(result.dismissible).toBe(false);
    });

    it("should remove autoHide from high priority cards", () => {
      const card = { ...validCard, priority: 4, autoHideAfterSeconds: 10 };
      const result = validator.sanitize(card);
      expect(result.autoHideAfterSeconds).toBeNull();
    });
  });
});
