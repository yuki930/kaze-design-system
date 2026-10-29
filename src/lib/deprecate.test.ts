import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renamedProp, resetDeprecationWarnings, warnDeprecated } from "./deprecate";

describe("warnDeprecated", () => {
  beforeEach(() => {
    resetDeprecationWarnings();
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("warns once per key", () => {
    warnDeprecated("Badge.variant", "a");
    warnDeprecated("Badge.variant", "a");
    warnDeprecated("Alert.variant", "b");
    expect(console.warn).toHaveBeenCalledTimes(2);
    expect(console.warn).toHaveBeenCalledWith("[kaze] a");
  });

  it("stays silent in production builds", () => {
    vi.stubEnv("NODE_ENV", "production");
    warnDeprecated("Badge.variant", "a");
    expect(console.warn).not.toHaveBeenCalled();
  });
});

describe("renamedProp", () => {
  beforeEach(() => {
    resetDeprecationWarnings();
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("prefers the new prop and does not warn", () => {
    expect(renamedProp("Badge", "variant", "tone", "positive", "negative")).toBe("negative");
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("falls back to the old prop with a warning that names both props", () => {
    expect(renamedProp("Badge", "variant", "tone", "positive", undefined)).toBe("positive");
    expect(console.warn).toHaveBeenCalledTimes(1);
    const message = (console.warn as unknown as { mock: { calls: string[][] } }).mock.calls[0]?.[0];
    expect(message).toContain("Badge");
    expect(message).toContain("`variant`");
    expect(message).toContain("`tone`");
  });

  it("returns undefined when neither is set so the caller can apply its default", () => {
    expect(renamedProp("Badge", "variant", "tone", undefined, undefined)).toBeUndefined();
    expect(console.warn).not.toHaveBeenCalled();
  });
});
