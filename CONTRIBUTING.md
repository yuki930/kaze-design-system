# Contributing to kaze-design-system

ようこそ！kaze への貢献を検討いただきありがとうございます。このガイドは、Issue 報告から PR 作成・リリースまでの流れをまとめたものです。

## 目次

- [開発環境のセットアップ](#開発環境のセットアップ)
- [コミットメッセージ規約](#コミットメッセージ規約)
- [コンポーネント追加のチェックリスト](#コンポーネント追加のチェックリスト)
- [テスト](#テスト)
- [バンドルサイズの確認](#バンドルサイズの確認)
- [リリース](#リリース)
- [コードスタイル](#コードスタイル)

---

## 開発環境のセットアップ

```bash
git clone https://github.com/yuki930/kaze-design-system.git
cd kaze-design-system
npm install
```

主なコマンド:

| コマンド | 用途 |
|---|---|
| `npm run dev` | Next.js 開発サーバー (port 4173, Turbopack) — `/docs/components` にアクセスして全コンポーネントを確認 |
| `npm run storybook` | Storybook 起動 (port 6006) |
| `npm run typecheck` | TypeScript 型チェック |
| `npm test` | Vitest で unit + storybook browser テスト実行 |
| `npm run test:watch` | Vitest watch モード |
| `npm run build:lib` | ライブラリビルド (`dist/` 生成) |
| `npm run docs:llms` | `public/llms.txt` / `public/llms-full.txt` 再生成 |
| `npm run docs:stories` | 欠けている `*.stories.tsx` を自動生成 |
| `npm run size` | バンドルサイズレポート |

---

## コミットメッセージ規約

**このプロジェクトは [Conventional Commits](https://www.conventionalcommits.org/) に従います。** コミットメッセージの prefix が自動リリース時の semver bump レベルを決定するため、正しく選んでください。

| Prefix | 用途 | semver |
|---|---|---|
| `feat:` | 新機能、新コンポーネント、新 hook | **minor** |
| `fix:` | バグ修正 | patch |
| `perf:` | パフォーマンス改善 | patch |
| `refactor:` | リファクタ（API 不変） | patch |
| `docs:` | ドキュメント変更のみ | patch（※ 本体変更なしなら publish されない） |
| `chore:` / `build:` / `ci:` | その他のメンテナンス | patch |
| `feat!:` または本文に `BREAKING CHANGE:` | 破壊的変更 | **major** |

複数の変更を含む場合、**一番重い prefix** を使ってください（例: 新コンポーネント + バグ修正 → `feat:`）。

破壊的変更は事前に Issue でディスカッションしてからマージしてください。

---

## コンポーネント追加のチェックリスト

新しいコンポーネントを追加する際は、以下をすべて満たすようにしてください:

- [ ] **実装**: `src/components/<Name>/<Name>.tsx` + `index.ts`
- [ ] **export 登録**: `src/components/index.ts` に追加
- [ ] **CSS**: `components.css` に BEM 記法で追記（`.component`, `.component__element`, `.component--modifier`）
- [ ] **デザイントークン使用**: ハードコードしたカラー/スペースではなく `var(--color-*)` / `var(--space-*)` / `var(--radius-*)` 等を使用
- [ ] **Client/Server**: Portal / フォーム / 状態あり → `"use client"` 必須、静的な要素のみ → Server Component 可
- [ ] **ドキュメントサイト**:
  - `src/views/docs/ComponentsOverview.tsx` のカテゴリに追加
  - `src/views/docs/ComponentPage.tsx` の `componentDocs` にエントリ追加（preview / props / usage）
- [ ] **Storybook story**: `<Name>.stories.tsx` を作成（`npm run docs:stories` で雛形自動生成、compound なら手書き）
- [ ] **llms.txt 再生成**: `npm run docs:llms`
- [ ] **型チェック**: `npm run typecheck` が通る
- [ ] **テスト**: `npm test` が通る

---

## テスト

- **ユニットテスト**: `src/**/*.test.tsx` に jsdom 環境で配置
- **Storybook ブラウザテスト**: `*.stories.tsx` は Vitest の Chromium ブラウザプロジェクトで smoke test される
- 新規コンポーネントは最低限 1 つの story を追加すること（自動で browser test の対象になる）

```bash
npm test                    # 全テスト実行
npm test -- --project unit  # ユニットテストのみ
npm test -- --project storybook  # Storybook ブラウザテストのみ
```

---

## バンドルサイズの確認

```bash
npm run size
```

- JS 合計 (gzip) が現在 **~38 kB** / CSS 合計 (gzip) が **~23 kB** です
- 新しいコンポーネント追加で想定外に大きく膨らんでいないか確認してください
- 特に `lucide-react` から大量のアイコンを import していないか注意（個別 import 推奨）

---

## リリース

**リリースは自動化されています。** `main` への push で GitHub Actions (`publish.yml`) が:

1. Conventional Commit prefix から semver bump を判定
2. `CHANGELOG.md` に新エントリを追記
3. `npm version <bump>` でバージョン更新
4. `release: vX.Y.Z [skip ci]` コミット + タグを作成
5. `npm run build:lib` でビルド
6. `npm publish` で npm に公開

**手動で `npm version` / `npm publish` / `git tag` を実行しないでください** — Action と競合します。

`src/components/**`, `src/hooks/**`, ルート CSS ファイル等の **ライブラリ本体** への変更があった場合のみトリガーされます。README やドキュメント、scripts の変更では publish されません。

---

## コードスタイル

- **TypeScript strict モード** (strict + noUncheckedIndexedAccess) を維持すること
- **forwardRef** を使って ref を適切に転送
- **JSDoc** を Props interface に追加すると、自動生成される docs / llms.txt / Storybook の argTypes に反映されます
- **CSS-in-JS / Tailwind は使わない** — 素の CSS + カスタムプロパティで統一
- **アクセシビリティ**: role / aria 属性を適切に設定、キーボード操作対応

---

## Issue 報告

バグや機能要望は [GitHub Issues](https://github.com/yuki930/kaze-design-system/issues) へお願いします。テンプレートが用意されています:

- **🐛 バグ報告**: 再現手順 / 期待する挙動 / 実際の挙動を含めてください
- **✨ 機能要望**: ユースケースと提案 API を含めてください

---

## 質問

実装方針に迷ったら、Issue を立てる前にまずディスカッションで相談してください。小さい修正でも歓迎します。
