import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { computePlacement, VIEWPORT_MARGIN } from "./position";

const VW = 1000;
const VH = 800;

function rect(left: number, top: number, width: number, height: number): DOMRect {
  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  } as DOMRect;
}

let originalWidth: number;
let originalHeight: number;
beforeEach(() => {
  originalWidth = window.innerWidth;
  originalHeight = window.innerHeight;
  Object.defineProperty(window, "innerWidth", { configurable: true, value: VW });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: VH });
});
afterEach(() => {
  Object.defineProperty(window, "innerWidth", { configurable: true, value: originalWidth });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: originalHeight });
});

describe("computePlacement", () => {
  describe("vertical sides", () => {
    const trigger = rect(300, 300, 80, 20);
    const panel = { width: 200, height: 100 };

    it("places below the trigger with start alignment", () => {
      expect(computePlacement(trigger, panel, "bottom", "start", 8)).toEqual({
        side: "bottom",
        top: 328,
        left: 300,
      });
    });

    it("centers horizontally on the trigger", () => {
      expect(computePlacement(trigger, panel, "bottom", "center", 8).left).toBe(240);
    });

    it("aligns the panel's right edge with the trigger for end", () => {
      expect(computePlacement(trigger, panel, "bottom", "end", 8).left).toBe(180);
    });

    it("places above the trigger", () => {
      expect(computePlacement(trigger, panel, "top", "start", 8)).toEqual({
        side: "top",
        top: 192,
        left: 300,
      });
    });

    it("flips from top to bottom when there is no room above", () => {
      const nearTop = rect(300, 50, 80, 20);
      expect(computePlacement(nearTop, panel, "top", "start", 8)).toEqual({
        side: "bottom",
        top: 78,
        left: 300,
      });
    });

    it("flips from bottom to top when there is no room below", () => {
      const nearBottom = rect(300, 750, 80, 20);
      expect(computePlacement(nearBottom, panel, "bottom", "start", 8)).toEqual({
        side: "top",
        top: 642,
        left: 300,
      });
    });

    it("keeps the preferred side and clamps when neither side fits", () => {
      const tall = { width: 200, height: 700 };
      const middle = rect(300, 380, 80, 20);
      expect(computePlacement(middle, tall, "bottom", "start", 8)).toEqual({
        side: "bottom",
        top: VH - 700 - VIEWPORT_MARGIN,
        left: 300,
      });
    });

    it("clamps to the left viewport margin", () => {
      const nearLeft = rect(0, 300, 40, 20);
      expect(computePlacement(nearLeft, panel, "bottom", "end", 8).left).toBe(VIEWPORT_MARGIN);
    });

    it("clamps to the right viewport margin", () => {
      const nearRight = rect(950, 300, 40, 20);
      expect(computePlacement(nearRight, panel, "bottom", "start", 8).left).toBe(
        VW - 200 - VIEWPORT_MARGIN,
      );
    });
  });

  describe("horizontal sides", () => {
    const trigger = rect(300, 300, 80, 20);
    const panel = { width: 100, height: 50 };

    it("places to the left with start alignment", () => {
      expect(computePlacement(trigger, panel, "left", "start", 8)).toEqual({
        side: "left",
        top: 300,
        left: 192,
      });
    });

    it("centers vertically on the trigger", () => {
      expect(computePlacement(trigger, panel, "left", "center", 8).top).toBe(285);
    });

    it("aligns the panel's bottom edge with the trigger for end", () => {
      expect(computePlacement(trigger, panel, "right", "end", 8).top).toBe(270);
    });

    it("places to the right of the trigger", () => {
      expect(computePlacement(trigger, panel, "right", "start", 8)).toEqual({
        side: "right",
        top: 300,
        left: 388,
      });
    });

    it("flips from left to right when there is no room on the left", () => {
      const nearLeft = rect(50, 300, 80, 20);
      expect(computePlacement(nearLeft, panel, "left", "start", 8)).toEqual({
        side: "right",
        top: 300,
        left: 138,
      });
    });

    it("flips from right to left when there is no room on the right", () => {
      const nearRight = rect(900, 300, 80, 20);
      expect(computePlacement(nearRight, panel, "right", "start", 8)).toEqual({
        side: "left",
        top: 300,
        left: 792,
      });
    });

    it("clamps to the top viewport margin", () => {
      const nearTop = rect(300, 0, 80, 20);
      expect(computePlacement(nearTop, panel, "right", "end", 8).top).toBe(VIEWPORT_MARGIN);
    });

    it("keeps the preferred side and clamps when neither side fits", () => {
      const wide = { width: 600, height: 50 };
      const middle = rect(450, 300, 80, 20);
      expect(computePlacement(middle, wide, "right", "start", 8)).toEqual({
        side: "right",
        top: 300,
        left: VW - 600 - VIEWPORT_MARGIN,
      });
    });
  });
});
