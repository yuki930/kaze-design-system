import { describe, expect, it } from "vitest";
import { checkCopy, copyRules, fixCopy, writingGuide } from "./index";

/** Options that turn on exactly one rule */
const only = (id: string) => ({
  rules: Object.fromEntries(copyRules.map((r) => [r.id, r.id === id])),
});

const ids = (text: string, options?: Parameters<typeof checkCopy>[1]) =>
  checkCopy(text, options).map((i) => i.ruleId);

describe("copy rules", () => {
  it("have unique ids and compile", () => {
    const seen = new Set<string>();
    for (const rule of copyRules) {
      expect(seen.has(rule.id), rule.id).toBe(false);
      seen.add(rule.id);
      expect(() => checkCopy("", only(rule.id))).not.toThrow();
    }
  });

  // Every rule documents a bad and a good example. The bad one must be caught,
  // the good one must pass, and a fixable rule must clear its own finding.
  for (const rule of copyRules) {
    const placeholder = rule.bad.startsWith("（");
    it(`${rule.id}: catches its bad example and passes its good one`, () => {
      if (!placeholder) expect(ids(rule.bad, only(rule.id))).toContain(rule.id);
      if (!rule.good.startsWith("（")) expect(ids(rule.good, only(rule.id))).toEqual([]);
    });
    if (rule.fix !== undefined && !placeholder) {
      it(`${rule.id}: fixCopy clears the finding`, () => {
        const fixed = fixCopy(rule.bad, only(rule.id));
        expect(fixed).not.toBe(rule.bad);
        expect(ids(fixed, only(rule.id))).toEqual([]);
      });
    }
  }
});

describe("checkCopy", () => {
  it("reports line, column, match and suggestion", () => {
    const [issue] = checkCopy("一行目\n導入は容易です", only("plain/kantan"));
    expect(issue).toMatchObject({
      ruleId: "plain/kantan",
      level: "warning",
      line: 2,
      column: 4,
      match: "容易",
      suggestion: "かんたん",
    });
  });

  it("points at the gap for a missing space", () => {
    const [issue] = checkCopy("Kazeを使う", only("notation/latin-spacing"));
    expect(issue).toMatchObject({ column: 5, match: "", suggestion: " " });
  });

  it("spaces numbers by default and keeps the tight variant off", () => {
    expect(ids("12 席と12席")).not.toContain("notation/number-spacing-tight");
    expect(ids("12席")).toContain("notation/number-spacing-loose");
    expect(ids("12 席", { rules: { "notation/number-spacing-tight": true } })).toContain(
      "notation/number-spacing-tight",
    );
  });

  it("does not flag words that only look like a rule", () => {
    expect(ids("Tシャツを選ぶ", only("notation/latin-spacing"))).toEqual([]);
    expect(ids("設定を変更に合わせる", only("plain/kanji-to-kana"))).toEqual([]);
    expect(ids("条件に一致します", only("plain/kanji-to-kana"))).toEqual([]);
    expect(ids("同時に開く", only("plain/koto-toki"))).toEqual([]);
    expect(ids("ユーザーとサーバーとブラウザ", only("notation/long-vowel"))).toEqual([]);
    expect(ids('toast("保存しました")', only("notation/parentheses"))).toEqual([]);
  });

  it("skips words quoted as examples", () => {
    expect(ids("「こちら」にしない", only("clarity/link-kochira"))).toEqual([]);
    expect(ids("詳しくはこちら", only("clarity/link-kochira"))).toContain("clarity/link-kochira");
    expect(fixCopy("「容易」は避ける。容易です", only("plain/kantan"))).toBe(
      "「容易」は避ける。かんたんです",
    );
  });

  it("leaves regular expressions, JSX comments and company names alone", () => {
    expect(ids("/^(明治|大正)/", only("notation/parentheses"))).toEqual([]);
    expect(ids("{/* 補足 (独立行) */}", { mode: "code" })).toEqual([]);
    expect(ids("燕コンピュータ株式会社", only("notation/long-vowel"))).toEqual([]);
    expect(ids("v1.3 を 12.4% 改善", only("notation/number-spacing-loose"))).toEqual([]);
  });

  it("reads only Japanese, non-comment lines in code mode", () => {
    const code = [
      "// 容易なコメントは対象外",
      "const a = 1; // ...",
      " * 簡単な JSDoc も対象外",
      'const label = "導入は容易です";',
    ].join("\n");
    const found = checkCopy(code, { mode: "code" });
    expect(found.map((i) => i.line)).toEqual([4]);
  });

  it("skips fenced code in markdown mode", () => {
    const md = ["導入は容易です", "```", "容易", "```"].join("\n");
    expect(checkCopy(md, { mode: "markdown" }).map((i) => i.line)).toEqual([1]);
  });

  it("honours ignore comments", () => {
    const text = ["容易 // kaze-copy-ignore", "// kaze-copy-ignore-next-line", "容易", "容易"].join(
      "\n",
    );
    expect(checkCopy(text, only("plain/kantan")).map((i) => i.line)).toEqual([4]);
  });

  it("skips a block between ignore-start and ignore-end", () => {
    const text = [
      "容易",
      "{/* kaze-copy-ignore-start */}",
      "容易",
      "{/* kaze-copy-ignore-end */}",
      "容易",
    ].join("\n");
    expect(checkCopy(text, only("plain/kantan")).map((i) => i.line)).toEqual([1, 5]);
  });
});

describe("fixCopy", () => {
  it("rewrites what it can and leaves the rest", () => {
    const fixed = fixCopy("全ての設定を保存して下さい。導入は容易です", {
      rules: { "plain/kanji-to-kana": true, "plain/kantan": true },
    });
    expect(fixed).toBe("すべての設定を保存してください。導入はかんたんです");
  });

  it("does not touch rules without a fix", () => {
    expect(fixCopy("エラーが発生しました")).toBe("エラーが発生しました");
  });

  it("normalizes fullwidth alphanumerics", () => {
    expect(fixCopy("ｖ１．３", only("notation/fullwidth-alnum"))).toBe("v1.3");
  });
});

describe("writingGuide", () => {
  it("has principles, tone and patterns", () => {
    expect(writingGuide.principles.length).toBeGreaterThan(0);
    expect(writingGuide.tone.length).toBeGreaterThan(0);
    for (const p of writingGuide.patterns) {
      expect(p.good.length, p.scene).toBeGreaterThan(0);
      expect(p.bad.length, p.scene).toBeGreaterThan(0);
    }
  });
});
