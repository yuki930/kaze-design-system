/**
 * kaze-design-system/writing
 *
 * Kaze の文言ガイド（原則・場面ごとの型・表記の規則）と、規則に反した文言を見つける検査。
 * ランタイム依存なし。ブラウザでも Node でも動く。CLI は `npx kaze-copy`。
 */
import guideJson from "./guide.json";

export type {
  CheckCopyOptions,
  CopyIssue,
  CopyRule,
  CopyRuleCategory,
  CopyRuleFix,
  CopyRuleLevel,
} from "./check";
export { checkCopy, copyRules, fixCopy } from "./check";

export interface WritingPrinciple {
  title: string;
  body: string;
}

export interface WritingPattern {
  /** 場面（ボタン、エラー、空の状態など） */
  scene: string;
  rule: string;
  good: string[];
  bad: string[];
}

export interface WritingGuide {
  principles: WritingPrinciple[];
  /** 文体と敬語の度合い */
  tone: string[];
  patterns: WritingPattern[];
}

export const writingGuide = guideJson as WritingGuide;
