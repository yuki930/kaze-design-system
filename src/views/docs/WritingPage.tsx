import { type CopyRuleCategory, copyRules, writingGuide } from "../../writing";
import styles from "./docs.module.css";

const categoryTitles: Record<CopyRuleCategory, { title: string; note: string }> = {
  notation: { title: "表記", note: "記号、英数字、スペース、長音のそろえ方。" },
  plain: { title: "開いた言葉", note: "硬い漢語や漢字を、読みやすい言葉に開く。" },
  clarity: { title: "伝わる書き方", note: "読み手が次に何をすればよいか分かる文にする。" },
  ai: {
    title: "AI の文章に多い言い回し",
    note: "AI が書いた文に出やすい決まり文句と比喩。文脈で判断し、意味を変えずに直す。",
  },
};

const categoryOrder: CopyRuleCategory[] = ["notation", "plain", "clarity", "ai"];

export function WritingPage() {
  return (
    <div>
      <h1 className={styles.pageTitle}>文言ガイド</h1>
      <p className={styles.pageDescription}>
        Kaze の画面に載せる日本語の書き方です。人が読んで迷わず、AI
        に渡してもそのまま守れるように、原則、場面ごとの型、機械で検査できる規則の 3
        段で書いています。部品ごとの書き方は、各コンポーネントのページの「文言」にあります。
      </p>

      <h2 className={styles.sectionTitle}>原則</h2>
      <ol className={styles.guideList}>
        {writingGuide.principles.map((p) => (
          <li key={p.title}>
            <strong>{p.title}</strong>
            <br />
            {p.body}
          </li>
        ))}
      </ol>

      <h2 className={styles.sectionTitle}>文体</h2>
      <ul className={styles.guideList}>
        {writingGuide.tone.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      <h2 className={styles.sectionTitle}>場面ごとの型</h2>
      <div className={styles.tableScroll}>
        <table className={styles.propsTable}>
          <thead>
            <tr>
              <th>場面</th>
              <th>書き方</th>
              <th>よい例</th>
              <th>避ける例</th>
            </tr>
          </thead>
          <tbody>
            {writingGuide.patterns.map((p) => (
              <tr key={p.scene}>
                <td>{p.scene}</td>
                <td>{p.rule}</td>
                <td>{p.good.join(" / ")}</td>
                <td>{p.bad.join(" / ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className={styles.sectionTitle}>規則</h2>
      <p>
        どの規則も <span className={styles.inlineCode}>kaze-copy</span> で検査できます。error
        は直すもの、warning は文脈を見て直すものです。「自動」の付いた規則は{" "}
        <span className={styles.inlineCode}>--fix</span> で書き換わります。
      </p>
      {categoryOrder.map((category) => {
        const rules = copyRules.filter((r) => r.category === category);
        if (rules.length === 0) return null;
        return (
          <section key={category}>
            <h3 className={styles.subsectionTitle}>{categoryTitles[category].title}</h3>
            <p className={styles.tableNote}>{categoryTitles[category].note}</p>
            <div className={styles.tableScroll}>
              <table className={`${styles.propsTable} ${styles.rulesTable}`}>
                <thead>
                  <tr>
                    <th>規則</th>
                    <th>避ける例</th>
                    <th>こう書く</th>
                    <th>種類</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map((r) => (
                    <tr key={r.id}>
                      <td>
                        {r.message}
                        <br />
                        <span className={styles.inlineCode}>{r.id}</span>
                        {!r.default && "（既定ではオフ）"}
                      </td>
                      <td>{r.bad}</td>
                      <td>{r.good}</td>
                      <td>
                        {r.level}
                        {r.fix !== undefined && "・自動"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      <h2 className={styles.sectionTitle}>検査する</h2>
      <p>リポジトリの文言をまとめて検査します。直せるものは --fix で書き換わります。</p>
      <pre className={styles.codeBlock}>{`npx kaze-copy src README.md
npx kaze-copy src --fix
npx kaze-copy --rules   # 規則の一覧`}</pre>
      <p>
        行に <span className={styles.inlineCode}>kaze-copy-ignore</span> と書くとその行を、
        <span className={styles.inlineCode}>kaze-copy-ignore-next-line</span> と書くと次の行を、
        <span className={styles.inlineCode}>kaze-copy-ignore-start</span> から
        <span className={styles.inlineCode}>kaze-copy-ignore-end</span>{" "}
        までを読み飛ばします。「」で囲んだ語は、例として引いた言葉とみなして検査しません。
      </p>
      <p>コードから使う場合は、同じ規則を関数で呼べます。</p>
      {/* kaze-copy-ignore-start: the example shows copy that breaks the rules on purpose */}
      <pre
        className={styles.codeBlock}
      >{`import { checkCopy, fixCopy } from "kaze-design-system/writing";

checkCopy("導入は容易です");
// [{ ruleId: "plain/kantan", line: 1, column: 4, match: "容易", suggestion: "かんたん", ... }]

fixCopy("全ての設定を保存して下さい");
// "すべての設定を保存してください"`}</pre>
      {/* kaze-copy-ignore-end */}

      <h2 className={styles.sectionTitle}>AI と書く</h2>
      <p>
        この規則は <a href="/llms-full.txt">llms-full.txt</a> にも入っています。AI
        に画面を作らせるときは、書いたあとに kaze-copy を実行させると、規則に沿って自分で直せます。
      </p>
    </div>
  );
}
