import rulesJson from "./rules.json";

/** Japanese characters (hiragana, katakana, kanji, the prolonged sound mark). Substituted for `{ja}` in rule patterns. */
const JA = "[\\p{sc=Hiragana}\\p{sc=Katakana}\\p{sc=Han}ー]";

export type CopyRuleLevel = "error" | "warning";
export type CopyRuleCategory = "notation" | "plain" | "clarity" | "ai";

/** How a rule rewrites a match: a replacement string ($1 works), a lookup table, or Unicode NFKC. */
export type CopyRuleFix = string | { map: Record<string, string> } | { nfkc: true };

export interface CopyRule {
  /** Stable id, e.g. "plain/kantan". Use it to enable or disable the rule. */
  id: string;
  /** notation: 表記 / plain: 開いた言葉 / clarity: 伝わる書き方 / ai: AI の文章に多い言い回し */
  category: CopyRuleCategory;
  /** error: always wrong in Kaze copy / warning: usually better rewritten, judge in context */
  level: CopyRuleLevel;
  /** Whether the rule runs when no options are given */
  default: boolean;
  /** RegExp source. `{ja}` stands for one Japanese character. */
  pattern: string;
  /** Present when the rule can rewrite the text by itself */
  fix?: CopyRuleFix;
  /** What to do, in plain Japanese */
  message: string;
  bad: string;
  good: string;
}

export const copyRules = rulesJson as CopyRule[];

export interface CopyIssue {
  ruleId: string;
  level: CopyRuleLevel;
  message: string;
  /** 1-based line */
  line: number;
  /** 1-based column (UTF-16 code units) */
  column: number;
  /** The matched text. Empty for rules that point at a gap, such as a missing space. */
  match: string;
  /** The text after the rule's fix, when it has one */
  suggestion?: string;
}

export interface CheckCopyOptions {
  /** Turn rules on or off by id. Rules not listed keep their default. */
  rules?: Record<string, boolean>;
  /**
   * How to read the text.
   * - "text" (default): every line is copy
   * - "code": only lines with Japanese are read, comment lines are skipped (TS, JSX, JS)
   * - "markdown": fenced code blocks are skipped
   */
  mode?: "text" | "code" | "markdown";
}

interface CompiledRule {
  rule: CopyRule;
  regex: RegExp;
}

const compiledCache = new Map<string, RegExp>();

function compile(rule: CopyRule): RegExp {
  const cached = compiledCache.get(rule.id);
  if (cached) return cached;
  const regex = new RegExp(rule.pattern.split("{ja}").join(JA), "gu");
  compiledCache.set(rule.id, regex);
  return regex;
}

function activeRules(options?: CheckCopyOptions): CompiledRule[] {
  const overrides = options?.rules ?? {};
  return copyRules
    .filter((rule) => overrides[rule.id] ?? rule.default)
    .map((rule) => ({ rule, regex: compile(rule) }));
}

function applyFix(fix: CopyRuleFix, match: string, groups: string[]): string {
  if (typeof fix === "string") {
    return fix.replace(/\$(\d)/g, (_, n: string) => groups[Number(n) - 1] ?? "");
  }
  if ("nfkc" in fix) return match.normalize("NFKC");
  return fix.map[match] ?? match;
}

const JA_TEST = new RegExp(JA, "u");
const COMMENT_LINE = /^\s*(\/\/|\/\*|\*|\{\/\*)/;
const FENCE = /^\s*(```|~~~)/;
const IGNORE_LINE = "kaze-copy-ignore";
const IGNORE_NEXT = "kaze-copy-ignore-next-line";
const IGNORE_START = "kaze-copy-ignore-start";
const IGNORE_END = "kaze-copy-ignore-end";

/**
 * Decide which lines are copy. Returns one flag per line.
 * Skipped: a line carrying `kaze-copy-ignore`, the line after
 * `kaze-copy-ignore-next-line`, and everything between `kaze-copy-ignore-start`
 * and `kaze-copy-ignore-end`.
 */
function copyLines(lines: string[], mode: CheckCopyOptions["mode"]): boolean[] {
  let inFence = false;
  let inIgnoredBlock = false;
  return lines.map((line, i) => {
    if (line.includes(IGNORE_START)) {
      inIgnoredBlock = true;
      return false;
    }
    if (line.includes(IGNORE_END)) {
      inIgnoredBlock = false;
      return false;
    }
    if (inIgnoredBlock) return false;
    if (line.includes(IGNORE_LINE) && !line.includes(IGNORE_NEXT)) return false;
    if (lines[i - 1]?.includes(IGNORE_NEXT)) return false;
    if (mode === "markdown") {
      if (FENCE.test(line)) {
        inFence = !inFence;
        return false;
      }
      return !inFence;
    }
    if (mode === "code") {
      return JA_TEST.test(line) && !COMMENT_LINE.test(line);
    }
    return true;
  });
}

/**
 * True when [start, end) sits inside 「」. Quoted words are mentions, such as a
 * guide saying 「こちら」にしない, not copy that a reader sees as a sentence.
 */
function insideQuotes(line: string, start: number, end: number): boolean {
  let depth = 0;
  for (let i = 0; i < start; i++) {
    if (line[i] === "「") depth++;
    else if (line[i] === "」" && depth > 0) depth--;
  }
  if (depth === 0) return false;
  const close = line.indexOf("」", start);
  return close !== -1 && close >= end;
}

/** Find copy that breaks the Kaze writing rules. Pure function, no I/O. */
export function checkCopy(text: string, options?: CheckCopyOptions): CopyIssue[] {
  const rules = activeRules(options);
  const lines = text.split("\n");
  const include = copyLines(lines, options?.mode);
  const issues: CopyIssue[] = [];

  lines.forEach((line, index) => {
    if (!include[index]) return;
    for (const { rule, regex } of rules) {
      regex.lastIndex = 0;
      for (const m of line.matchAll(regex)) {
        const match = m[0];
        const start = m.index ?? 0;
        if (insideQuotes(line, start, start + match.length)) continue;
        const groups = m.slice(1) as string[];
        issues.push({
          ruleId: rule.id,
          level: rule.level,
          message: rule.message,
          line: index + 1,
          column: start + 1,
          match,
          suggestion: rule.fix === undefined ? undefined : applyFix(rule.fix, match, groups),
        });
      }
    }
  });

  return issues.sort((a, b) => a.line - b.line || a.column - b.column);
}

/** Rewrite everything the active rules can fix by themselves. Rules without a fix are left as they are. */
export function fixCopy(text: string, options?: CheckCopyOptions): string {
  const rules = activeRules(options).filter(({ rule }) => rule.fix !== undefined);
  const lines = text.split("\n");
  const include = copyLines(lines, options?.mode);

  return lines
    .map((line, index) => {
      if (!include[index]) return line;
      let next = line;
      for (const { rule, regex } of rules) {
        const fix = rule.fix as CopyRuleFix;
        regex.lastIndex = 0;
        next = next.replace(regex, (match: string, ...rest: unknown[]) => {
          // replace() passes captures, then offset, then the whole string
          const offset = rest.find((v): v is number => typeof v === "number") ?? 0;
          const source = rest[rest.length - 1] as string;
          if (insideQuotes(source, offset, offset + match.length)) return match;
          const groups = rest.filter((v): v is string => typeof v === "string").slice(0, -1);
          return applyFix(fix, match, groups);
        });
      }
      return next;
    })
    .join("\n");
}
