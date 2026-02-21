import styles from "./docs.module.css";
import { Atom, FileCode2, Package, Server, Paintbrush } from "lucide-react";

export function GettingStarted() {
  return (
    <div>
      {/* Introduction */}
      <h1 className={styles.pageTitle}>はじめに</h1>
      <p className={styles.pageDescription}>
        Kaze (風) は Zinc ベースの超ミニマルなデザインシステムです。日本語組版とデータ密度の高い金融
        UI に最適化されており、明快さ・情報密度・落ち着いた美しさを軸に設計しています。
        洗練されたインターフェースを、モダンかつ抑制の効いたトーンで構築できます。
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
          <span>SSR / RSC 対応 — CSS カスタムプロパティのみで動作</span>
        </li>
        <li className={styles.checkListItem}>
          <Paintbrush size={18} className={styles.checkListIcon} />
          <span>Tailwind CSS との併用可（BEM スコープのため競合なし）</span>
        </li>
      </ul>

      {/* Installation */}
      <h2 className={styles.sectionTitle}>インストール</h2>
      <p>
        npm で Kaze デザインシステムのパッケージをインストールします。
      </p>
      <pre className={styles.codeBlock}>
{`npm install @kaze-ds/react`}
      </pre>

      {/* CSS Setup */}
      <h2 className={styles.sectionTitle}>CSS の読み込み</h2>
      <p>
        <strong>推奨</strong> — CSS を一括で読み込む方法です。
      </p>
      <pre className={styles.codeBlock}>
{`import "@kaze-ds/react/css/all";`}
      </pre>
      <p>
        <strong>上級</strong> — 個別の CSS ファイルを読み込んで、必要なスタイルだけに絞ることもできます。
      </p>
      <pre className={styles.codeBlock}>
{`import "@kaze-ds/react/css/tokens";      // デザイントークン（カラー、スペーシング、タイポグラフィ）
import "@kaze-ds/react/css/reset";       // CSS リセット
import "@kaze-ds/react/css/components";  // コンポーネントスタイル
import "@kaze-ds/react/css/utilities";   // ユーティリティクラス`}
      </pre>

      {/* Basic Usage */}
      <h2 className={styles.sectionTitle}>基本的な使い方</h2>
      <p>
        パッケージからコンポーネントを import して、React アプリケーションで使用します。
      </p>
      <pre className={styles.codeBlock}>
{`import { Button, Card, CardHeader, CardTitle, CardBody } from "@kaze-ds/react";

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

      {/* Theme Setup */}
      <h2 className={styles.sectionTitle}>テーマの設定</h2>
      <p>
        アプリケーションを{" "}
        <code className={styles.inlineCode}>ThemeProvider</code> で囲むと、
        ライト / ダークテーマの切り替えが有効になります。
      </p>
      <pre className={styles.codeBlock}>
{`import { ThemeProvider } from "@kaze-ds/react/hooks";

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
        テーマは CSS custom properties
        （カスタムプロパティ）で実装されています。
        <code className={styles.inlineCode}>data-theme</code>{" "}
        属性の切り替えだけで全コンポーネントが自動的にテーマに追従するため、ランタイムコストはゼロです。
        トークンの上書きも通常の CSS で簡単に行えます。
      </p>

      {/* Available Components */}
      <h2 className={styles.sectionTitle}>収録コンポーネント</h2>
      <p>
        Kaze には 9 カテゴリ・59 個のプロダクション対応コンポーネントが含まれています。
        詳細は{" "}
        <a href="/docs/components" style={{ color: "var(--color-info-fg)" }}>
          コンポーネント一覧
        </a>
        をご覧ください。
      </p>
      <div className={styles.preview}>
        <p><strong>フォーム</strong> — Button, FAB, Input, NumberField, Select, Checkbox, Radio, Textarea, Switch, FormField</p>
        <p><strong>データ表示</strong> — Card, Badge, Table, Metric, Avatar, BarList, Tracker, Watermark</p>
        <p><strong>チャート</strong> — BarChart, DonutChart, Sparkline</p>
        <p><strong>フィードバック</strong> — Alert, Progress, Meter, Skeleton, EmptyState, Toast</p>
        <p><strong>ナビゲーション</strong> — Tabs, Sidebar, TopBar, Breadcrumb, Pagination, Stepper</p>
        <p><strong>オーバーレイ</strong> — Dialog, Tooltip, Dropdown, CommandPalette</p>
        <p><strong>レイアウト</strong> — AppLayout, Divider, Grid, Search, Logo, Icon, Heading, Text</p>
        <p><strong>リスト</strong> — List, DescriptionList, Timeline</p>
        <p><strong>マーケティング</strong> — Navbar, Hero, Section, SplitSection, FeatureGrid, Stats, Pricing, Testimonial, FAQ, CTABanner, LPFooter</p>
      </div>

      {/* Design Principles */}
      <h2 className={styles.sectionTitle}>デザインの考え方</h2>
      <p>
        Kaze は可読性・情報密度・視覚的な静けさを重視した、明確なデザイン原則に基づいています。
      </p>
      <div className={styles.preview}>
        <p>
          <strong>Zinc ベースのミニマルパレット</strong> — カラーシステム全体を
          Zinc トーンで統一し、ニュートラルで集中を妨げないインターフェースを実現しています。
          アクセントカラーは意図的に最小限に抑え、データそのものを主役にします。
        </p>
        <p>
          <strong>日本語に最適化した 15px ベースフォント</strong> — ベースフォントサイズ
          15px は、データ密度の高いレイアウトで日本語と欧文が混在するテキストを
          読みやすくするために選定しています。行間やスペーシングも CJK 文字の描画に合わせて調整済みです。
        </p>
        <p>
          <strong>Montserrat + Noto Sans JP</strong> — 見出しや UI ラベルには
          Montserrat を使い、クリーンで幾何学的な印象を与えます。本文や日本語コンテンツには
          Noto Sans JP を採用し、かな・漢字・ラテン文字のすべてで一貫した表示を確保しています。
        </p>
      </div>
    </div>
  );
}
