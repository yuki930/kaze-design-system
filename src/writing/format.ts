/**
 * Number formatters that follow the Kaze notation rules: yen with a half-width ¥, a real minus sign (−),
 * an explicit + only when asked, and 万 / 億 for large yen amounts. Inputs may be number, bigint or a
 * numeric string (API amounts are often strings so they do not lose precision).
 */

export type NumericInput = number | bigint | string;

const MINUS = "−";

function toBigInt(v: NumericInput): bigint | null {
  if (typeof v === "bigint") return v;
  if (typeof v === "number") return Number.isFinite(v) ? BigInt(Math.round(v)) : null;
  const t = v.trim();
  if (!/^-?\d+$/.test(t)) {
    const n = Number(t);
    return Number.isFinite(n) && t !== "" ? BigInt(Math.round(n)) : null;
  }
  return BigInt(t);
}

function sign(n: bigint | number, signed: boolean): string {
  if (n < 0) return MINUS;
  return signed && n > 0 ? "+" : "";
}

export interface FormatYenOptions {
  /** Prefix positive values with + (zero stays unsigned) */
  signed?: boolean;
  /** Text for values that cannot be read (default: "未設定") */
  empty?: string;
}

/** ¥1,234,567 / −¥500 / +¥0 is never produced: zero is always "¥0". */
export function formatYen(
  value: NumericInput | null | undefined,
  options: FormatYenOptions = {},
): string {
  const { signed = false, empty = "未設定" } = options;
  if (value === null || value === undefined) return empty;
  const n = toBigInt(value);
  if (n === null) return empty;
  const abs = n < 0n ? -n : n;
  return `${sign(n, signed)}¥${abs.toLocaleString("ja-JP")}`;
}

export interface FormatManYenOptions extends FormatYenOptions {
  /** Decimal places for the 万 part (default: 0) */
  digits?: number;
}

/**
 * Yen in 万 / 億 units for reading large amounts at a glance: 1億5,545万円, 9,200万円, 32.5万円.
 * Amounts under 1万 are shown in yen (8,400円).
 */
export function formatManYen(
  value: NumericInput | null | undefined,
  options: FormatManYenOptions = {},
): string {
  const { signed = false, empty = "未設定", digits = 0 } = options;
  if (value === null || value === undefined) return empty;
  const n = toBigInt(value);
  if (n === null) return empty;
  const s = sign(n, signed);
  const abs = Number(n < 0n ? -n : n);
  if (abs < 10_000) return `${s}${abs.toLocaleString("ja-JP")}円`;
  const oku = Math.floor(abs / 100_000_000);
  const man = (abs - oku * 100_000_000) / 10_000;
  const manText = man.toLocaleString("ja-JP", {
    maximumFractionDigits: oku > 0 ? 0 : digits,
    minimumFractionDigits: 0,
  });
  if (oku === 0) return `${s}${manText}万円`;
  return Math.round(man) === 0
    ? `${s}${oku.toLocaleString("ja-JP")}億円`
    : `${s}${oku.toLocaleString("ja-JP")}億${manText}万円`;
}

export interface FormatPercentOptions {
  /** Decimal places (default: 1) */
  digits?: number;
  /** Prefix positive values with + (default: false) */
  signed?: boolean;
  /** Text for values that cannot be read (default: "未設定") */
  empty?: string;
}

/** 12.3% / −4.0% / +1.2% (signed). The input is already a percentage (12.3 → "12.3%"). */
export function formatPercent(
  value: number | null | undefined,
  options: FormatPercentOptions = {},
): string {
  const { digits = 1, signed = false, empty = "未設定" } = options;
  if (value === null || value === undefined || !Number.isFinite(value)) return empty;
  const rounded = Number(value.toFixed(digits));
  return `${sign(rounded, signed)}${Math.abs(rounded).toFixed(digits)}%`;
}

/** Adds + / − to any formatter's output, e.g. formatSigned(-1200, (v) => `${v}件`) → "−1200件". */
export function formatSigned(value: number, format: (absolute: number) => string = String): string {
  if (!Number.isFinite(value)) return format(value);
  return `${sign(value, true)}${format(Math.abs(value))}`;
}
