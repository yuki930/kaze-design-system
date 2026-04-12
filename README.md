# kaze-design-system

[![npm version](https://img.shields.io/npm/v/kaze-design-system)](https://www.npmjs.com/package/kaze-design-system)
[![GitHub](https://img.shields.io/github/license/yuki930/kaze-design-system)](https://github.com/yuki930/kaze-design-system/blob/main/LICENSE)

Zinc ベースのミニマルデザインシステム。日本語組版に最適化。React 19 + TypeScript、62 コンポーネント、ライト/ダーク両対応。

- **Docs**: https://kaze-design-system.vercel.app/docs/components
- **npm**: https://www.npmjs.com/package/kaze-design-system
- **GitHub**: https://github.com/yuki930/kaze-design-system

> **ESM only** — このパッケージは ES Modules のみを提供します。
> `"type": "module"` が設定された環境、または ESM 対応バンドラー（Vite, Next.js, webpack 5+）で使用してください。

## For AI assistants (Claude / Cursor / ChatGPT)

AI コーディングアシスタントは以下のファイルからライブラリの全コンポーネント API を 1 リクエストで取得できます:

- **Short index**: https://kaze-design-system.vercel.app/llms.txt
- **Full API reference**: https://kaze-design-system.vercel.app/llms-full.txt

`llms-full.txt` には 62 コンポーネントの `Props` / `Usage` / カテゴリが機械可読形式で含まれており、Storybook を参照しなくても正確なコード提案が可能です。[llmstxt.org](https://llmstxt.org) 準拠。

## インストール

```bash
npm install kaze-design-system
```

Peer dependencies: `react@^19`, `react-dom@^19`, `lucide-react`

## CSS の読み込み

### まとめて読み込む（推奨）

```ts
import "kaze-design-system/css/all";
```

`css/all` は tokens / reset / components / utilities を `@layer` 付きでまとめたエントリポイントです。
CSS カスケードレイヤーにより詳細度が管理されるため、上書きも容易です。

### 個別読み込み

```ts
import "kaze-design-system/css/tokens";
import "kaze-design-system/css/reset";
import "kaze-design-system/css/components";
import "kaze-design-system/css/utilities";
```

### Next.js App Router

`app/layout.tsx` で CSS を import してください。

```tsx
// app/layout.tsx
import "kaze-design-system/css/all";
```

## 基本的な使い方

```tsx
import { Button, Card, CardHeader, CardTitle, CardBody, ThemeProvider } from "kaze-design-system";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Card>
        <CardHeader>
          <CardTitle>ポートフォリオ</CardTitle>
        </CardHeader>
        <CardBody>
          <Button>詳細を見る</Button>
        </CardBody>
      </Card>
    </ThemeProvider>
  );
}
```

## コンポーネント一覧（62 コンポーネント）

| カテゴリ | コンポーネント |
|---|---|
| **フォーム** | Button, FAB, Input, NumberField, Select, Checkbox, Radio, Textarea, Switch, FormField, FilterPill |
| **データ表示** | Card, Badge, StatusBadge, Table, Metric, Avatar, BarList, Tracker, Watermark |
| **チャート** | BarChart, DonutChart, Sparkline |
| **フィードバック** | Alert, Progress, Meter, Skeleton, EmptyState, Toast |
| **ナビゲーション** | Tabs, Sidebar, TopBar, Breadcrumb, Pagination, Stepper |
| **オーバーレイ** | Dialog, Tooltip, HelpButton, Dropdown, CommandPalette |
| **レイアウト** | AppLayout, Divider, Grid, Search, Logo, Icon, Heading, Text |
| **リスト** | List, DescriptionList, Timeline |
| **マーケティング** | Navbar, Hero, Section, SplitSection, FeatureGrid, Stats, Pricing, Testimonial, FAQ, CTABanner, LPFooter |

## Hooks

```tsx
import { ThemeProvider, useTheme, useFocusTrap } from "kaze-design-system";
import { useLegendToggle } from "kaze-design-system/hooks";
```

- `useTheme` — ライト/ダークの切り替え
- `useFocusTrap` — モーダル向けフォーカストラップ
- `useLegendToggle` — Recharts の凡例クリックで系列 show/hide を切り替え

## デザイントークン

CSS カスタムプロパティベース:

- カラー: `--color-*`（warm zinc パレット）
- スペーシング: `--space-*`
- タイポグラフィ: `--font-size-*`, `--font-weight-*`
- ボーダー: `--radius-*`
- シャドウ: `--shadow-*`

## テーマ（ライト / ダーク）

`data-theme="light"` / `data-theme="dark"` で切り替え。
`ThemeProvider` で自動管理。`prefers-color-scheme` による OS 設定連動にも対応。

## 開発

```bash
npm run dev           # Next.js 開発サーバー（サンプル集 & ドキュメント）
npm run build         # Next.js 本番ビルド
npm run build:lib     # ライブラリビルド（dist/ に出力）
npm run docs:llms     # llms.txt / llms-full.txt を再生成
npm run storybook     # Storybook 起動
npm run typecheck     # TypeScript 型チェック
```

### リリース

main への push 時に GitHub Actions が自動で `npm version patch` → build → `npm publish` を実行します。ライブラリ本体（`src/components/**`, `src/hooks/**`, CSS ファイル等）への変更がある場合のみトリガーされます。

## コントリビュート

バグ報告・機能リクエストは [Issues](https://github.com/yuki930/kaze-design-system/issues) へお願いします。

## ライセンス

[MIT](https://github.com/yuki930/kaze-design-system/blob/main/LICENSE)
