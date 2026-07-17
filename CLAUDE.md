# CLAUDE.md（Kaze Design System）

## プロジェクト概要
- **パッケージ名**: `kaze-design-system`
- **GitHub**: https://github.com/yuki930/kaze-design-system
- **技術スタック**: React 19 + TypeScript + Next.js 16 (App Router) + Storybook 10
- **デザイン方針**: Zinc ベースのミニマルデザインシステム、日本語組版最適化
- **CSS**: カスタムプロパティ（CSS Variables）ベース、`@layer` でカスケード管理
- **テーマ**: ライト / ダーク（`data-theme` 属性 + `prefers-color-scheme` フォールバック）
- **コンポーネント数**: 63

## 環境セットアップ
```bash
# Node.js が PATH に入っていないため、毎回必要
export PATH="/opt/homebrew/Cellar/node@22/22.21.1_4/bin:$PATH"

# head, tail, grep 等の基本コマンドが使えない場合がある（zsh 設定の問題）
# → Bash ツールでは grep/tail の代わりに Grep/Read ツールを使うこと
```

## コマンド
```bash
npm run dev           # Next.js 開発サーバー (port 4173, Turbopack)
npm run build         # Next.js 本番ビルド
npm run build:lib     # ライブラリビルド (dist/ に出力、vite.config.lib.ts 使用)
npm run storybook     # Storybook 起動 (port 6006)
npm run typecheck     # TypeScript 型チェック
```

## ディレクトリ構成
```
app/                    # Next.js App Router ページ
src/
  components/           # UIコンポーネント（各コンポーネントは独立フォルダ）
    index.ts            # barrel export（"use client" 付き）
  hooks/                # useTheme, useFocusTrap（"use client" 付き）
  views/                # ページ実装（dashboards/, landing/, apps/, docs/ 等）
  lib/                  # ユーティリティ、型定義
tokens.css              # デザイントークン（CSS カスタムプロパティ）
reset.css               # CSS リセット
components.css          # コンポーネント CSS
utilities.css           # ユーティリティ CSS
kaze.css                # 上記4つの @layer 付きまとめエントリ
vite.config.lib.ts      # ライブラリビルド専用 Vite 設定
vitest.config.ts        # テスト設定（Storybook ブラウザテスト）
tsconfig.build.json     # ライブラリビルド用 TypeScript 設定
```

## package.json の構造
- **dependencies**: なし（ランタイム依存 0。ライブラリ利用者に余計なパッケージを入れさせない）
- **peerDependencies**: ライブラリとして使う場合の要件（`react`, `react-dom`, `lucide-react`）
- **devDependencies**: `next`, `react`, `react-dom`, `lucide-react`（docs サイト用）+ Storybook, テスト, ビルドツール等

### 重要: Vercel デプロイ時の注意
標準の Vercel は devDependencies もインストールするため、docs サイトのビルドはこの構成で通る。
ただし Vercel プロジェクト設定の環境変数に `NODE_ENV=production` が設定されている場合は devDependencies がスキップされてビルドが落ちるので、その場合は環境変数を外すか `installCommand` を `npm install --include=dev` にする。
`next` 等を dependencies に戻すのは禁止（npm 利用者全員に Next.js が入ってしまう）。

## CSS 設計
- **PALT**: `font-feature-settings: "palt" 1` は `tokens.css` の `:root` でグローバル適用
- **ダークモード**: `[data-theme="dark"]` セレクタ + `@media (prefers-color-scheme: dark)` フォールバック
  - フォールバックは `:root:not([data-theme="light"])` パターン
- **カスケードレイヤー**: `@layer tokens, reset, components, utilities;`（kaze.css と globals.css で宣言）

## コンポーネント設計
- Portal 系（Dialog, Toast, Dropdown, Tooltip, CommandPalette）は `"use client"` 必須
- フォーム系（Input, Select, Checkbox 等）も `"use client"` 必須
- 静的コンポーネント（Card, Badge, Avatar, Heading 等）は Server Component 可能
- barrel export (`components/index.ts`, `hooks/index.ts`) は `"use client"` 付き

## コンテンツのルール
- **実在企業名**: UIラベル（フッター、ナビ、CTA）では GitHub, Twitter, Instagram 等のサービス名 OK
- **人名**: テスティモニアル、ダミーデータ、記事の著者、SettingsPage 等の個人情報には以下のプールから文脈ごとに割り当てる。同じ名前を複数ページで使い回さない
  - 相楽 実咲 / 堀内 昌平 / 宮田 千夏 / 呉羽 直樹 / 桐生 あかね / 野々村 圭 / 早瀬 遼平 / 志摩 このみ / 三隅 拓海 / 綿貫 玲奈 / 大迫 航 / 藤枝 蒼
- **メールアドレス**: 架空の自社ドメイン `@norn.co.jp` に統一する（例: misaki.sagara@norn.co.jp）。docs のコード例に限り `example.com` を使ってよい
- **社名**: テスティモニアル、ダミーデータ（BarList 等）、求人情報などには以下のプールか、生成規則を散らした新造社名（地名・語呂・カタカナ一語など）を使用
  - ノルン株式会社 / 株式会社ノーツ / 八十八株式会社 / 合同会社潮目 / 株式会社みなも / 燕コンピュータ株式会社 / 合同会社雨と種
- **役職**: SRE、プロダクトオーナー、デザインエンジニア、カスタマーサクセス、情シス、取締役CTO など偏らせない
- **表記**: 実文言に em-dash（—/―）を使わない。句読点・括弧・体言止めに置換する（コード内コメントの区切りは対象外）。見出しに絵文字を使わない

## Git / リリース
- **リポジトリ**: https://github.com/yuki930/kaze-design-system (owner: yuki930)
- **Vercel**: GitHub 連携で自動デプロイ
- **ライブラリ配布**: `npm run build:lib` → `npm pack` で tgz 生成、または `npm link`
- **ESM only**: `"type": "module"` 設定
