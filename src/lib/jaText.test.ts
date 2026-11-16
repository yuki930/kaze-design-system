import { describe, expect, it } from "vitest";
import {
  includesJa,
  isComposingEvent,
  normalizeJa,
  normalizeNumericInput,
  isKanaOnly,
  toHiragana,
  toKatakana,
} from "./jaText";

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

describe("toKatakana / toHiragana", () => {
  it("converts kana and leaves everything else", () => {
    expect(toKatakana("さがら みさき")).toBe("サガラ ミサキ");
    expect(toKatakana("ゔぁー")).toBe("ヴァー");
    expect(toHiragana("サガラ・ミサキ")).toBe("さがら・みさき");
    expect(toHiragana("相楽ABC")).toBe("相楽ABC");
  });
});

describe("isKanaOnly", () => {
  it("accepts the reading an IME shows before conversion", () => {
    expect(isKanaOnly("さがら")).toBe(true);
    expect(isKanaOnly("サガラ")).toBe(true);
    expect(isKanaOnly("のの むら")).toBe(true);
  });
  it("rejects kanji, half-typed romaji and the empty string", () => {
    expect(isKanaOnly("相楽")).toBe(false);
    expect(isKanaOnly("さg")).toBe(false);
    expect(isKanaOnly("")).toBe(false);
  });
});
