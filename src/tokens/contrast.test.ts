import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Every palette, in light and dark, must keep text readable (WCAG AA 4.5:1).
 * Reads the DTCG token files directly so a new palette is checked as soon as
 * its files exist.
 */
type TokenFile = Record<string, Record<string, { $value: string }>>;
const dir = path.resolve(__dirname, "../../tokens");
const read = (name: string): TokenFile =>
  JSON.parse(fs.readFileSync(path.join(dir, `${name}.tokens.json`), "utf8"));

const base = read("base");
const flat = (file: TokenFile) =>
  Object.fromEntries(
    Object.values(file).flatMap((tier) => Object.entries(tier).map(([k, t]) => [k, t.$value])),
  );

function resolve(values: Record<string, string>, name: string): string {
  let v = values[name] ?? "";
  for (let i = 0; i < 5 && v.startsWith("{"); i++)
    v = values[v.slice(1, -1).split(".")[1] ?? ""] ?? "";
  return v;
}

function luminance(hex: string): number {
  const [r = 0, g = 0, b = 0] = (hex.replace("#", "").match(/../g) ?? [])
    .map((h) => Number.parseInt(h, 16) / 255)
    .map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** [text, background] pairs that carry readable text */
const PAIRS: [string, string][] = [
  ["color-fg", "color-bg"],
  ["color-fg-secondary", "color-bg"],
  ["color-fg-tertiary", "color-bg"],
  ["color-fg-muted", "color-bg-secondary"],
  ["color-primary-fg", "color-primary"],
  ["color-secondary-fg", "color-secondary"],
];

const palettes: { name: string; layers: string[] }[] = [
  { name: "warm light", layers: [] },
  { name: "warm dark", layers: ["dark"] },
  ...["cool", "ink", "indigo"].flatMap((p) => [
    { name: `${p} light`, layers: [p] },
    { name: `${p} dark`, layers: ["dark", `${p}-dark`] },
  ]),
];

describe("palette contrast", () => {
  for (const { name, layers } of palettes) {
    it(`${name}: text pairs reach 4.5:1`, () => {
      const values = Object.assign(flat(base), ...layers.map((l) => flat(read(l))));
      for (const [fg, bg] of PAIRS) {
        const a = resolve(values, fg);
        const b = resolve(values, bg);
        expect(a, `${fg} resolves to a hex color`).toMatch(/^#[0-9a-f]{6}$/i);
        expect(ratio(a, b), `${fg} on ${bg} (${a} on ${b})`).toBeGreaterThanOrEqual(4.5);
      }
    });
  }
});
