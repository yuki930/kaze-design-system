import styles from "./docs.module.css";
import Link from "next/link";

interface ComponentInfo {
  name: string;
  path: string;
  description: string;
}

interface Category {
  title: string;
  components: ComponentInfo[];
}

const categories: Category[] = [
  {
    title: "フォーム",
    components: [
      { name: "Button", path: "button", description: "ボタンコンポーネント" },
      { name: "FAB", path: "fab", description: "フローティングアクションボタン" },
      { name: "Input", path: "input", description: "テキスト入力" },
      { name: "NumberField", path: "number-field", description: "通貨対応数値入力" },
      { name: "Select", path: "select", description: "セレクトボックス" },
      { name: "Checkbox", path: "checkbox", description: "チェックボックス" },
      { name: "Radio", path: "radio", description: "ラジオボタン" },
      { name: "Textarea", path: "textarea", description: "テキストエリア" },
      { name: "Switch", path: "switch", description: "トグルスイッチ" },
      { name: "FormField", path: "form-field", description: "フォームフィールド" },
    ],
  },
  {
    title: "データ表示",
    components: [
      { name: "Card", path: "card", description: "カードコンポーネント" },
      { name: "Badge", path: "badge", description: "バッジ" },
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
    components: [
      { name: "BarChart", path: "bar-chart", description: "棒グラフ" },
      { name: "DonutChart", path: "donut-chart", description: "ドーナツチャート" },
      { name: "Sparkline", path: "sparkline", description: "スパークライン" },
    ],
  },
  {
    title: "フィードバック",
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
    components: [
      { name: "Tabs", path: "tabs", description: "タブナビゲーション" },
      { name: "Sidebar", path: "sidebar", description: "サイドバー" },
      { name: "TopBar", path: "topbar", description: "トップバー" },
      { name: "Breadcrumb", path: "breadcrumb", description: "パンくずリスト" },
      { name: "Pagination", path: "pagination", description: "ページネーション" },
      { name: "Stepper", path: "stepper", description: "ステッパー" },
    ],
  },
  {
    title: "オーバーレイ",
    components: [
      { name: "Dialog", path: "dialog", description: "ダイアログ" },
      { name: "Tooltip", path: "tooltip", description: "ツールチップ" },
      { name: "Dropdown", path: "dropdown", description: "ドロップダウンメニュー" },
      { name: "CommandPalette", path: "command-palette", description: "コマンドパレット" },
    ],
  },
  {
    title: "レイアウト",
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
    components: [
      { name: "List", path: "list", description: "リスト" },
      { name: "DescriptionList", path: "description-list", description: "定義リスト" },
      { name: "Timeline", path: "timeline", description: "タイムライン" },
    ],
  },
  {
    title: "マーケティング",
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

export function ComponentsOverview() {
  return (
    <div>
      <h1 className={styles.pageTitle}>コンポーネント一覧</h1>
      <p className={styles.pageDescription}>
        Kaze Design Systemで利用可能な全59コンポーネントをカテゴリ別に紹介します。
        各コンポーネントをクリックすると、詳細なドキュメントとプレビューを確認できます。
      </p>

      {categories.map((category) => (
        <section key={category.title} style={{ marginBottom: "2rem" }}>
          <h2 className={styles.sectionTitle}>{category.title}</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1rem",
            }}
          >
            {category.components.map((component) => (
              <Link
                key={component.path}
                href={`/docs/components/${component.path}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div
                  style={{
                    border: "1px solid var(--color-border, #e2e8f0)",
                    borderRadius: "8px",
                    padding: "1.25rem",
                    transition: "box-shadow 0.2s, border-color 0.2s",
                    cursor: "pointer",
                    background: "var(--color-surface, #fff)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0, 0, 0, 0.08)";
                    e.currentTarget.style.borderColor =
                      "var(--color-primary, #3b82f6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor =
                      "var(--color-border, #e2e8f0)";
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      marginBottom: "0.25rem",
                    }}
                  >
                    {component.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--color-fg-secondary)",
                      margin: 0,
                    }}
                  >
                    {component.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
