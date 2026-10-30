import { FontSetSwitcher } from "./FontSetSwitcher";
import styles from "./docs.module.css";

const sets = [
  {
    key: "standard",
    name: "標準（既定）",
    fonts: "英字 DM Sans、数字 Montserrat、和文 Noto Sans JP",
    feel: "締まっていて、数字が映える。英字は和文と同じ幅で並ぶ",
    load: `import { DM_Sans, Montserrat, Noto_Sans_JP } from "next/font/google";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-noto-sans-jp" });

<html className={\`\${dmSans.variable} \${montserrat.variable} \${notoSansJP.variable}\`}>`,
  },
  {
    key: "neutral",
    name: "ニュートラル",
    fonts: "英字と数字 Inter、和文 Noto Sans JP",
    feel: "癖がなく、小さい UI の文字が最も安定する。業務画面向き",
    load: `import { Inter, Noto_Sans_JP } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-noto-sans-jp" });

<html data-font="neutral" className={\`\${inter.variable} \${notoSansJP.variable}\`}>`,
  },
  {
    key: "crisp",
    name: "硬質",
    fonts: "和文も英字も IBM Plex Sans JP",
    feel: "和文と欧文が一緒に設計された書体。知的ですっきりした印象",
    load: `import { IBM_Plex_Sans_JP } from "next/font/google";

const plex = IBM_Plex_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-jp",
});

<html data-font="crisp" className={plex.variable}>`,
  },
];

export function FontsPage() {
  return (
    <div>
      <h1 className={styles.pageTitle}>書体</h1>
      <p className={styles.pageDescription}>
        Kaze は書体の組み合わせを 3 つから選べます。どれも無料のオープンソース書体で、palt
        が効きます。組み合わせごとに、見出しの太さ、字間、数字の書体が日本語に合わせて調整されています。
      </p>

      <h2 className={styles.sectionTitle}>切り替える</h2>
      <p>切り替えるとサイト全体の書体が変わります。色やテーマとは別に組み合わせられます。</p>
      <FontSetSwitcher />

      <h2 className={styles.sectionTitle}>3 つの組み合わせ</h2>
      {sets.map((s) => (
        <section key={s.key}>
          <h3 className={styles.subsectionTitle}>{s.name}</h3>
          <p>
            {s.fonts}。{s.feel}。
          </p>
          <p>書体の読み込み（Next.js の例）:</p>
          <pre className={styles.codeBlock}>{s.load}</pre>
        </section>
      ))}

      <h2 className={styles.sectionTitle}>組版の値</h2>
      <p>どの組み合わせでも、次のトークンで日本語向けに組みます。</p>
      <div className={styles.tableScroll}>
        <table className={styles.propsTable}>
          <thead>
            <tr>
              <th>トークン</th>
              <th>値</th>
              <th>使う場所</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>--font-sans</td>
              <td>組み合わせごとの書体</td>
              <td>本文と UI の文字</td>
            </tr>
            <tr>
              <td>--font-numeric</td>
              <td>標準は Montserrat、ほかは本文と同じ</td>
              <td>Metric、Stats、表の数値の列、チャートの数値</td>
            </tr>
            <tr>
              <td>--font-weight-heading</td>
              <td>600</td>
              <td>Heading、Hero、SectionHeader、CTABanner</td>
            </tr>
            <tr>
              <td>--letter-spacing-heading</td>
              <td>0.01em</td>
              <td>見出し。負の字間はかなを潰すので使わない</td>
            </tr>
            <tr>
              <td>--letter-spacing-body</td>
              <td>0.02em</td>
              <td>本文全体。palt で詰めたかなが触れ合わないように</td>
            </tr>
            <tr>
              <td>--letter-spacing-numeric</td>
              <td>0</td>
              <td>数字。桁がそろって見えるように</td>
            </tr>
            <tr>
              <td>--line-height-body</td>
              <td>1.85</td>
              <td>Prose や記事のような長い文章</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className={styles.sectionTitle}>書体を足すときは</h2>
      <p>
        日本語の書体は、palt が効くかを確かめてから選びます。Google Fonts
        で配信される日本語書体の多くは palt を持っていません。効くのは Noto Sans JP、Noto Serif
        JP、IBM Plex Sans JP などです。
      </p>
    </div>
  );
}
