import { Card, Text, FAB } from "@/components";
import { DonutChart } from "@/components/DonutChart/DonutChart";
import { useTheme } from "@/hooks";
import { Moon, Sun, Boxes, Package, Layers } from "lucide-react";
import styles from "./SaaSStatsPage.module.css";

/* ── Data ─────────────────────────────────────────────────────
   すべて kaze-design-system 自身の実数。
   コンポーネントカテゴリは src/views/docs/ComponentsOverview.tsx の
   分類（全63コンポーネント）と一致させている。
   ------------------------------------------------------------ */

const componentCategoryData = [
  { label: "フォーム", value: 11, color: "var(--chart-1)" },
  { label: "マーケティング", value: 11, color: "var(--chart-2)" },
  { label: "データ表示", value: 9, color: "var(--chart-3)" },
  { label: "レイアウト", value: 8, color: "var(--chart-4)" },
  { label: "ナビゲーション", value: 7, color: "var(--chart-5)" },
  { label: "フィードバック", value: 6, color: "var(--chart-6)" },
  { label: "オーバーレイ", value: 5, color: "var(--chart-7)" },
  { label: "チャート", value: 3, color: "var(--chart-8)" },
  { label: "リスト", value: 3, color: "var(--chart-9)" },
];
const COMPONENT_TOTAL = componentCategoryData.reduce((s, c) => s + c.value, 0); // 63

// npm run build:lib 後、gzip 圧縮した各 CSS ファイルの実測サイズ（kB）
const bundleData = [
  { label: "components.css", value: 13.6, color: "var(--chart-1)" },
  { label: "tokens.css", value: 4.9, color: "var(--chart-2)" },
  { label: "utilities.css", value: 3.4, color: "var(--chart-3)" },
  { label: "reset.css", value: 1.1, color: "var(--chart-4)" },
];
const BUNDLE_TOTAL_KB = bundleData.reduce((s, c) => s + c.value, 0); // 23.0

// トップの「サンプル集」に掲載している作例21件をカテゴリ別に集計
// （ShowcasePage の samplePages と同じ基準。docs とトップページ自身は含めない）
const samplePageCategoryData = [
  { label: "ダッシュボード", value: 5 },
  { label: "コンテンツ", value: 4 },
  { label: "マーケティング", value: 3 },
  { label: "アプリ", value: 3 },
  { label: "ページ", value: 3 },
  { label: "メール", value: 3 },
];
const SAMPLE_PAGE_TOTAL = samplePageCategoryData.reduce((s, c) => s + c.value, 0); // 21
const SAMPLE_PAGE_MAX = Math.max(...samplePageCategoryData.map((c) => c.value));

/* ── Component ────────────────────────────────────────────── */

export function SaaSStatsPage() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <div className={styles.page}>
      {/* ── Stats Section ──────────────────────────────────── */}
      <section className={styles.statsSection}>
        <div className={styles.statsInner}>
          <h2 className={styles.statsHeading}>
            数字で見る
            <br />
            Kaze Design System
          </h2>
          <p className={styles.statsSubtitle}>
            {COMPONENT_TOTAL}個のコンポーネントと{SAMPLE_PAGE_TOTAL}件のサンプルページを、light / dark
            2テーマ・gzip {BUNDLE_TOTAL_KB.toFixed(1)}KB の軽量な CSS で提供しています。
          </p>

          {/* ── Cards Grid ────────────────────────────────── */}
          <div className={styles.cardsGrid}>
            {/* Card 1: コンポーネント数 */}
            <Card className={styles.statsCard}>
              <div className={styles.cardInner}>
                <div className={styles.cardText}>
                  <div className={styles.cardLabel}>
                    <Boxes size={16} />
                    <span>コンポーネント数</span>
                  </div>
                  <div className={styles.cardNumber}>{COMPONENT_TOTAL}</div>
                  <Text size="sm" color="muted">
                    9カテゴリに分類。
                    <br />
                    内訳は /docs/components を参照。
                  </Text>
                </div>
                <div className={styles.cardChart}>
                  <DonutChart
                    aria-label="コンポーネントカテゴリ内訳"
                    data={componentCategoryData}
                    size={130}
                    strokeWidth={22}
                    showLegend={false}
                  />
                  <div className={`${styles.miniLegend} ${styles.miniLegendGrid}`}>
                    {componentCategoryData.map((d) => (
                      <div key={d.label} className={styles.miniLegendItem}>
                        <span
                          className={styles.miniLegendDot}
                          style={{ background: d.color }}
                        />
                        <span>
                          {d.label} {d.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Card 2: CSS バンドルサイズ */}
            <Card className={styles.statsCard}>
              <div className={styles.cardInner}>
                <div className={styles.cardText}>
                  <div className={styles.cardLabel}>
                    <Package size={16} />
                    <span>CSS バンドルサイズ</span>
                  </div>
                  <div className={styles.cardNumber}>{BUNDLE_TOTAL_KB.toFixed(1)}KB</div>
                  <Text size="sm" color="muted">
                    gzip 圧縮後の合計。
                    <br />
                    ランタイム JavaScript は 0KB です。
                  </Text>
                </div>
                <div className={styles.cardChart}>
                  <DonutChart
                    aria-label="CSSバンドル構成"
                    data={bundleData}
                    size={130}
                    strokeWidth={22}
                    showLegend={false}
                  />
                  <div className={styles.miniLegend}>
                    {bundleData.map((d) => (
                      <div key={d.label} className={styles.miniLegendItem}>
                        <span
                          className={styles.miniLegendDot}
                          style={{ background: d.color }}
                        />
                        <span>
                          {d.label} {d.value}KB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Card 3: サンプルページ数 (full-width) */}
            <Card className={`${styles.statsCard} ${styles.statsCardWide}`}>
              <div className={styles.cardInner}>
                <div className={styles.cardText}>
                  <div className={styles.cardLabel}>
                    <Layers size={16} />
                    <span>サンプルページ数</span>
                  </div>
                  <div className={styles.cardNumberLg}>{SAMPLE_PAGE_TOTAL}</div>
                  <Text size="sm" color="muted">
                    ダッシュボードからメールテンプレートまで6カテゴリの作例を収録。すべてトップの「サンプル集」から実際に動く状態で閲覧できます。
                  </Text>
                </div>
                <div className={styles.barChart}>
                  {/* Category labels */}
                  <div className={styles.barLabels}>
                    {samplePageCategoryData.map((c) => (
                      <span key={c.label} className={styles.barLabel}>
                        {c.label}
                      </span>
                    ))}
                  </div>
                  {/* Bar chart */}
                  <div className={styles.bars}>
                    {samplePageCategoryData.map((c) => (
                      <div
                        key={c.label}
                        className={styles.bar}
                        style={{
                          height: `${(c.value / SAMPLE_PAGE_MAX) * 100}%`,
                          background: "var(--color-accent-a)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Theme toggle ──────────────────────────────────── */}
      <FAB
        label="テーマ切替"
        variant="secondary"
        size="sm"
        className={styles.themeToggleFab}
        onClick={toggleTheme}
        aria-label="テーマ切替"
      >
        {resolvedTheme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      </FAB>
    </div>
  );
}
