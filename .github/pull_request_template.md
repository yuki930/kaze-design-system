<!--
  ありがとうございます！PR 送信前に以下を確認してください。
  コミットメッセージの prefix がそのまま自動リリース時の semver bump レベルに使われます:
    - feat: → minor
    - fix: / perf: / refactor: / docs: / chore: / ci: → patch
    - feat!: または本文に BREAKING CHANGE: → major
-->

## 概要

<!-- この PR で何を変えたか、1〜2 文で -->

## 変更理由 / 背景

<!-- なぜこの変更が必要か、関連する Issue 番号など -->

Closes #

## 変更内容

<!-- 実装したこと / 触ったファイルの要約 -->

-
-
-

## チェックリスト

- [ ] `npm run typecheck` が通る
- [ ] `npm test` が通る
- [ ] 新規コンポーネント/hook を追加した場合:
  - [ ] `src/components/index.ts` または `src/hooks/index.ts` に export を追加
  - [ ] `src/views/docs/ComponentsOverview.tsx` と `ComponentPage.tsx` に docs エントリを追加
  - [ ] `<Name>.stories.tsx` を追加（compound は手書き、それ以外は `npm run docs:stories`）
  - [ ] `npm run docs:llms` で `public/llms.txt` / `llms-full.txt` を再生成
- [ ] 既存 API を変更した場合、破壊的変更がないことを確認した（破壊的変更なら `feat!:` で書いている）
- [ ] バンドルサイズが想定外に増えていない (`npm run size` で確認)

## スクリーンショット / 動作確認

<!-- UI 変更があれば before/after の画像、または動作 GIF -->
