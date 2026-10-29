/**
 * Design guidance per component, keyed by the docs slug (`categories[].components[].path`).
 * Rendered on /docs/components/[name] and written into llms-full.txt by
 * scripts/generate-llms.mjs, so the JSON files are the single source.
 */
import charts from "./charts.json";
import data from "./data.json";
import feedback from "./feedback.json";
import forms from "./forms.json";
import layout from "./layout.json";
import list from "./list.json";
import marketing from "./marketing.json";
import navigation from "./navigation.json";
import overlay from "./overlay.json";

export interface KeyboardRow {
  /** Key or chord as written on the keyboard, e.g. "Shift + PageUp" */
  keys: string;
  /** What happens, in plain Japanese */
  action: string;
}

export interface ComponentGuide {
  /** 使う場面 */
  use: string[];
  /** 使わない場面と、代わりに使うもの */
  avoid: string[];
  /** キーボード操作（実装どおりに書く。操作できない部品は省略） */
  keyboard?: KeyboardRow[];
  /** 支援技術への伝わり方と、利用側で気をつけること */
  a11y?: string[];
  /** ラベルや文言の書き方 */
  writing?: string[];
  /** 関連するコンポーネントの slug */
  related?: string[];
}

export const guides: Record<string, ComponentGuide> = {
  ...forms,
  ...data,
  ...charts,
  ...feedback,
  ...navigation,
  ...overlay,
  ...layout,
  ...list,
  ...marketing,
};
