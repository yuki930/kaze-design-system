import { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Metric,
  Avatar,
  Search,
  Divider,
  Grid,
  FAB,
  Text,
  LineChart,
  SegmentedControl,
  CategoryBar,
} from "@/components";
import { AppLayout } from "@/components/Layout";
import { Sidebar, NavItem } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { Logo } from "@/components/Logo";
import { useTheme } from "@/hooks";
import { cn } from "@/lib/utils";
import styles from "./Dashboard.module.css";
import layoutStyles from "../dashboardLayout.module.css";

/* Re-usable truncation style for sidebar footer */
const truncateStyle = {
  whiteSpace: "nowrap" as const,
  overflow: "hidden" as const,
  textOverflow: "ellipsis" as const,
};

/* ── Types ─────────────────────────────────────────────────── */

interface Holding {
  name: string;
  code: string;
  quantity: number;
  avgCost: string;
  currentPrice: string;
  profitLoss: string;
  profitPositive: boolean;
  signal: "買い" | "売り" | "保持";
}

type PerformancePeriod = "1W" | "1M" | "3M" | "1Y" | "ALL";

/* ── Data ──────────────────────────────────────────────────── */

const holdings: Holding[] = [
  {
    name: "潮見電機",
    code: "KZ01",
    quantity: 100,
    avgCost: "¥2,800",
    currentPrice: "¥2,845.5",
    profitLoss: "+¥4,550",
    profitPositive: true,
    signal: "買い",
  },
  {
    name: "北斗精工",
    code: "KZ02",
    quantity: 50,
    avgCost: "¥13,200",
    currentPrice: "¥13,850",
    profitLoss: "+¥32,500",
    profitPositive: true,
    signal: "買い",
  },
  {
    name: "雲雀ホールディングス",
    code: "KZ03",
    quantity: 200,
    avgCost: "¥6,850",
    currentPrice: "¥6,420",
    profitLoss: "-¥86,000",
    profitPositive: false,
    signal: "売り",
  },
  {
    name: "燕重工",
    code: "KZ04",
    quantity: 10,
    avgCost: "¥62,500",
    currentPrice: "¥65,800",
    profitLoss: "+¥33,000",
    profitPositive: true,
    signal: "保持",
  },
  {
    name: "霞浦通信",
    code: "KZ05",
    quantity: 300,
    avgCost: "¥172",
    currentPrice: "¥178.5",
    profitLoss: "+¥1,950",
    profitPositive: true,
    signal: "買い",
  },
  {
    name: "みなもフィナンシャル",
    code: "KZ06",
    quantity: 400,
    avgCost: "¥1,280",
    currentPrice: "¥1,325",
    profitLoss: "+¥18,000",
    profitPositive: true,
    signal: "保持",
  },
];

const sectors = [
  { name: "自動車", percent: 35, color: "var(--chart-emerald)" },
  { name: "電機", percent: 25, color: "var(--chart-blue)" },
  { name: "通信", percent: 18, color: "var(--chart-purple)" },
  { name: "精密機器", percent: 12, color: "var(--chart-amber)" },
  { name: "金融", percent: 10, color: "var(--chart-red)" },
];

const performancePeriods: PerformancePeriod[] = ["1W", "1M", "3M", "1Y", "ALL"];

/** Portfolio value (万円) per period. Deterministic walk that ends at the current total. */
function buildPerformance(labels: string[], start: number, end: number, wobble: number) {
  const n = labels.length;
  return labels.map((label, i) => {
    const trend = start + ((end - start) * i) / Math.max(n - 1, 1);
    const noise = i === n - 1 ? 0 : Math.sin(i * 1.7) * wobble + Math.cos(i * 0.9) * wobble * 0.5;
    return { label, value: Math.round(trend + noise) };
  });
}

const performanceData: Record<PerformancePeriod, { label: string; value: number }[]> = {
  "1W": buildPerformance(
    ["10/23", "10/24", "10/25", "10/26", "10/27", "10/28", "10/29"],
    1262,
    1285,
    6,
  ),
  "1M": buildPerformance(
    Array.from({ length: 30 }, (_, i) => `${i < 1 ? 9 : 10}/${i < 1 ? 30 : i}`),
    1240,
    1285,
    9,
  ),
  "3M": buildPerformance(
    Array.from({ length: 13 }, (_, i) => `${i + 1}週`),
    1185,
    1285,
    16,
  ),
  "1Y": buildPerformance(
    ["11月", "12月", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月"],
    1020,
    1285,
    28,
  ),
  ALL: buildPerformance(["2021", "2022", "2023", "2024", "2025", "2026"], 610, 1285, 35),
};

/* ── Helpers ───────────────────────────────────────────────── */

function signalVariant(signal: Holding["signal"]) {
  switch (signal) {
    case "買い":
      return "positive" as const;
    case "売り":
      return "negative" as const;
    case "保持":
      return "warning" as const;
  }
}

/* ── Inline SVG Icons (18x18, stroked) ─────────────────────── */

function DashboardIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function PieChartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

/* ── Dashboard Component ───────────────────────────────────── */

export function Dashboard() {
  const [activePeriod, setActivePeriod] = useState<PerformancePeriod>("1M");
  const { resolvedTheme, toggleTheme } = useTheme();

  /* ── Sidebar ───────────────────────────────────────────── */

  const sidebar = (
    <Sidebar
      logo={<Logo />}
      footer={
        <div className={layoutStyles.sidebarFooter}>
          <Avatar size="sm" fallback="FA" />
          <div className={layoutStyles.sidebarFooterInfo}>
            <Text as="span" size="sm" weight="medium" style={truncateStyle}>
              藤枝 蒼
            </Text>
            <Text as="span" size="xs" color="subtle" style={truncateStyle}>
              ao.fujieda@norn.co.jp
            </Text>
          </div>
        </div>
      }
    >
      <NavItem icon={<DashboardIcon />} active>
        オーバービュー
      </NavItem>
      <NavItem icon={<BarChartIcon />}>分析</NavItem>
      <NavItem icon={<ZapIcon />}>シグナル</NavItem>
      <NavItem icon={<PieChartIcon />}>ポートフォリオ</NavItem>
    </Sidebar>
  );

  /* ── TopBar ────────────────────────────────────────────── */

  const topbar = (
    <TopBar
      actions={
        <div className={layoutStyles.topBarActions}>
          <div className={styles.notificationBtn}>
            <Button variant="ghost" size="sm" iconOnly>
              <BellIcon />
            </Button>
            <span className={styles.notificationDot} />
          </div>
          <Avatar size="sm" fallback="FA" />
        </div>
      }
    >
      <Search placeholder="検索..." shortcut="⌘K" />
    </TopBar>
  );

  /* ── Render ────────────────────────────────────────────── */

  return (
    <AppLayout sidebar={sidebar} topbar={topbar}>
      {/* Hero Metric */}
      <section className={styles.heroSection}>
        <Metric
          label="ポートフォリオ総額"
          value="¥12,847,320"
          large
          change={{ value: "+¥298,450 (+2.38%)", trend: "positive" }}
        />
      </section>

      {/* Summary Metric Cards */}
      <Grid
        columns={3}
        columnsSm={1}
        gap="var(--space-4)"
        style={{ marginBottom: "var(--space-6)" }}
      >
        <Card variant="compact">
          <CardBody>
            <Metric
              label="含み損益"
              value="+¥847,320"
              change={{ value: "+6.18%", trend: "positive" }}
            />
          </CardBody>
        </Card>
        <Card variant="compact">
          <CardBody>
            <Metric label="保有銘柄" value="6" />
          </CardBody>
        </Card>
        <Card variant="compact">
          <CardBody>
            <Metric label="アクティブシグナル" value="3" />
          </CardBody>
        </Card>
      </Grid>

      {/* Performance & Sector Allocation */}
      <div className={styles.chartsGrid}>
        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <div className={layoutStyles.chartHeader}>
              <CardTitle>パフォーマンス</CardTitle>
              <SegmentedControl
                aria-label="表示期間"
                size="sm"
                options={performancePeriods.map((p) => ({ value: p, label: p }))}
                value={activePeriod}
                onValueChange={(v) => setActivePeriod(v as PerformancePeriod)}
              />
            </div>
          </CardHeader>
          <CardBody>
            <LineChart
              aria-label={`ポートフォリオ評価額の推移（${activePeriod}）`}
              index="label"
              data={performanceData[activePeriod]}
              series={[{ key: "value", label: "評価額（万円）", color: "var(--chart-emerald)" }]}
              area
              curve="monotone"
              showLegend={false}
              startAtZero={false}
              yAxisWidth={72}
              height={220}
              formatValue={(v) => `${v.toLocaleString("ja-JP")}万円`}
            />
          </CardBody>
        </Card>

        {/* Sector Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>セクター配分</CardTitle>
          </CardHeader>
          <CardBody>
            <CategoryBar
              aria-label="セクター配分"
              data={sectors.map((s) => ({ label: s.name, value: s.percent, color: s.color }))}
              showLabels={false}
              height={10}
              className={styles.sectorBar}
            />
            <div className={styles.sectorList}>
              {sectors.map((sector) => (
                <div key={sector.name} className={styles.sectorItem}>
                  <span className={styles.sectorLabel}>
                    <span className={styles.sectorDot} style={{ background: sector.color }} />
                    {sector.name}
                  </span>
                  <Text
                    as="span"
                    weight="medium"
                    color="muted"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {sector.percent}%
                  </Text>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <Divider subtle />

      {/* Holdings Table */}
      <Card>
        <CardHeader>
          <div className={styles.holdingsHeader}>
            <CardTitle>保有銘柄</CardTitle>
            <Badge>6銘柄</Badge>
          </div>
        </CardHeader>
        <CardBody>
          <div className={layoutStyles.tableWrapper}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>銘柄名</TableHead>
                  <TableHead>保有数量</TableHead>
                  <TableHead>平均取得単価</TableHead>
                  <TableHead>現在値</TableHead>
                  <TableHead>評価損益</TableHead>
                  <TableHead>シグナル</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdings.map((stock) => (
                  <TableRow key={stock.code}>
                    <TableCell>
                      <div>
                        <span>{stock.name}</span>{" "}
                        <span className={styles.tabularNums}>{stock.code}</span>
                      </div>
                    </TableCell>
                    <TableCell className={styles.tabularNums}>
                      {stock.quantity.toLocaleString()}
                    </TableCell>
                    <TableCell className={styles.tabularNums}>{stock.avgCost}</TableCell>
                    <TableCell className={styles.tabularNums}>{stock.currentPrice}</TableCell>
                    <TableCell
                      className={cn(
                        styles.tabularNums,
                        stock.profitPositive ? styles.profitPositive : styles.profitNegative,
                      )}
                    >
                      {stock.profitLoss}
                    </TableCell>
                    <TableCell>
                      <Badge variant={signalVariant(stock.signal)} dot>
                        {stock.signal}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardBody>
      </Card>

      {/* Floating Theme Toggle */}
      <FAB
        label="テーマ切替"
        variant="secondary"
        size="sm"
        position="bottom-right"
        onClick={toggleTheme}
        aria-label="テーマ切替"
      >
        {resolvedTheme === "light" ? <MoonIcon /> : <SunIcon />}
      </FAB>
    </AppLayout>
  );
}
