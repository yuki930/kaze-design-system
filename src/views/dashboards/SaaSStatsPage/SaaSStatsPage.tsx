import { Card, Text, FAB } from "@/components";
import { DonutChart } from "@/components/DonutChart/DonutChart";
import { useTheme } from "@/hooks";
import { Moon, Sun, Globe, Zap, Shield } from "lucide-react";
import styles from "./SaaSStatsPage.module.css";

/* ── Data ─────────────────────────────────────────────────── */

const regionData = [
  { label: "アジア太平洋", value: 45, color: "#818cf8" },
  { label: "北米", value: 30, color: "#6366f1" },
  { label: "欧州", value: 25, color: "#c4b5fd" },
];

const satisfactionData = [
  { label: "満足", value: 85, color: "#f97316" },
  { label: "普通", value: 12, color: "#fdba74" },
  { label: "不満", value: 3, color: "#fed7aa" },
];

const uptimeBars = [
  { height: 95, color: "#6ee7b7" },
  { height: 98, color: "#6ee7b7" },
  { height: 100, color: "#34d399" },
  { height: 99, color: "#34d399" },
  { height: 100, color: "#10b981" },
  { height: 100, color: "#10b981" },
];

/* ── Component ────────────────────────────────────────────── */

export function SaaSStatsPage() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <div className={styles.page}>
      {/* ── Stats Section ──────────────────────────────────── */}
      <section className={styles.statsSection}>
        <div className={styles.statsInner}>
          <h2 className={styles.statsHeading}>
            世界中の開発チームが
            <br />
            選んでいます
          </h2>
          <p className={styles.statsSubtitle}>
            グローバルに展開するAPIプラットフォームとして、あらゆる規模のチームの開発を加速させています。
          </p>

          {/* ── Cards Grid ────────────────────────────────── */}
          <div className={styles.cardsGrid}>
            {/* Card 1: APIリクエスト */}
            <Card className={styles.statsCard}>
              <div className={styles.cardInner}>
                <div className={styles.cardText}>
                  <div className={styles.cardLabel}>
                    <Globe size={16} />
                    <span>月間APIリクエスト</span>
                  </div>
                  <div className={styles.cardNumber}>1.2億+</div>
                  <Text size="sm" color="muted">
                    3つのリージョンから低レイテンシで
                    <br />
                    APIを提供しています。
                  </Text>
                </div>
                <div className={styles.cardChart}>
                  <DonutChart
                    aria-label="リージョン別分布"
                    data={regionData}
                    size={130}
                    strokeWidth={28}
                    showLegend={false}
                  />
                  <div className={styles.miniLegend}>
                    {regionData.map((d) => (
                      <div key={d.label} className={styles.miniLegendItem}>
                        <span
                          className={styles.miniLegendDot}
                          style={{ background: d.color }}
                        />
                        <span>{d.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Card 2: 開発者満足度 */}
            <Card className={styles.statsCard}>
              <div className={styles.cardInner}>
                <div className={styles.cardText}>
                  <div className={styles.cardLabel}>
                    <Zap size={16} />
                    <span>開発者満足度</span>
                  </div>
                  <div className={styles.cardNumber}>97%</div>
                  <Text size="sm" color="muted">
                    直感的なSDKとドキュメントで
                    <br />
                    高い満足度を維持しています。
                  </Text>
                </div>
                <div className={styles.cardChart}>
                  <DonutChart
                    aria-label="開発者満足度分布"
                    data={satisfactionData}
                    size={130}
                    strokeWidth={28}
                    showLegend={false}
                  />
                  <div className={styles.miniLegend}>
                    {satisfactionData.map((d) => (
                      <div key={d.label} className={styles.miniLegendItem}>
                        <span
                          className={styles.miniLegendDot}
                          style={{ background: d.color }}
                        />
                        <span>{d.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Card 3: 稼働率 (full-width) */}
            <Card className={`${styles.statsCard} ${styles.statsCardWide}`}>
              <div className={styles.cardInner}>
                <div className={styles.cardText}>
                  <div className={styles.cardLabel}>
                    <Shield size={16} />
                    <span>サービス稼働率</span>
                  </div>
                  <div className={styles.cardNumberLg}>99.99%</div>
                  <Text size="sm" color="muted">
                    エンタープライズグレードのインフラで、ミッションクリティカルなワークロードにも対応しています。
                  </Text>
                </div>
                <div className={styles.barChart}>
                  {/* Month labels */}
                  <div className={styles.barLabels}>
                    {["7月", "8月", "9月", "10月", "11月", "12月"].map((m) => (
                      <span key={m} className={styles.barLabel}>{m}</span>
                    ))}
                  </div>
                  {/* Bar chart */}
                  <div className={styles.bars}>
                    {uptimeBars.map((bar, i) => (
                      <div
                        key={i}
                        className={styles.bar}
                        style={{
                          height: `${bar.height}%`,
                          background: bar.color,
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
