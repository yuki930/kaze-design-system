/** Helpers for Japanese text input and matching. No runtime dependencies. */

/**
 * Normalize text for search matching the way Japanese users expect:
 * fullwidth to halfwidth (NFKC), katakana to hiragana, case-insensitive, trimmed.
 * "ﾃﾞｰﾀ", "データ", "でーた" all normalize to "でーた".
 */
export function normalizeJa(input: string): string {
  return input
    .normalize("NFKC")
    .replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60))
    .toLowerCase()
    .trim();
}

/** Case / width / kana insensitive substring match. */
export function includesJa(haystack: string, needle: string): boolean {
  const n = normalizeJa(needle);
  return n === "" || normalizeJa(haystack).includes(n);
}

/**
 * True while an IME composition is in progress. Enter during composition
 * confirms the conversion and must not submit, select, or close anything.
 * `keyCode === 229` covers browsers that do not set `isComposing` on keydown.
 */
export function isComposingEvent(event: { nativeEvent: Event }): boolean {
  const native = event.nativeEvent as KeyboardEvent;
  return native.isComposing === true || native.keyCode === 229;
}

/** Fullwidth / typographic minus signs that Japanese IMEs produce for "-". */
const MINUS_SIGNS = /[−－ー‐-―]/g;

/**
 * Normalize a typed numeric string: fullwidth digits and punctuation to ASCII,
 * any minus-like sign to "-", whitespace removed. Does not parse.
 */
export function normalizeNumericInput(input: string): string {
  return input.normalize("NFKC").replace(MINUS_SIGNS, "-").replace(/\s+/g, "");
}
