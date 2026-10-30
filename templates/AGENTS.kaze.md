<!-- kaze:start: npx kaze-init が管理する節。書き換えるときは kaze:end までをまとめて差し替える -->
## Kaze Design System

このリポジトリの画面は [Kaze Design System](https://kaze-design-system.vercel.app) で組む。UI を書く前と、文言を書いたあとに、次を守る。

### 最初に読むもの

- 部品の一覧、props、使う場面と使わない場面: `node_modules/kaze-design-system/dist/llms-full.txt`。入っている版と一致する。見つからなければ https://kaze-design-system.vercel.app/llms-full.txt を読む
- 部品を自作する前に、llms-full.txt に同じ役割の部品がないかを確かめる。あればそれを使う

### 組み方

- CSS はアプリの入口で 1 回だけ読み込む: `import "kaze-design-system/css/all";`
- 部品は `kaze-design-system` から import する。LP の部品は `kaze-design-system/marketing` からでもよい
- 色、余白、角丸、文字サイズは CSS 変数のトークンを使う。たとえば `var(--color-fg)` `var(--space-4)` `var(--radius-box)` `var(--font-size-sm)`。色コードや px を直書きしない。tokens.css にない変数を作らない
- ダークモードは `<html data-theme="dark">` で切り替わる。`<head>` に `ThemeScript`、`<body>` の中を `ThemeProvider` で包む（どちらも `kaze-design-system/hooks`）
- 書体は英数字が Montserrat、かなと漢字が Noto Sans JP。next/font の `variable` で `--font-montserrat` と `--font-noto-sans-jp` を `<html>` に渡すと、Kaze のトークンがそのまま使う
- アイコンは lucide-react などを `icon` に渡す。部品の中で特定のアイコンライブラリに依存させない

### 見た目の決まり

- 温かみのあるグレーを土台に、アクセントの色は 1 つだけ。複数の色を混ぜたグラデーションや、飾りの影を足さない
- カードの上端に色の線を引かない。区別したいときは見出しやラベルで示す
- 見出しに絵文字を使わない

### 文言

- https://kaze-design-system.vercel.app/docs/writing の規則に沿って書く。llms-full.txt の「Writing Japanese UI copy」にも同じ規則がある
- ボタンは押すと何が起きるかを動詞で書く（「保存する」）。エラーは何が起きて、どう直すかを書く。空の状態には次の行動を置く
- 英字と数字の前後には半角スペースを入れる（「Kaze を使う」「12 件」）
- 文言を書いたら `npx kaze-copy src` を実行し、出た指摘を直す。表記の揺れは `npx kaze-copy src --fix` で直る

### 終える前に

- `npx kaze-copy src` の指摘が 0 件になっている
- ライトとダークの両方で、文字が読めて、色が崩れていない
- 画面幅 390px で、横にはみ出していない
<!-- kaze:end -->
