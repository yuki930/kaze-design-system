# CLAUDE.md（Kaze Design System）

## プロジェクト概要
- **パッケージ名**: `kaze-design-system`
- **GitHub**: https://github.com/yuki930/kaze-design-system
- **技術スタック**: React 19 + TypeScript + Next.js 16 (App Router) + Storybook 10
- **デザイン方針**: Zinc ベースのミニマルデザインシステム、日本語組版最適化
- **CSS**: カスタムプロパティ（CSS Variables）ベース、`@layer` でカスケード管理
- **テーマ**: ライト / ダーク（`data-theme` 属性 + `prefers-color-scheme` フォールバック）
- **コンポーネント数**: 77

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
npm run format:fix    # biome でフォーマット + 安全な lint 自動修正（push 前に必ず実行）
npm run lint          # biome lint（a11y の一部はまだ warn。新規コードでは警告も出さない）
npm run test          # ユニットテスト（jsdom。CI / publish で実行）
npm run test:storybook # Storybook ブラウザテスト（Playwright Chromium。sandbox 内では起動できない）
npm run docs:llms     # llms.txt / llms-full.txt を再生成
npm run docs:stories  # 未作成の story 雛形を生成
npm run size          # バンドルサイズ計測
```

## ディレクトリ構成
```
app/                    # Next.js App Router ページ
src/
  components/           # UIコンポーネント（各コンポーネントは独立フォルダ）
    index.ts            # barrel export（"use client" 付き。Marketing も再 export）
    marketing.ts        # kaze-design-system/marketing のエントリ（Marketing 11個）
  hooks/                # useTheme, useFocusTrap, useLegendToggle（"use client" 付き）
  tokens/               # JS トークン（kaze-design-system/tokens）
  views/                # ページ実装（dashboards/, landing/, apps/, docs/ 等）
  lib/                  # ユーティリティ、型定義
tokens.css              # デザイントークン（CSS カスタムプロパティ）
reset.css               # CSS リセット
components.css          # コンポーネント CSS
utilities.css           # ユーティリティ CSS
kaze.css                # 上記4つの @layer 付きまとめエントリ
vite.config.lib.ts      # ライブラリビルド専用 Vite 設定
vitest.config.ts        # テスト設定（unit: jsdom / storybook: ブラウザの2プロジェクト）
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
- **PALT**: `font-feature-settings: "palt" 1` は `tokens.css` の `:root` でグローバル適用（本文も含む）
- **書体**: 英数字は Montserrat、かなと漢字は Noto Sans JP（`--font-sans`）。palt と書体はオーナーのこだわりなので、組版の一般論を理由に変えない。文字の見た目が変わる変更は事前に確認する
- **ダークモード**: `[data-theme="dark"]` セレクタ + `@media (prefers-color-scheme: dark)` フォールバック
  - フォールバックは `:root:not([data-theme="light"])` パターン
  - `[data-theme="dark"]` だけのルールを書いたら、同じ内容を `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) ... }` にも書く
  - `data-palette="cool"` のダークは `:root[data-palette="cool"]:not([data-theme="light"])` のフォールバックを別に持つ（zinc のフォールバックと詳細度が同じで負けるため）
- **密度**: `data-density="compact"` で `--density-*` を切り替える。コントロール高さ・行パディング・UI フォントサイズは固定値ではなく density トークンを使う
- **カスケードレイヤー**: `@layer kaze.tokens, kaze.reset, kaze.components, kaze.utilities;`（kaze.css と globals.css で宣言。各 CSS ファイルも自分のレイヤーで自身を包む。`kaze` 配下にネストしているのは Tailwind の `components` / `utilities` と衝突させないため）
- **未定義トークン禁止**: `var(--x, fallback)` のフォールバックに頼らず、tokens.css に存在するトークンだけを参照する

## コンポーネント設計
- barrel export（`components/index.ts`, `components/marketing.ts`, `hooks/index.ts`）は `"use client"` 付きで、ここがクライアント境界
- Portal 系（Dialog, Drawer, Popover, Toast, Dropdown, Tooltip, CommandPalette）や state / effect を持つものは個別ファイルにも `"use client"` を付ける
- `useId` だけを使うフォーム要素（Input, Checkbox 等）や静的コンポーネント（Card, Badge 等）は個別ファイルに付けなくてよい
- `lucide-react` は optional peer なので、コンポーネント本体で import しない（アイコンは inline SVG か、`Icon` に外から渡す）
- 公開型が参照するモジュールは相対パスで import する（`@/` は `.d.ts` に残り利用者側で解決できない。CI でチェック）

## レイヤー構成（Foundation / Application UI / Marketing）
Kaze は「1パッケージ・3レイヤー」構成。上位レイヤーは下位レイヤーのトークンだけを参照し、逆方向の参照はしない。

- **Foundation**: `tokens.css` / `utilities.css` など、両カタログが共有する土台。単独のコンポーネントは持たず、`/docs/tokens`・`/docs/colors`・`/docs/utilities` として提示する。
- **Application UI**: 業務アプリ・ダッシュボードの画面を組む66コンポーネント。フォーム/データ表示/チャート/フィードバック/ナビゲーション/オーバーレイ/レイアウト/リストの8カテゴリ。
- **Marketing**: LP・プロダクトサイトを組む正準11コンポーネント。Navbar, Hero, Section, SplitSection, FeatureGrid, Stats, Pricing, Testimonial, FAQ, CTABanner, LPFooter。この11個以外を追加する場合は Issue で合意を取ってから増やす（勝手に一点ものを足さない）。追加・削除したときは `src/components/marketing.ts` の export も合わせる。
- コンポーネント総数は 77（66 + 11）。`src/views/docs/ComponentsOverview.tsx` の `categories` 配列がこの2カタログ + Foundation 導線の唯一のソース。`scripts/generate-llms.mjs` がこの配列を TypeScript Compiler API で解析して `llms.txt` / `llms-full.txt` を生成するため、カテゴリ構造を変える際は両方を追従修正し `npm run docs:llms` で77個出力されることを確認する。

### Marketing コンポーネントのデモ制約
Marketing はランディングページの世界観を見せる場なので、Application UI より表現の自由度は上げてよいが、以下は例外なく守る。

- **世界観スペックに準拠**: Zinc ベース + 単一アクセントのミニマル基調を保つ。装飾のためのグラデーションや過度なエフェクトは足さない。
- **多色グラデーション禁止**: 複数色相を混ぜたレインボー/パステル系グラデーションは使わない。使うなら単一アクセント色の抑えたグロー（例: `heroSection::before` の 1 色 blur）まで。
- **em-dash 禁止**: 実文言に `—` / `―` を使わない（下記「コンテンツのルール」と同一基準。コード内コメントの区切りは対象外）。
- **見出し絵文字禁止**: h1〜h3 に装飾絵文字を使わない。
- **人名・社名はプールから**: テスティモニアルやダミーデータは下記「コンテンツのルール」のプールから割り当てる。新規デモのために架空名を思いつきで増やさない。

## コンテンツのルール
- **実在企業名**: UIラベル（フッター、ナビ、CTA）では GitHub, Twitter, Instagram 等のサービス名 OK
- **人名**: テスティモニアル、ダミーデータ、記事の著者、SettingsPage 等の個人情報には以下のプールから文脈ごとに割り当てる。同じページ内で別人に同じ名前を使わない（ページをまたいだ再利用は可）
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
