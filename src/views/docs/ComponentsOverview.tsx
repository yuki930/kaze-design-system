import type { CSSProperties, ReactNode } from "react";
import styles from "./docs.module.css";
import Link from "next/link";

export interface ComponentInfo {
  name: string;
  path: string;
  description: string;
}

/**
 * Kaze is "1 package, 3 layers": Foundation (tokens / utilities, shared) →
 * Application UI → Marketing. Foundation has no component entries of its
 * own (it links out to the tokens/colors/utilities docs), so every
 * `Category` below belongs to exactly one of the two component catalogs.
 */
export type Layer = "application-ui" | "marketing";

export interface Category {
  title: string;
  layer: Layer;
  components: ComponentInfo[];
}

export const categories: Category[] = [
  {
    title: "フォーム",
    layer: "application-ui",
    components: [
      { name: "Button", path: "button", description: "ボタンコンポーネント" },
      { name: "FAB", path: "fab", description: "フローティングアクションボタン" },
      { name: "Input", path: "input", description: "テキスト入力" },
      { name: "NumberField", path: "number-field", description: "通貨対応数値入力" },
      { name: "Select", path: "select", description: "セレクトボックス" },
      { name: "Combobox", path: "combobox", description: "絞り込み付きの選択（日本語入力対応）" },
      { name: "DatePicker", path: "date-picker", description: "日付入力とカレンダー（和暦対応）" },
      { name: "Checkbox", path: "checkbox", description: "チェックボックス" },
      { name: "Radio", path: "radio", description: "ラジオボタン" },
      { name: "Textarea", path: "textarea", description: "テキストエリア" },
      { name: "Switch", path: "switch", description: "トグルスイッチ" },
      { name: "FormField", path: "form-field", description: "フォームフィールド" },
      { name: "FilterPill", path: "filter-pill", description: "フィルター用ピルトグル" },
      {
        name: "SegmentedControl",
        path: "segmented-control",
        description: "期間・表示の単一選択切り替え",
      },
    ],
  },
  {
    title: "データ表示",
    layer: "application-ui",
    components: [
      { name: "Card", path: "card", description: "カードコンポーネント" },
      { name: "Badge", path: "badge", description: "バッジ" },
      {
        name: "StatusBadge",
        path: "status-badge",
        description: "データ状態バッジ（live/stale/missing）",
      },
      { name: "Table", path: "table", description: "テーブル" },
      { name: "Metric", path: "metric", description: "メトリクス表示" },
      { name: "Avatar", path: "avatar", description: "アバター" },
      { name: "BarList", path: "bar-list", description: "ランキングリスト" },
      { name: "Tracker", path: "tracker", description: "時系列ステータス" },
      { name: "Watermark", path: "watermark", description: "透かし表示" },
    ],
  },
  {
    title: "チャート",
    layer: "application-ui",
    components: [
      { name: "BarChart", path: "bar-chart", description: "棒グラフ" },
      { name: "DonutChart", path: "donut-chart", description: "ドーナツチャート" },
      { name: "Sparkline", path: "sparkline", description: "スパークライン" },
      {
        name: "LineChart",
        path: "line-chart",
        description: "折れ線・面グラフ（時系列、複数系列）",
      },
      {
        name: "ColumnChart",
        path: "column-chart",
        description: "縦棒グラフ（グループ・積み上げ）",
      },
      { name: "Heatmap", path: "heatmap", description: "ヒートマップ（行列・カレンダー）" },
      { name: "CategoryBar", path: "category-bar", description: "構成比バー" },
      { name: "ChartLegend", path: "chart-legend", description: "チャート凡例（系列トグル）" },
    ],
  },
  {
    title: "フィードバック",
    layer: "application-ui",
    components: [
      { name: "Alert", path: "alert", description: "アラート通知" },
      { name: "Progress", path: "progress", description: "プログレスバー" },
      { name: "Meter", path: "meter", description: "メーター（既知範囲の値表示）" },
      { name: "Skeleton", path: "skeleton", description: "ローディング表示" },
      { name: "EmptyState", path: "empty-state", description: "空状態" },
      { name: "Toast", path: "toast", description: "トースト通知" },
    ],
  },
  {
    title: "ナビゲーション",
    layer: "application-ui",
    components: [
      { name: "Tabs", path: "tabs", description: "タブナビゲーション" },
      { name: "Sidebar", path: "sidebar", description: "サイドバー" },
      { name: "TopBar", path: "topbar", description: "トップバー" },
      { name: "Breadcrumb", path: "breadcrumb", description: "パンくずリスト" },
      { name: "Pagination", path: "pagination", description: "ページネーション" },
      { name: "Stepper", path: "stepper", description: "ステッパー" },
      { name: "Disclosure", path: "disclosure", description: "単一項目の展開UI（コラプシブル）" },
    ],
  },
  {
    title: "オーバーレイ",
    layer: "application-ui",
    components: [
      { name: "Dialog", path: "dialog", description: "ダイアログ" },
      { name: "Tooltip", path: "tooltip", description: "ツールチップ" },
      {
        name: "Popover",
        path: "popover",
        description: "ポップオーバー（クリック起動の浮遊パネル）",
      },
      {
        name: "HelpButton",
        path: "help-button",
        description: "ヘルプポップオーバー（クリック起動）",
      },
      { name: "Dropdown", path: "dropdown", description: "ドロップダウンメニュー" },
      { name: "CommandPalette", path: "command-palette", description: "コマンドパレット" },
    ],
  },
  {
    title: "レイアウト",
    layer: "application-ui",
    components: [
      { name: "Layout (AppLayout)", path: "layout", description: "アプリレイアウト" },
      { name: "Divider", path: "divider", description: "区切り線" },
      { name: "Grid", path: "grid", description: "グリッドレイアウト" },
      { name: "Search", path: "search", description: "検索" },
      { name: "Logo", path: "logo", description: "ロゴ" },
      { name: "Icon", path: "icon", description: "アイコン" },
      { name: "Heading", path: "heading", description: "見出しコンポーネント" },
      { name: "Text", path: "text", description: "テキストコンポーネント" },
    ],
  },
  {
    title: "リスト",
    layer: "application-ui",
    components: [
      { name: "List", path: "list", description: "リスト" },
      { name: "DescriptionList", path: "description-list", description: "定義リスト" },
      { name: "Timeline", path: "timeline", description: "タイムライン" },
    ],
  },
  {
    title: "マーケティング",
    layer: "marketing",
    components: [
      { name: "Navbar", path: "navbar", description: "ナビゲーションバー" },
      { name: "Hero", path: "hero", description: "ヒーローセクション" },
      { name: "Section", path: "section", description: "汎用セクション" },
      { name: "SplitSection", path: "split-section", description: "左右分割セクション" },
      { name: "FeatureGrid", path: "feature-grid", description: "機能紹介グリッド" },
      { name: "Stats", path: "stats", description: "数値ハイライト" },
      { name: "Pricing", path: "pricing", description: "料金プラン" },
      { name: "Testimonial", path: "testimonial", description: "お客様の声" },
      { name: "FAQ", path: "faq", description: "よくある質問" },
      { name: "CTABanner", path: "cta-banner", description: "コール・トゥ・アクション" },
      { name: "LPFooter", path: "lp-footer", description: "サイトフッター" },
    ],
  },
];

interface FoundationLink {
  name: string;
  href: string;
  description: string;
}

const foundationLinks: FoundationLink[] = [
  {
    name: "デザイントークン",
    href: "/docs/tokens",
    description: "カラー、余白、タイポグラフィなどの CSS カスタムプロパティ",
  },
  {
    name: "カラー",
    href: "/docs/colors",
    description: "12色相 × 10階調のパレットとセマンティックカラー",
  },
  {
    name: "ユーティリティ",
    href: "/docs/utilities",
    description: "レイアウト、スペーシング、テキストのユーティリティクラス",
  },
];

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: "var(--space-4)",
};

const layerDescriptionStyle: CSSProperties = {
  fontSize: "var(--font-size-sm)",
  color: "var(--color-fg-secondary)",
  marginBottom: "var(--space-6)",
  maxWidth: "56ch",
};

const countBadgeStyle: CSSProperties = {
  marginLeft: "var(--space-2)",
  fontSize: "var(--font-size-sm)",
  fontWeight: "var(--font-weight-medium)",
  color: "var(--color-fg-tertiary)",
};

/** Single overview card. Shared by Foundation links and component entries. */
function OverviewCard({
  href,
  name,
  description,
}: {
  href: string;
  name: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      style={{ textDecoration: "none", color: "inherit" }}
      onMouseEnter={(e) => {
        const card = e.currentTarget.firstElementChild as HTMLElement | null;
        if (!card) return;
        card.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
        card.style.borderColor = "var(--color-primary)";
      }}
      onMouseLeave={(e) => {
        const card = e.currentTarget.firstElementChild as HTMLElement | null;
        if (!card) return;
        card.style.boxShadow = "none";
        card.style.borderColor = "var(--color-border)";
      }}
    >
      <div
        style={{
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-5)",
          height: "100%",
          transition:
            "box-shadow var(--duration-fast) var(--ease-default), border-color var(--duration-fast) var(--ease-default)",
          cursor: "pointer",
          background: "var(--color-surface)",
        }}
      >
        <h3
          style={{
            fontSize: "var(--font-size-md)",
            fontWeight: "var(--font-weight-semibold)",
            marginBottom: "var(--space-1)",
          }}
        >
          {name}
        </h3>
        <p
          style={{
            fontSize: "var(--font-size-sm)",
            color: "var(--color-fg-secondary)",
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    </Link>
  );
}

function LayerHeading({ children, count }: { children: ReactNode; count: number }) {
  return (
    <h2 className={styles.sectionTitle}>
      {children}
      <span style={countBadgeStyle}>{count}</span>
    </h2>
  );
}

export function ComponentsOverview() {
  const applicationCategories = categories.filter((c) => c.layer === "application-ui");
  const marketingCategories = categories.filter((c) => c.layer === "marketing");
  const marketingComponents = marketingCategories.flatMap((c) => c.components);

  const applicationCount = applicationCategories.reduce((sum, c) => sum + c.components.length, 0);
  const marketingCount = marketingComponents.length;
  const totalCount = applicationCount + marketingCount;

  return (
    <div>
      <h1 className={styles.pageTitle}>コンポーネント一覧</h1>
      <p className={styles.pageDescription}>
        Kaze Design System は Foundation（デザイントークンとユーティリティ）を土台に、Application
        UI（
        {applicationCount}）と Marketing（{marketingCount}）の2つのカタログで全{totalCount}
        個のコンポーネントを提供します。
        各コンポーネントをクリックすると、詳細なドキュメントとプレビューを確認できます。
      </p>

      {/* ── Foundation ────────────────────────────────────────── */}
      <section style={{ marginBottom: "var(--space-12)" }}>
        <h2 className={styles.sectionTitle}>Foundation</h2>
        <p style={layerDescriptionStyle}>
          Application UI と Marketing
          の両カタログが共有する土台です。色、余白、タイポグラフィはすべてここから継承されます。
        </p>
        <div style={gridStyle}>
          {foundationLinks.map((link) => (
            <OverviewCard
              key={link.href}
              href={link.href}
              name={link.name}
              description={link.description}
            />
          ))}
        </div>
      </section>

      {/* ── Application UI ────────────────────────────────────── */}
      <section style={{ marginBottom: "var(--space-12)" }}>
        <LayerHeading count={applicationCount}>Application UI</LayerHeading>
        <p style={layerDescriptionStyle}>
          管理画面やダッシュボードなど、業務アプリケーションの画面を組み立てるための8カテゴリです。
        </p>

        {applicationCategories.map((category) => (
          <div key={category.title} style={{ marginBottom: "var(--space-8)" }}>
            <h3 className={styles.subsectionTitle}>
              {category.title}
              <span style={countBadgeStyle}>{category.components.length}</span>
            </h3>
            <div style={gridStyle}>
              {category.components.map((component) => (
                <OverviewCard
                  key={component.path}
                  href={`/docs/components/${component.path}`}
                  name={component.name}
                  description={component.description}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── Marketing ─────────────────────────────────────────── */}
      <section>
        <LayerHeading count={marketingCount}>Marketing</LayerHeading>
        <p style={layerDescriptionStyle}>
          ランディングページやプロダクトサイトを組み立てるための、正準の{marketingCount}
          コンポーネントです。
        </p>
        <div style={gridStyle}>
          {marketingComponents.map((component) => (
            <OverviewCard
              key={component.path}
              href={`/docs/components/${component.path}`}
              name={component.name}
              description={component.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
