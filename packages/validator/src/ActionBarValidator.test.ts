import { describe, it, expect } from "vitest";
import { ActionBarValidator } from "./ActionBarValidator";
import type { ActionBar } from "@cosmo/core-schema";

const validator = new ActionBarValidator();

const validBar: ActionBar = {
  id: "bar-1",
  position: "bottom",
  variant: "solid",
  showLabels: false,
  visible: true,
  items: [
    { id: "home", icon: "home", label: "Home" },
    { id: "search", icon: "search", label: "Search" },
  ],
};

describe("ActionBarValidator", () => {
  describe("validate", () => {
    describe("required fields", () => {
      it("should pass validation for valid bar", () => {
        const result = validator.validate(validBar);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it("should fail when id is missing", () => {
        const bar = { ...validBar, id: "" };
        const result = validator.validate(bar);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "id" })
        );
      });

      it("should fail when items is empty", () => {
        const bar = { ...validBar, items: [] };
        const result = validator.validate(bar);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "items" })
        );
      });
    });

    describe("items validation", () => {
      it("should warn when too many items", () => {
        const bar = {
          ...validBar,
          items: Array(8)
            .fill(null)
            .map((_, i) => ({ id: `item-${i}`, icon: "home" as const, label: `Item ${i}` })),
        };
        const result = validator.validate(bar);
        expect(result.warnings).toContainEqual(
          expect.objectContaining({ field: "items" })
        );
      });

      it("should fail when item has no id", () => {
        const bar = {
          ...validBar,
          items: [{ id: "", icon: "home" as const, label: "Home" }],
        };
        const result = validator.validate(bar);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "items[0].id" })
        );
      });

      it("should fail when item has no label", () => {
        const bar = {
          ...validBar,
          items: [{ id: "home", icon: "home" as const, label: "" }],
        };
        const result = validator.validate(bar);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "items[0].label" })
        );
      });

      it("should warn when label exceeds max length", () => {
        const bar = {
          ...validBar,
          items: [{ id: "home", icon: "home" as const, label: "a".repeat(20) }],
        };
        const result = validator.validate(bar);
        expect(result.warnings).toContainEqual(
          expect.objectContaining({ field: "items[0].label" })
        );
      });

      it("should fail on duplicate item IDs", () => {
        const bar = {
          ...validBar,
          items: [
            { id: "home", icon: "home" as const, label: "Home" },
            { id: "home", icon: "search" as const, label: "Search" },
          ],
        };
        const result = validator.validate(bar);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({
            field: "items",
            message: expect.stringContaining("Duplicate"),
          })
        );
      });
    });

    describe("position validation", () => {
      it("should fail on invalid position", () => {
        const bar = { ...validBar, position: "invalid" as any };
        const result = validator.validate(bar);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "position" })
        );
      });
    });

    describe("variant validation", () => {
      it("should fail on invalid variant", () => {
        const bar = { ...validBar, variant: "invalid" as any };
        const result = validator.validate(bar);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: "variant" })
        );
      });
    });
  });

  describe("sanitize", () => {
    it("should generate id if missing", () => {
      const bar = { items: [{ id: "a", icon: "home" as const, label: "Home" }] } as any;
      const result = validator.sanitize(bar);
      expect(result.id).toMatch(/^actionbar-\d+$/);
    });

    it("should truncate items to max count", () => {
      const bar = {
        ...validBar,
        items: Array(10)
          .fill(null)
          .map((_, i) => ({ id: `item-${i}`, icon: "home" as const, label: `Item ${i}` })),
      };
      const result = validator.sanitize(bar);
      expect(result.items.length).toBeLessThanOrEqual(6);
    });

    it("should apply defaults for missing optional fields", () => {
      const bar = {
        id: "test",
        items: [{ id: "a", icon: "home" as const, label: "Home" }],
      } as any;
      const result = validator.sanitize(bar);
      expect(result.position).toBe("bottom");
      expect(result.variant).toBe("solid");
      expect(result.showLabels).toBe(false);
      expect(result.visible).toBe(true);
    });

    it("should cap badge count", () => {
      const bar = {
        ...validBar,
        items: [{ id: "a", icon: "home" as const, label: "Home", badge: 150 }],
      };
      const result = validator.sanitize(bar);
      expect(result.items[0].badge).toBeLessThanOrEqual(99);
    });
  });
});
