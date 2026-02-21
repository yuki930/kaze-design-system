# @kaze-ds/react

Zinc ベースのミニマルデザインシステム。日本語組版に最適化。

> **ESM only** — このパッケージは ES Modules のみを提供します。
> `"type": "module"` が設定された環境、または ESM 対応バンドラー（Vite, Next.js, webpack 5+）で使用してください。

## インストール

```bash
npm install @kaze-ds/react
```

### ローカル開発（npm link）

公開前のライブラリをローカルの別プロジェクトで使う場合：

```bash
# 1. ライブラリをビルド & リンク
cd kaze-design-system
npm run build:lib
npm link

# 2. 利用側プロジェクトでリンク
cd ../my-app
npm link @kaze-ds/react
```

### ローカル開発（npm pack）

```bash
# 1. ライブラリをビルド & パック
cd kaze-design-system
npm run build:lib
npm pack
# → kaze-ds-react-0.1.0.tgz が生成される

# 2. 利用側プロジェクトでインストール
cd ../my-app
npm install ../kaze-design-system/kaze-ds-react-0.1.0.tgz
```

## CSS の読み込み

### まとめて読み込む（推奨）

```ts
import "@kaze-ds/react/css/all";
```

`css/all` は tokens / reset / components / utilities を `@layer` 付きでまとめたエントリポイントです。
CSS カスケードレイヤーにより詳細度が管理されるため、上書きも容易です。

### 個別読み込み

```ts
import "@kaze-ds/react/css/tokens";
import "@kaze-ds/react/css/reset";
import "@kaze-ds/react/css/components";
import "@kaze-ds/react/css/utilities";
```

### Next.js App Router

`app/layout.tsx` で CSS を import してください。

```tsx
// app/layout.tsx
import "@kaze-ds/react/css/all";
```

## 基本的な使い方

```tsx
import { Button, Card, CardHeader, CardTitle, CardBody } from "@kaze-ds/react";
import { ThemeProvider } from "@kaze-ds/react/hooks";

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

## コンポーネント一覧（59 コンポーネント）

| カテゴリ | コンポーネント |
|---|---|
| **フォーム** | Button, FAB, Input, NumberField, Select, Checkbox, Radio, Textarea, Switch, FormField |
| **データ表示** | Card, Badge, Table, Metric, Avatar, BarList, Tracker, Watermark |
| **チャート** | BarChart, DonutChart, Sparkline |
| **フィードバック** | Alert, Progress, Meter, Skeleton, EmptyState, Toast |
| **ナビゲーション** | Tabs, Sidebar, TopBar, Breadcrumb, Pagination, Stepper |
| **オーバーレイ** | Dialog, Tooltip, Dropdown, CommandPalette |
| **レイアウト** | AppLayout, Divider, Grid, Search, Logo, Icon, Heading, Text |
| **リスト** | List, DescriptionList, Timeline |
| **マーケティング** | Navbar, Hero, Section, SplitSection, FeatureGrid, Stats, Pricing, Testimonial, FAQ, CTABanner, LPFooter |

## デザイントークン

CSS カスタムプロパティベース：

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
npm run storybook     # Storybook 起動
npm run typecheck     # TypeScript 型チェック
```

## ライセンス

MIT
