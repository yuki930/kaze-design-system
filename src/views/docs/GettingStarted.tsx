import styles from "./docs.module.css";
import { categories } from "./ComponentsOverview";
import { Atom, FileCode2, Package, Server, Paintbrush } from "lucide-react";

export function GettingStarted() {
  return (
    <div>
      {/* Introduction */}
      <h1 className={styles.pageTitle}>はじめに</h1>
      <p className={styles.pageDescription}>
        Kaze (風) は、白と温かみのあるグレーを基調にした超ミニマルな React デザインシステムです。
        日本語組版とデータ密度の高い管理画面・金融 UI に最適化されており、明快さ・情報密度・
        落ち着いた美しさを軸に設計しています。派手な装飾ではなく、長時間見続けても疲れない静かな
        インターフェースを目指しています。
      </p>

      {/* Prerequisites */}
      <h2 className={styles.sectionTitle}>前提条件</h2>
      <ul className={styles.checkList}>
        <li className={styles.checkListItem}>
          <Atom size={18} className={styles.checkListIcon} />
          <span>React 18 以上（React 19 推奨）</span>
        </li>
        <li className={styles.checkListItem}>
          <FileCode2 size={18} className={styles.checkListIcon} />
          <span>TypeScript 5 以上（任意・推奨）</span>
        </li>
        <li className={styles.checkListItem}>
          <Package size={18} className={styles.checkListIcon} />
          <span>任意のバンドラー: Vite, Next.js, Remix, webpack</span>
        </li>
        <li className={styles.checkListItem}>
          <Server size={18} className={styles.checkListIcon} />
          <span>SSR / RSC 対応: CSS カスタムプロパティのみで動作</span>
        </li>
        <li className={styles.checkListItem}>
          <Paintbrush size={18} className={styles.checkListIcon} />
          <span>
            Tailwind CSS と併用可（レイヤーは kaze.* に分離。併用時は css/core を読み込む）
          </span>
        </li>
      </ul>

      {/* Installation */}
      <h2 className={styles.sectionTitle}>インストール</h2>
      <p>npm で Kaze デザインシステムのパッケージをインストールします。</p>
      <pre className={styles.codeBlock}>{`npm install kaze-design-system`}</pre>

      {/* CSS Setup */}
      <h2 className={styles.sectionTitle}>CSS の読み込み</h2>
      <p>
        <strong>推奨</strong>: CSS を一括で読み込む方法です。
      </p>
      <pre className={styles.codeBlock}>{`import "kaze-design-system/css/all";`}</pre>
      <p>
        <strong>上級</strong>: 個別の CSS
        ファイルを読み込んで、必要なスタイルだけに絞ることもできます。
      </p>
      <pre className={styles.codeBlock}>
        {`import "kaze-design-system/css/tokens";      // デザイントークン（カラー、スペーシング、タイポグラフィ）
import "kaze-design-system/css/reset";       // CSS リセット
import "kaze-design-system/css/components";  // コンポーネントスタイル
import "kaze-design-system/css/utilities";   // ユーティリティクラス`}
      </pre>

      {/* Basic Usage */}
      <h2 className={styles.sectionTitle}>基本的な使い方</h2>
      <p>パッケージからコンポーネントを import して、React アプリケーションで使用します。</p>
      <pre className={styles.codeBlock}>
        {`import { Button, Card, CardHeader, CardTitle, CardBody } from "kaze-design-system";

function Dashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ポートフォリオ</CardTitle>
      </CardHeader>
      <CardBody>
        <p>資産の概要をご確認ください。</p>
        <Button>詳細を見る</Button>
      </CardBody>
    </Card>
  );
}`}
      </pre>
      <p>
        LP・キャンペーンページ向けの Marketing コンポーネント（Hero, PricingGrid, CTABanner など）は{" "}
        <code className={styles.inlineCode}>kaze-design-system/marketing</code> サブパスからも
        import できます。管理画面では Application UI 層だけを、LP では Marketing
        層だけを使う、というレイヤーの使い分けを import 文で表現できます。
      </p>
      <pre className={styles.codeBlock}>
        {`// Marketing レイヤー（ルートからの import も引き続き有効）
import { Hero, PricingGrid, CTABanner } from "kaze-design-system/marketing";`}
      </pre>

      {/* Theme Setup */}
      <h2 className={styles.sectionTitle}>テーマの設定</h2>
      <p>
        アプリケーションを <code className={styles.inlineCode}>ThemeProvider</code> で囲むと、
        ライト / ダークテーマの切り替えが有効になります。
      </p>
      <pre className={styles.codeBlock}>
        {`import { ThemeProvider } from "kaze-design-system";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <YourApp />
    </ThemeProvider>
  );
}`}
      </pre>
      <p>
        <code className={styles.inlineCode}>ThemeProvider</code> の{" "}
        <code className={styles.inlineCode}>defaultTheme</code> には{" "}
        <code className={styles.inlineCode}>"light"</code>、{" "}
        <code className={styles.inlineCode}>"dark"</code>、{" "}
        <code className={styles.inlineCode}>"system"</code> を指定できます。
      </p>
      <p>
        テーマは CSS custom properties （カスタムプロパティ）で実装されています。
        <code className={styles.inlineCode}>data-theme</code>{" "}
        属性の切り替えだけで全コンポーネントが自動的にテーマに追従するため、ランタイムコストはゼロです。
        トークンの上書きも通常の CSS で簡単に行えます。
      </p>

      {/* Available Components */}
      <h2 className={styles.sectionTitle}>収録コンポーネント</h2>
      <p>
        Kaze には {categories.length} カテゴリ・
        {categories.reduce((n, c) => n + c.components.length, 0)}{" "}
        個のプロダクション対応コンポーネントが含まれています。 詳細は{" "}
        <a href="/docs/components" style={{ color: "var(--color-info-fg)" }}>
          コンポーネント一覧
        </a>
        をご覧ください。
      </p>
      <div className={styles.preview}>
        {categories.map((category) => (
          <p key={category.title}>
            <strong>{category.title}</strong>: {category.components.map((c) => c.name).join(", ")}
          </p>
        ))}
      </div>

      {/* Design Principles */}
      <h2 className={styles.sectionTitle}>デザインの考え方</h2>
      <p>Kaze は可読性・情報密度・視覚的な静けさを重視した、明確なデザイン原則に基づいています。</p>
      <div className={styles.preview}>
        <p>
          <strong>温かみのあるニュートラルグレーのミニマルパレット</strong>: カラーシステム全体を
          わずかに温度を帯びたグレースケールで統一し、集中を妨げない落ち着いたインターフェースを
          実現しています。アクセントカラーは意図的に最小限に抑え、データそのものを主役にします。
        </p>
        <p>
          <strong>日本語に最適化した組版</strong>: ルートのフォントサイズはブラウザ既定（通常 16px）
          を尊重し、本文の行間 1.75、禁則処理（line-break:
          strict）、約物の詰め（text-spacing-trim）、 文節単位の改行（word-break:
          auto-phrase）を既定で適用しています。
        </p>
        <p>
          <strong>Noto Sans JP + Montserrat</strong>: 本文と UI は Noto Sans JP を主体にし、
          かな・漢字・欧文の字面と太さをそろえています。見出しと大きな数値（Metric、Stats、料金）だけ
          Montserrat を重ね、プロポーショナルかな（palt）もこの表示用テキストに限って適用します。
        </p>
      </div>
    </div>
  );
}
