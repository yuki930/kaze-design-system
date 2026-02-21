# CLAUDE.md — Kaze Design System

## プロジェクト概要
- **パッケージ名**: `@kaze-ds/react`
- **GitHub**: https://github.com/yuki930/kaze-design-system
- **技術スタック**: React 19 + TypeScript + Next.js 16 (App Router) + Storybook 10
- **デザイン方針**: Zinc ベースのミニマルデザインシステム、日本語組版最適化
- **CSS**: カスタムプロパティ（CSS Variables）ベース、`@layer` でカスケード管理
- **テーマ**: ライト / ダーク（`data-theme` 属性 + `prefers-color-scheme` フォールバック）
- **コンポーネント数**: 59

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
- **dependencies**: `next`, `react`, `react-dom`, `lucide-react` — Vercel ビルドに必要
- **peerDependencies**: ライブラリとして使う場合の要件（`react`, `react-dom`, `lucide-react`）
- **devDependencies**: Storybook, テスト, ビルドツール等

### 重要: Vercel デプロイ時の注意
Vercel は `NODE_ENV=production` で `npm install` するため、**devDependencies はインストールされない**。
ビルドに必要なパッケージ（next, react, lucide-react 等）は必ず `dependencies` に入れること。

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
- **架空にすべき箇所**: テスティモニアル、ダミーデータ（BarList 等）、求人情報、ブログ記事タイトルでは架空の名前を使用
  - 例: マルシェテック、ワークフロー、ワイズサーチ、テックノート、クラウドセキュリティ株式会社
- **個人情報**: SettingsPage 等のダミーデータには架空の情報を使用（山田太郎、yamada@example.com 等）

## Git / リリース
- **リポジトリ**: https://github.com/yuki930/kaze-design-system (owner: yuki930)
- **Vercel**: GitHub 連携で自動デプロイ
- **ライブラリ配布**: `npm run build:lib` → `npm pack` で tgz 生成、または `npm link`
- **ESM only**: `"type": "module"` 設定
