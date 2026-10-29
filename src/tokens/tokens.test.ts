import { describe, expect, it } from "vitest";
import * as tokens from "./tokens";

/** Collects every "var(--x)" string from the hand-written token maps. */
function referencedNames(): string[] {
  const groups = [tokens.color, tokens.chart, tokens.space, tokens.radius, tokens.density];
  return groups.flatMap((group) =>
    Object.values(group).map((value) => value.replace(/^var\(--(.+)\)$/, "$1")),
  );
}

describe("tokens", () => {
  it("only references custom properties that tokens.css defines", () => {
    const defined = new Set<string>(tokens.tokenNames);
    const missing = referencedNames().filter((name) => !defined.has(name));
    expect(missing).toEqual([]);
  });

  it("cssVar builds a var() reference", () => {
    expect(tokens.cssVar("color-bg")).toBe("var(--color-bg)");
  });
});
