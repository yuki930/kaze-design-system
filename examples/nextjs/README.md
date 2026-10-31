# Kaze Next.js Starter

[Kaze Design System](https://kaze-design-system.vercel.app) で組んだ Next.js の雛形です。請求書の一覧画面が 1 枚入っています。AI コーディングアシスタントが Kaze で画面を組めるように、指示書を最初から置いています。AGENTS.md、CLAUDE.md、Gemini CLI の設定（.gemini/settings.json）の 3 つです。

## 始め方

```bash
npx create-next-app@latest my-app --example "https://github.com/yuki930/kaze-design-system/tree/main/examples/nextjs"
cd my-app
npm run dev
```

http://localhost:3000 を開くと、請求書の一覧が表示されます。

## AI に頼む

Claude Code や Gemini CLI などで、そのまま頼めます。AGENTS.md に Kaze の組み方と文言の規則が書いてあるので、AI はそれに沿って部品を選びます。

- 「取引先の一覧画面を、請求書の画面と同じ組み方で作って」
- 「請求書の詳細を Drawer で開けるようにして」
- 「空の状態を EmptyState で用意して」

## 文言を検査する

```bash
npm run check:copy
```

文言ガイド（https://kaze-design-system.vercel.app/docs/writing）に反した日本語を一覧にします。`npx kaze-copy app --fix` で、表記の揺れは自動で直ります。

## AGENTS.md を最新にする

Kaze を更新したら、次のコマンドで AGENTS.md の Kaze の節だけを差し替えられます。

```bash
npx kaze-init
```
