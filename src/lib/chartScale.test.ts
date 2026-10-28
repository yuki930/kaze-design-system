import { describe, expect, it } from "vitest";
import { linearScale, niceScale } from "./chartScale";

describe("niceScale", () => {
  it("includes zero and rounds to a clean step", () => {
    const s = niceScale(12, 87);
    expect(s.min).toBe(0);
    expect(s.max).toBe(100);
    expect(s.ticks).toEqual([0, 25, 50, 75, 100]);
  });

  it("handles negative ranges", () => {
    const s = niceScale(-30, 45);
    expect(s.min).toBeLessThanOrEqual(-30);
    expect(s.max).toBeGreaterThanOrEqual(45);
    expect(s.ticks).toContain(0);
  });

  it("avoids float drift on small steps", () => {
    const s = niceScale(0, 0.7);
    for (const t of s.ticks) expect(String(t).length).toBeLessThan(6);
  });

  it("handles a flat series", () => {
    const s = niceScale(0, 0);
    expect(s.max).toBeGreaterThan(s.min);
  });
});

describe("linearScale", () => {
  it("maps domain to range (inverted y axis)", () => {
    const y = linearScale([0, 100], [200, 0]);
    expect(y(0)).toBe(200);
    expect(y(50)).toBe(100);
    expect(y(100)).toBe(0);
  });
});
