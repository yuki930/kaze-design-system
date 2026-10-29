import { describe, expect, it } from "vitest";
import { includesJa, isComposingEvent, normalizeJa, normalizeNumericInput } from "./jaText";

describe("normalizeJa", () => {
  it("folds width, kana and case", () => {
    expect(normalizeJa("ﾃﾞｰﾀ")).toBe("でーた");
    expect(normalizeJa("データ")).toBe("でーた");
    expect(normalizeJa("Ｋａｚｅ")).toBe("kaze");
  });
});

describe("includesJa", () => {
  it("matches hiragana query against katakana label", () => {
    expect(includesJa("ダッシュボードを開く", "だっしゅ")).toBe(true);
    expect(includesJa("設定", "せってい")).toBe(false);
  });
});

describe("isComposingEvent", () => {
  it("detects composition via isComposing or keyCode 229", () => {
    expect(isComposingEvent({ nativeEvent: { isComposing: true } as KeyboardEvent })).toBe(true);
    expect(isComposingEvent({ nativeEvent: { keyCode: 229 } as KeyboardEvent })).toBe(true);
    expect(
      isComposingEvent({ nativeEvent: { isComposing: false, keyCode: 13 } as KeyboardEvent }),
    ).toBe(false);
  });
});

describe("normalizeNumericInput", () => {
  it("converts fullwidth digits and minus signs", () => {
    expect(normalizeNumericInput("１２３")).toBe("123");
    expect(normalizeNumericInput("－１，０００")).toBe("-1,000");
    expect(normalizeNumericInput(" 1 000 ")).toBe("1000");
  });
});
