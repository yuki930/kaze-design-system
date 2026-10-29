import { describe, expect, it } from "vitest";
import { withUniqueKeys } from "./uniqueKeys";

describe("withUniqueKeys", () => {
  it("keeps the label as the key when it is unique", () => {
    expect(withUniqueKeys(["a", "b"], (x) => x).map((r) => r.key)).toEqual(["a", "b"]);
  });

  it("numbers repeated labels from the second occurrence", () => {
    expect(withUniqueKeys(["a", "b", "a", "a"], (x) => x).map((r) => r.key)).toEqual([
      "a",
      "b",
      "a#2",
      "a#3",
    ]);
  });

  it("returns the original items in order", () => {
    const items = [{ label: "x" }, { label: "x" }];
    expect(withUniqueKeys(items, (i) => i.label).map((r) => r.item)).toEqual(items);
  });
});
