# kaze-design-system

[![npm version](https://img.shields.io/npm/v/kaze-design-system)](https://www.npmjs.com/package/kaze-design-system)
[![GitHub](https://img.shields.io/github/license/yuki930/kaze-design-system)](https://github.com/yuki930/kaze-design-system/blob/main/LICENSE)

**Kaze (風)** は、管理画面・ダッシュボード・金融系アプリのための React デザインシステムです。**白と温かみのあるグレーを基調にした静かな配色**と、日本語組版への丁寧な最適化（PALT・和欧混植・読みやすい行間）、そしてコピペで完結する 69 のコンポーネントを 1 パッケージにまとめています。派手な色や装飾ではなく「読みやすさ」「情報密度」「長時間見続けても疲れないこと」を設計の中心に置いています。

- **69 コンポーネント**: フォーム、テーブル、依存ゼロの SVG チャート（折れ線・縦棒・ヒートマップ等）、ダッシュボード UI、ランディングページ、マーケティングパーツまで
- **日本語組版に最適化**: PALT グローバル適用、和欧混植、括弧ツメ、適切な line-height
- **ライト / ダーク両対応**: `data-theme` 属性で切替、`prefers-color-scheme` 連動
- **素の CSS + カスケードレイヤー**: `@layer kaze.tokens, kaze.reset, kaze.components, kaze.utilities` でカスケード管理、Tailwind/CSS-in-JS 不要
- **ESM only + Tree-shakeable**: React 18 / 19 + TypeScript、peer deps は `react`, `react-dom`（`lucide-react` は任意）のみ
- **AI フレンドリー**: [`/llms.txt`](https://kaze-design-system.vercel.app/llms.txt) で全コンポーネント API を 1 ファイル配信

## Links

| | |
|---|---|
| **ライブプレビュー (ショーケース)** | https://kaze-design-system.vercel.app |
| **コンポーネントドキュメント** | https://kaze-design-system.vercel.app/docs/components |
| **サンプルページギャラリー** | https://kaze-design-system.vercel.app/gallery |
| **npm パッケージ** | https://www.npmjs.com/package/kaze-design-system |
| **GitHub** | https://github.com/yuki930/kaze-design-system |

## Live Examples

実際のアプリケーション/ページ単位のサンプル実装。Vercel にデプロイされています:

### ダッシュボード / 管理画面
- [**分析ダッシュボード**](https://kaze-design-system.vercel.app/dashboard): メトリック、チャート、テーブル組み合わせ
- [**Analytics**](https://kaze-design-system.vercel.app/analytics): KPI 一覧、BarList、Tracker
- [**SaaS Stats**](https://kaze-design-system.vercel.app/saas-stats): SaaS 系ダッシュボード
- [**EC ダッシュボード**](https://kaze-design-system.vercel.app/ec-dashboard): EC 管理画面
- [**設定画面**](https://kaze-design-system.vercel.app/settings): フォーム・FormField 活用例

### ランディング・マーケティング
- [**LP (SaaS)**](https://kaze-design-system.vercel.app/lp): Hero, Features, Pricing, Testimonial, FAQ, CTA
- [**LP 2**](https://kaze-design-system.vercel.app/lp2): 異なる雰囲気の LP
- [**Pricing**](https://kaze-design-system.vercel.app/pricing): 料金プラン
- [**Blog**](https://kaze-design-system.vercel.app/blog): 記事一覧・記事詳細
- [**Jobs**](https://kaze-design-system.vercel.app/jobs): 求人ページ

### アプリケーション
- [**Login**](https://kaze-design-system.vercel.app/login): 認証画面
- [**Todo**](https://kaze-design-system.vercel.app/todo): シンプルな Todo アプリ
- [**Shopping**](https://kaze-design-system.vercel.app/shopping): EC 商品一覧
- [**Article**](https://kaze-design-system.vercel.app/article): 記事ページ
- [**Help**](https://kaze-design-system.vercel.app/help): ヘルプセンター

> **ESM only**: このパッケージは ES Modules のみを提供します。
> `"type": "module"` が設定された環境、または ESM 対応バンドラー（Vite, Next.js, webpack 5+）で使用してください。

## For AI assistants (Claude / Cursor / ChatGPT)

AI コーディングアシスタントは以下のファイルからライブラリの全コンポーネント API を 1 リクエストで取得できます:

- **Short index**: https://kaze-design-system.vercel.app/llms.txt
- **Full API reference**: https://kaze-design-system.vercel.app/llms-full.txt

`llms-full.txt` には 69 コンポーネントの `Props` / `Usage` / カテゴリが機械可読形式で含まれており、Storybook を参照しなくても正確なコード提案が可能です。[llmstxt.org](https://llmstxt.org) 準拠。

## インストール

```bash
npm install kaze-design-system
```

Peer dependencies: `react@^18 || ^19`, `react-dom@^18 || ^19`。`lucide-react` は任意（`Icon` に lucide のアイコンを渡す場合やサンプルコードで使用。コンポーネント本体は lucide なしで動きます）

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

## レイヤー構成

kaze は1パッケージ・3レイヤーで構成されています。

- **Foundation**: デザイントークン（カラー・タイポグラフィ・スペーシング）と CSS。両レイヤー共通の土台
- **Application UI**: 管理画面・アプリ向けの58コンポーネント。`kaze-design-system` から import
- **Marketing**: LP・キャンペーンページ向けの11コンポーネント。`kaze-design-system/marketing` から import

```tsx
// Application UI
import { Table, Sidebar, CommandPalette } from "kaze-design-system";

// Marketing（ルートからの import も引き続き使えます）
import { Hero, PricingGrid, CTABanner } from "kaze-design-system/marketing";
```

## コンポーネント一覧（69 コンポーネント）

### Application UI（58）

| カテゴリ | コンポーネント |
|---|---|
| **フォーム** | Button, FAB, Input, NumberField, Select, Checkbox, Radio, Textarea, Switch, FormField, FilterPill, SegmentedControl |
| **データ表示** | Card, Badge, StatusBadge, Table, Metric, Avatar, BarList, Tracker, Watermark |
| **チャート** | BarChart, DonutChart, Sparkline, LineChart, ColumnChart, Heatmap, CategoryBar, ChartLegend |
| **フィードバック** | Alert, Progress, Meter, Skeleton, EmptyState, Toast |
| **ナビゲーション** | Tabs, Sidebar, TopBar, Breadcrumb, Pagination, Stepper, Disclosure |
| **オーバーレイ** | Dialog, Tooltip, HelpButton, Dropdown, CommandPalette |
| **レイアウト** | AppLayout, Divider, Grid, Search, Logo, Icon, Heading, Text |
| **リスト** | List, DescriptionList, Timeline |

### Marketing（11）

| カテゴリ | コンポーネント |
|---|---|
| **マーケティング** | Navbar, Hero, Section, SplitSection, FeatureGrid, Stats, Pricing, Testimonial, FAQ, CTABanner, LPFooter |

詳細は [kaze-design-system.vercel.app/docs/components](https://kaze-design-system.vercel.app/docs/components) を参照してください。

## チャート

チャートはすべて SVG の手書き実装で、追加の依存はありません（recharts 等は不要）。色は `--chart-*` トークンを使うので、ダークモードとパレット切り替えに自動で追従します。

| コンポーネント | 用途 |
|---|---|
| `LineChart` | 時系列の折れ線 / 面グラフ。複数系列、欠損値、ホバーとキーボードのツールチップ |
| `ColumnChart` | 縦棒グラフ。グループ / 積み上げ、負の値 |
| `BarChart` | 横棒のランキング |
| `DonutChart` | 構成比のドーナツ |
| `CategoryBar` | 構成比を 1 本の帯で。目標線マーカー付き |
| `Heatmap` | 曜日×時間などの行列、日別カレンダー |
| `Sparkline` | 表やカードに埋め込む小さな推移 |
| `ChartLegend` | 系列の表示 / 非表示を切り替える凡例 |
| `SegmentedControl` | 期間（1W / 1M / 1Y）や表示の切り替え |

```tsx
import { LineChart, SegmentedControl } from "kaze-design-system";

<SegmentedControl
  aria-label="期間"
  options={[
    { value: "1m", label: "1M" },
    { value: "3m", label: "3M" },
    { value: "1y", label: "1Y" },
  ]}
  defaultValue="3m"
/>
<LineChart
  aria-label="月別の売上と利用者数"
  index="month"
  data={[
    { month: "4月", sales: 320, users: 210 },
    { month: "5月", sales: 340, users: 230 },
    { month: "6月", sales: 310, users: 245 },
  ]}
  series={[
    { key: "sales", label: "売上（万円）" },
    { key: "users", label: "利用者数（人）" },
  ]}
  curve="monotone"
  area
/>
```

## Hooks

```tsx
import { ThemeProvider, useTheme } from "kaze-design-system";
import { useFocusTrap, useLegendToggle } from "kaze-design-system/hooks";
```

- `useTheme`: ライト/ダークの切り替え
- `useFocusTrap`: モーダル向けフォーカストラップ
- `useLegendToggle`: Recharts の凡例クリックで系列 show/hide を切り替え

## バンドルサイズ

63 コンポーネント時点の計測で **JS 38 kB gzip + CSS 23 kB gzip ≒ 61 kB gz**。ただし、個別 import すれば使った分だけが bundle に入ります。

| 区分 | 生サイズ | gzip |
|---|---:|---:|
| JS: 全コンポーネント合計 (tree-shake 対象) | 110 kB | **38 kB** |
| JS: 最大 (CommandPalette) | 6.4 kB | 1.9 kB |
| JS: 中央値 (StatusBadge) | 896 B | 476 B |
| JS: 最小 (Textarea) | 481 B | 280 B |
| CSS: `tokens.css` | 20.1 kB | 4.9 kB |
| CSS: `components.css` | 101 kB | 13.6 kB |
| CSS: `utilities.css` | 18.9 kB | 3.4 kB |
| CSS: `reset.css` | 3.7 kB | 1.1 kB |

`npm run size` でローカルで最新のサイズを計測できます。React / lucide-react 等の peer dependencies は含まれていません。

## デザイントークン

CSS カスタムプロパティベース:

- カラー: `--color-*`（warm zinc パレット）。文字色は `fg` / `fg-muted` / `fg-secondary` / `fg-tertiary` がすべて WCAG AA（4.5:1）を満たし、`fg-decorative` だけが装飾専用
- フォーカス: `--color-focus`（既定は `fg`。全テーマで 3:1 以上の実線リング）
- スペーシング: `--space-*`
- タイポグラフィ: `--font-size-*`, `--font-weight-*`, `--font-sans`（本文、Noto Sans JP 主体）, `--font-display`（見出しと大きな数値、Montserrat + palt）, `--measure-ja`（日本語本文の行長 40em）
- ボーダー: `--radius-*`
- シャドウ: `--shadow-*`
- 密度: `--density-*`（コントロール高さ・行パディング・UI フォントサイズ。下記「密度」参照）

JS から値を参照したい場合は `kaze-design-system/tokens` から import できます。

```ts
import { space } from "kaze-design-system/tokens";
```

## 日本語組版の既定値

`reset.css` と `tokens.css` が、日本語の本文と UI に合わせた既定値を適用します。

- 本文は Noto Sans JP 主体、行間 1.75、ルートのフォントサイズはブラウザ既定（ユーザーの拡大設定を尊重）
- 禁則処理 `line-break: strict`、約物の詰め `text-spacing-trim: trim-start`、見出しの文節改行 `word-break: auto-phrase`（対応ブラウザのみ）
- プロポーショナルかな（palt）と Montserrat は、見出し・Metric・Stats・料金などの表示用テキストにだけ適用
- 数値は `tabular-nums`、日本語見出しの字間は 0（欧文数字のみ `--letter-spacing-tight`）

## テーマ（ライト / ダーク）

`data-theme="light"` / `data-theme="dark"` で切り替え。
`ThemeProvider` で自動管理。`prefers-color-scheme` による OS 設定連動にも対応。

`data-palette="cool"` を付けると warm zinc から cool slate のパレットに切り替わります（ライト / ダークどちらとも併用可）。

ダークモード利用者の初回描画がライトで一瞬光るのを防ぐには、`<head>` に `ThemeScript` を置きます。React が動く前に保存済みのテーマを `<html>` に適用します。

```tsx
import { ThemeProvider, ThemeScript } from "kaze-design-system/hooks";

<html lang="ja" suppressHydrationWarning>
  <head>
    <ThemeScript defaultTheme="system" />
  </head>
  <body>
    <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
  </body>
</html>
```

## Server Components から使う

ルートの barrel（`kaze-design-system`）は `"use client"` 付きなので、そこから import したコンポーネントはすべてクライアント境界に入ります。state を持たない静的コンポーネント（Card、Badge、Heading、Table など 54 個）を Server Component のまま使いたい場合は、個別のサブパスから import してください。

```tsx
import { Card, CardHeader, CardTitle } from "kaze-design-system/components/Card";
import { Badge } from "kaze-design-system/components/Badge";
```

state を持つコンポーネント（Dialog、Dropdown、Tabs など）は個別ファイルの先頭に `"use client"` が付いているので、同じ書き方で問題なく動きます。

## 密度（Density）

`data-density="compact"` を祖先要素（`<html>` やパネル単位）に付けると、Input / Select / Table / List / Tabs / Dropdown / Sidebar などが詰まった表示になります。テーマ・パレットとは独立に組み合わせられます。

```html
<html data-theme="dark" data-density="compact">
```

## CSS のレイヤーについて

Kaze の CSS はすべて `kaze` 配下のカスケードレイヤー（`kaze.tokens` → `kaze.reset` → `kaze.components` → `kaze.utilities`）に入っています。`css/components` などを個別に読み込んでも、各ファイルが自分のレイヤーを宣言するので順序は保たれます。レイヤー外のスタイル（CSS Modules、あなたのアプリの CSS）は常に Kaze より優先されます。

**Tailwind と併用する場合**は `kaze-design-system/css/core`（tokens + reset + components）を読み込み、`css/utilities` は読み込まないでください。`.flex` や `.hidden` のようなユーティリティ名が Tailwind と重なるためです。レイヤー名を `kaze.*` に分けているので、Tailwind の `components` / `utilities` レイヤーと混ざることはありません。

```tsx
import "kaze-design-system/css/core"; // Tailwind と併用
```

## 開発

```bash
npm run dev           # Next.js 開発サーバー（サンプル集 & ドキュメント）
npm run build         # Next.js 本番ビルド
npm run build:lib     # ライブラリビルド（dist/ に出力）
npm run docs:llms     # llms.txt / llms-full.txt を再生成
npm run storybook     # Storybook 起動
npm run typecheck     # TypeScript 型チェック
npm run test          # ユニットテスト（jsdom）
npm run test:storybook # Storybook ブラウザテスト（Playwright）
```

### リリース

main への push 時に GitHub Actions が Conventional Commits からバージョン（patch / minor / major）を判定し、build → `npm publish` → release コミットとタグの push を実行します。ライブラリ本体（`src/components/**`, `src/hooks/**`, CSS ファイル、`package.json` 等）への変更がある場合のみトリガーされます。詳しくは [CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。

## コントリビュート

バグ報告・機能リクエストは [Issues](https://github.com/yuki930/kaze-design-system/issues) へお願いします。

## ライセンス

[MIT](https://github.com/yuki930/kaze-design-system/blob/main/LICENSE)
