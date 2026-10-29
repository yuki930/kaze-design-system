/**
 * Calendar-date helpers for DatePicker. Dates are plain "YYYY-MM-DD" strings so no
 * timezone can shift them; arithmetic goes through UTC for the same reason.
 * Internal: not exported from the barrel.
 */

import { normalizeNumericInput } from "../../lib/jaText";

export type Era = "gregorian" | "japanese";

export interface YMD {
  y: number;
  m: number;
  d: number;
}

/** 日曜日 ... 土曜日, indexed by `Date#getUTCDay()` */
export const WEEKDAY_NAMES = [
  "日曜日",
  "月曜日",
  "火曜日",
  "水曜日",
  "木曜日",
  "金曜日",
  "土曜日",
] as const;

export const WEEKDAY_SHORT = ["日", "月", "火", "水", "木", "金", "土"] as const;

const pad = (n: number, width: number) => String(n).padStart(width, "0");

export function toIso({ y, m, d }: YMD): string {
  return `${pad(y, 4)}-${pad(m, 2)}-${pad(d, 2)}`;
}

/** Strict parse of "YYYY-MM-DD". Rejects impossible dates such as 2026-02-30 */
export function parseIso(iso: string): YMD | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const ymd = { y: Number(match[1]), m: Number(match[2]), d: Number(match[3]) };
  return isRealDate(ymd) ? ymd : null;
}

export function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

function isRealDate({ y, m, d }: YMD): boolean {
  return y >= 1 && m >= 1 && m <= 12 && d >= 1 && d <= daysInMonth(y, m);
}

/** 0 (Sunday) ... 6 (Saturday) */
export function weekdayOf(iso: string): number {
  const ymd = parseIso(iso);
  return ymd ? new Date(Date.UTC(ymd.y, ymd.m - 1, ymd.d)).getUTCDay() : 0;
}

export function addDays(iso: string, days: number): string {
  const ymd = parseIso(iso);
  if (!ymd) return iso;
  const date = new Date(Date.UTC(ymd.y, ymd.m - 1, ymd.d + days));
  return toIso({ y: date.getUTCFullYear(), m: date.getUTCMonth() + 1, d: date.getUTCDate() });
}

/** Moves by whole months, clamping the day (Jan 31 + 1 month = Feb 28/29) */
export function addMonths(iso: string, months: number): string {
  const ymd = parseIso(iso);
  if (!ymd) return iso;
  const index = ymd.y * 12 + (ymd.m - 1) + months;
  const y = Math.floor(index / 12);
  const m = (index % 12) + 1;
  return toIso({ y, m, d: Math.min(ymd.d, daysInMonth(y, m)) });
}

export function clampIso(iso: string, min?: string, max?: string): string {
  if (min && iso < min) return min;
  if (max && iso > max) return max;
  return iso;
}

/** Today in the user's local calendar as "YYYY-MM-DD" */
export function todayIso(): string {
  const now = new Date();
  return toIso({ y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() });
}

/** The first day of the week containing `iso` */
export function startOfWeek(iso: string, weekStartsOn: 0 | 1): string {
  return addDays(iso, -((weekdayOf(iso) - weekStartsOn + 7) % 7));
}

/* ── Japanese eras ─────────────────────────────────────────── */

interface EraDef {
  name: string;
  letter: string;
  /** First day of the era (Gregorian) */
  start: string;
}

/** Oldest first. Matches the era boundaries ICU uses for the Japanese calendar */
const ERAS: EraDef[] = [
  { name: "明治", letter: "M", start: "1868-09-08" },
  { name: "大正", letter: "T", start: "1912-07-30" },
  { name: "昭和", letter: "S", start: "1926-12-25" },
  { name: "平成", letter: "H", start: "1989-01-08" },
  { name: "令和", letter: "R", start: "2019-05-01" },
];

/** Gregorian date for era-year `n` (元年 = 1). Null when the date falls outside that era */
function fromEra(eraIndex: number, n: number, m: number, d: number): string | null {
  const era = ERAS[eraIndex];
  const startYear = Number(era?.start.slice(0, 4));
  if (!era || n < 1) return null;
  const ymd = { y: startYear + n - 1, m, d };
  if (!isRealDate(ymd)) return null;
  const iso = toIso(ymd);
  const next = ERAS[eraIndex + 1];
  if (iso < era.start || (next && iso >= next.start)) return null;
  return iso;
}

function eraIndexOf(token: string): number {
  return ERAS.findIndex((era) => era.name === token || era.letter === token.toUpperCase());
}

const GREGORIAN_PATTERN = /^(\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})日?$/;
const COMPACT_PATTERN = /^(\d{4})(\d{2})(\d{2})$/;
const ERA_PATTERN =
  /^(明治|大正|昭和|平成|令和|[MTSHRmtshr])(元|\d{1,2})[-/.年](\d{1,2})[-/.月](\d{1,2})日?$/;

/**
 * Reads a date typed by a person. Accepts `2026/10/29`, `2026-10-29`, `2026.10.29`,
 * `20261029`, `2026年10月29日`, `令和8年10月29日`, `令和元年5月1日`, `R8.10.29`,
 * fullwidth digits and letters, and stray spaces. Returns "YYYY-MM-DD" or null when the
 * text is not a real date (including eras that did not cover that day, such as 平成31年5月1日).
 */
export function parseDateText(input: string): string | null {
  const text = normalizeNumericInput(input);
  if (text === "") return null;

  const gregorian = GREGORIAN_PATTERN.exec(text) ?? COMPACT_PATTERN.exec(text);
  if (gregorian) {
    const ymd = { y: Number(gregorian[1]), m: Number(gregorian[2]), d: Number(gregorian[3]) };
    return isRealDate(ymd) ? toIso(ymd) : null;
  }

  const era = ERA_PATTERN.exec(text);
  if (era) {
    const index = eraIndexOf(era[1] as string);
    const n = era[2] === "元" ? 1 : Number(era[2]);
    return index < 0 ? null : fromEra(index, n, Number(era[3]), Number(era[4]));
  }
  return null;
}

/* ── Formatting ────────────────────────────────────────────── */

let japaneseFormatter: Intl.DateTimeFormat | undefined;
let japaneseMonthFormatter: Intl.DateTimeFormat | undefined;

function utcDate({ y, m, d }: YMD): Date {
  const date = new Date(Date.UTC(2000, m - 1, d));
  date.setUTCFullYear(y);
  return date;
}

/** "2026年10月29日" or "令和8年10月29日" */
export function formatDate(iso: string, era: Era): string {
  const ymd = parseIso(iso);
  if (!ymd) return "";
  if (era === "gregorian") return `${ymd.y}年${ymd.m}月${ymd.d}日`;
  japaneseFormatter ??= new Intl.DateTimeFormat("ja-JP-u-ca-japanese", {
    era: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  return japaneseFormatter.format(utcDate(ymd));
}

/** "2026年10月" or "令和8年10月" (calendar heading) */
export function formatMonth(iso: string, era: Era): string {
  const ymd = parseIso(iso);
  if (!ymd) return "";
  if (era === "gregorian") return `${ymd.y}年${ymd.m}月`;
  japaneseMonthFormatter ??= new Intl.DateTimeFormat("ja-JP-u-ca-japanese", {
    era: "long",
    year: "numeric",
    month: "long",
    timeZone: "UTC",
  });
  return japaneseMonthFormatter.format(utcDate(ymd));
}

/** "2026年10月29日木曜日" or "令和8年10月29日木曜日" (day button label) */
export function formatDateWithWeekday(iso: string, era: Era): string {
  return `${formatDate(iso, era)}${WEEKDAY_NAMES[weekdayOf(iso)]}`;
}
