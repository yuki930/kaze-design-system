import { describe, expect, it } from "vitest";
import { formatManYen, formatPercent, formatSigned, formatYen } from "./format";

describe("formatYen", () => {
  it("formats number, bigint and string with a real minus sign", () => {
    expect(formatYen(1234567)).toBe("¥1,234,567");
    expect(formatYen(-500n)).toBe("−¥500");
    expect(formatYen("98765432101234567")).toBe("¥98,765,432,101,234,567");
  });
  it("adds + only when signed, never to zero", () => {
    expect(formatYen(1200, { signed: true })).toBe("+¥1,200");
    expect(formatYen(0, { signed: true })).toBe("¥0");
  });
  it("uses words for missing values", () => {
    expect(formatYen(null)).toBe("未設定");
    expect(formatYen("abc", { empty: "未取得" })).toBe("未取得");
  });
});

describe("formatManYen", () => {
  it("switches to 万 and 億", () => {
    expect(formatManYen(8400)).toBe("8,400円");
    expect(formatManYen(92_000_000)).toBe("9,200万円");
    expect(formatManYen(155_452_213)).toBe("1億5,545万円");
    expect(formatManYen(300_000_000)).toBe("3億円");
  });
  it("keeps decimals below 1億 when asked", () => {
    expect(formatManYen(325_000, { digits: 1 })).toBe("32.5万円");
    expect(formatManYen(-1_200_000, { signed: true })).toBe("−120万円");
  });
});

describe("formatPercent / formatSigned", () => {
  it("formats percentages", () => {
    expect(formatPercent(12.345)).toBe("12.3%");
    expect(formatPercent(1.2, { signed: true })).toBe("+1.2%");
    expect(formatPercent(-4)).toBe("−4.0%");
    expect(formatPercent(Number.NaN)).toBe("未設定");
  });
  it("signs any formatter", () => {
    expect(formatSigned(-1200, (v) => `${v}件`)).toBe("−1200件");
    expect(formatSigned(3, (v) => `${v}件`)).toBe("+3件");
    expect(formatSigned(0)).toBe("0");
  });
});
