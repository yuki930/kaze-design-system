import styles from "./docs.module.css";

const STARTER_URL = "https://github.com/yuki930/kaze-design-system/tree/main/examples/nextjs";

const prompts = [
  "Kaze で、取引先の一覧画面を作って。検索と、状態での絞り込みを付けて",
  "請求書の詳細を Drawer で開けるようにして",
  "請求書がまだないときの空の状態を、EmptyState で用意して",
  "このページを LP にして。Hero、FeatureGrid、Pricing、FAQ の順で",
];

export function AiStartPage() {
  return (
    <div>
      <h1 className={styles.pageTitle}>AI と始める</h1>
      <p className={styles.pageDescription}>
        Claude Code、Codex、Cursor、Gemini CLI などの AI に頼むだけで、Kaze
        の部品と文言の規則に沿った画面ができるようにする手順です。AI
        が読む指示書を置き、書いた文言をコマンドで検査します。
      </p>

      <h2 className={styles.sectionTitle}>新しく始める</h2>
      <p>
        Next.js の雛形から始めます。請求書の一覧画面が 1 枚と、AI 向けの AGENTS.md と CLAUDE.md
        が入っています。
      </p>
      <pre
        className={styles.codeBlock}
      >{`npx create-next-app@latest my-app --example "${STARTER_URL}"
cd my-app
npm run dev`}</pre>

      <h2 className={styles.sectionTitle}>今のプロジェクトに入れる</h2>
      <p>
        パッケージを入れてから <span className={styles.inlineCode}>kaze-init</span>{" "}
        を実行すると、AGENTS.md に Kaze の節が書き込まれます。すでに AGENTS.md
        があるときは、その内容を残したまま節を足します。CLAUDE.md と Gemini CLI
        の設定からも読み込まれるようにします。
      </p>
      <pre className={styles.codeBlock}>{`npm install kaze-design-system
npx kaze-init`}</pre>
      <p>
        CSS をアプリの入口で 1 回だけ読み込みます。書体は next/font で DM Sans、Montserrat、Noto
        Sans JP を読み込み、<span className={styles.inlineCode}>--font-dm-sans</span>、
        <span className={styles.inlineCode}>--font-montserrat</span>、
        <span className={styles.inlineCode}>--font-noto-sans-jp</span> を{" "}
        <span className={styles.inlineCode}>{"<html>"}</span> に渡します。書き方は雛形の
        app/layout.tsx と同じです。ほかの組み合わせは
        <a href="/docs/fonts">書体</a>のページにあります。
      </p>
      <pre className={styles.codeBlock}>{`import "kaze-design-system/css/all";`}</pre>

      <h2 className={styles.sectionTitle}>AI に頼む</h2>
      <p>あとは、ふだんの言葉で頼みます。たとえば次のように頼めます。</p>
      <ul className={styles.guideList}>
        {prompts.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>

      <h2 className={styles.sectionTitle}>AI が読むもの</h2>
      <div className={styles.tableScroll}>
        <table className={styles.propsTable}>
          <thead>
            <tr>
              <th>ファイル</th>
              <th>中身</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>AGENTS.md</td>
              <td>
                Kaze での組み方、見た目の決まり、文言の規則、終える前の確認。kaze-init が書き込む
              </td>
            </tr>
            <tr>
              <td>CLAUDE.md</td>
              <td>Claude Code 向け。AGENTS.md を読み込む 1 行だけ</td>
            </tr>
            <tr>
              <td>.gemini/settings.json</td>
              <td>Gemini CLI 向け。AGENTS.md も読み込む設定。ほかの設定は残す</td>
            </tr>
            <tr>
              <td>node_modules/kaze-design-system/dist/llms-full.txt</td>
              <td>全部品の props、使う場面と使わない場面、文言の規則。入っている版と一致する</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className={styles.sectionTitle}>文言を検査する</h2>
      <p>
        AI が書いた文言は、<a href="/docs/writing">文言ガイド</a>
        の規則で検査します。表記の揺れは --fix で直ります。AGENTS.md
        にもこの手順が書いてあるので、AI は画面を作ったあとに自分で実行します。
      </p>
      <pre className={styles.codeBlock}>{`npx kaze-copy src
npx kaze-copy src --fix`}</pre>

      <h2 className={styles.sectionTitle}>Kaze を更新したとき</h2>
      <p>
        もう一度 <span className={styles.inlineCode}>npx kaze-init</span> を実行すると、AGENTS.md の
        Kaze の節だけが新しい版の内容に差し替わります。
      </p>
    </div>
  );
}
