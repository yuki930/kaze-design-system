import { describe, expect, it } from "vitest";
import {
  addDays,
  addMonths,
  clampIso,
  daysInMonth,
  formatDate,
  formatDateWithWeekday,
  formatMonth,
  parseDateText,
  parseIso,
  startOfWeek,
  weekdayOf,
} from "./dateUtils";

describe("parseDateText", () => {
  it.each([
    ["2026/10/29", "2026-10-29"],
    ["2026-10-29", "2026-10-29"],
    ["2026.10.29", "2026-10-29"],
    ["2026/1/2", "2026-01-02"],
    ["20261029", "2026-10-29"],
    ["2026年10月29日", "2026-10-29"],
    ["2026年10月29", "2026-10-29"],
    ["２０２６／１０／２９", "2026-10-29"],
    ["２０２６年１０月２９日", "2026-10-29"],
    ["２０２６１０２９", "2026-10-29"],
    ["  2026 / 10 / 29  ", "2026-10-29"],
    ["2026ー10ー29", "2026-10-29"],
    ["令和8年10月29日", "2026-10-29"],
    ["令和８年１０月２９日", "2026-10-29"],
    ["令和8/10/29", "2026-10-29"],
    ["令和元年5月1日", "2019-05-01"],
    ["令和1年5月1日", "2019-05-01"],
    ["平成31年4月30日", "2019-04-30"],
    ["平成元年1月8日", "1989-01-08"],
    ["昭和64年1月7日", "1989-01-07"],
    ["昭和21年11月3日", "1946-11-03"],
    ["大正15年12月24日", "1926-12-24"],
    ["明治45年7月29日", "1912-07-29"],
    ["R8.10.29", "2026-10-29"],
    ["r8.10.29", "2026-10-29"],
    ["Ｒ８．１０．２９", "2026-10-29"],
    ["R1.5.1", "2019-05-01"],
    ["R元.5.1", "2019-05-01"],
    ["H31.4.30", "2019-04-30"],
    ["S64.1.7", "1989-01-07"],
    ["T15/12/24", "1926-12-24"],
    ["M45-7-29", "1912-07-29"],
  ])("reads %s as %s", (input, expected) => {
    expect(parseDateText(input)).toBe(expected);
  });

  it.each([
    "",
    "   ",
    "abc",
    "2026",
    "2026/10",
    "26/10/29",
    "2026/13/01",
    "2026/00/10",
    "2026/02/30",
    "2023/02/29",
    "20261340",
    "令和8年",
    "令和0年1月1日",
    "R0.1.1",
    // The era did not cover that day
    "平成31年5月1日",
    "令和元年4月30日",
    "昭和64年1月8日",
    "平成元年1月7日",
    "大正1年7月29日",
    "X8.10.29",
  ])("rejects %j", (input) => {
    expect(parseDateText(input)).toBeNull();
  });

  it("accepts a real leap day", () => {
    expect(parseDateText("2024/02/29")).toBe("2024-02-29");
    expect(parseDateText("R6.2.29")).toBe("2024-02-29");
  });
});

describe("formatDate", () => {
  it("writes Gregorian dates without padding", () => {
    expect(formatDate("2026-10-29", "gregorian")).toBe("2026年10月29日");
    expect(formatDate("2026-01-05", "gregorian")).toBe("2026年1月5日");
  });

  it("writes Japanese-era dates through Intl", () => {
    expect(formatDate("2026-10-29", "japanese")).toBe("令和8年10月29日");
    expect(formatDate("2019-05-01", "japanese")).toBe("令和元年5月1日");
    expect(formatDate("2019-04-30", "japanese")).toBe("平成31年4月30日");
    expect(formatDate("1989-01-08", "japanese")).toBe("平成元年1月8日");
    expect(formatDate("1989-01-07", "japanese")).toBe("昭和64年1月7日");
  });

  it("does not shift the day in any timezone (no Date-local conversion)", () => {
    expect(formatDate("2026-01-01", "japanese")).toBe("令和8年1月1日");
    expect(formatDate("2026-12-31", "japanese")).toBe("令和8年12月31日");
  });

  it("round-trips through parseDateText in both eras", () => {
    for (const iso of ["2026-10-29", "2019-05-01", "2019-04-30", "1989-01-07", "1989-01-08"]) {
      expect(parseDateText(formatDate(iso, "japanese"))).toBe(iso);
      expect(parseDateText(formatDate(iso, "gregorian"))).toBe(iso);
    }
  });

  it("returns an empty string for an invalid iso", () => {
    expect(formatDate("2026-02-30", "gregorian")).toBe("");
  });

  it("formats headings and day labels", () => {
    expect(formatMonth("2026-10-01", "gregorian")).toBe("2026年10月");
    expect(formatMonth("2026-10-01", "japanese")).toBe("令和8年10月");
    expect(formatDateWithWeekday("2026-10-29", "gregorian")).toBe("2026年10月29日木曜日");
    expect(formatDateWithWeekday("2026-10-29", "japanese")).toBe("令和8年10月29日木曜日");
  });
});

describe("calendar arithmetic", () => {
  it("validates ISO strings strictly", () => {
    expect(parseIso("2026-10-29")).toEqual({ y: 2026, m: 10, d: 29 });
    expect(parseIso("2026-2-9")).toBeNull();
    expect(parseIso("2026-02-30")).toBeNull();
    expect(parseIso("")).toBeNull();
  });

  it("knows month lengths and weekdays", () => {
    expect(daysInMonth(2026, 2)).toBe(28);
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2026, 10)).toBe(31);
    expect(weekdayOf("2026-10-29")).toBe(4); // Thursday
    expect(weekdayOf("2026-11-01")).toBe(0); // Sunday
  });

  it("adds days across month and year edges", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
    expect(addDays("2026-01-01", -1)).toBe("2025-12-31");
    expect(addDays("2026-10-29", 7)).toBe("2026-11-05");
  });

  it("adds months clamping the day", () => {
    expect(addMonths("2026-01-31", 1)).toBe("2026-02-28");
    expect(addMonths("2024-01-31", 1)).toBe("2024-02-29");
    expect(addMonths("2026-12-15", 1)).toBe("2027-01-15");
    expect(addMonths("2026-01-15", -1)).toBe("2025-12-15");
    expect(addMonths("2026-10-29", 12)).toBe("2027-10-29");
  });

  it("finds the start of the week for both week starts", () => {
    expect(startOfWeek("2026-10-29", 0)).toBe("2026-10-25"); // Sunday
    expect(startOfWeek("2026-10-29", 1)).toBe("2026-10-26"); // Monday
    expect(startOfWeek("2026-10-25", 1)).toBe("2026-10-19");
    expect(startOfWeek("2026-10-25", 0)).toBe("2026-10-25");
  });

  it("clamps to a range", () => {
    expect(clampIso("2026-10-01", "2026-10-10", "2026-10-20")).toBe("2026-10-10");
    expect(clampIso("2026-10-30", "2026-10-10", "2026-10-20")).toBe("2026-10-20");
    expect(clampIso("2026-10-15", "2026-10-10", "2026-10-20")).toBe("2026-10-15");
    expect(clampIso("2026-10-15")).toBe("2026-10-15");
  });
});
