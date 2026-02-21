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
  Tabs,
  Tab,
  Search,
  Divider,
  Grid,
  FAB,
  Text,
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
    name: "トヨタ自動車",
    code: "7203",
    quantity: 100,
    avgCost: "¥2,800",
    currentPrice: "¥2,845.5",
    profitLoss: "+¥4,550",
    profitPositive: true,
    signal: "買い",
  },
  {
    name: "ソニーグループ",
    code: "6758",
    quantity: 50,
    avgCost: "¥13,200",
    currentPrice: "¥13,850",
    profitLoss: "+¥32,500",
    profitPositive: true,
    signal: "買い",
  },
  {
    name: "ソフトバンクG",
    code: "9984",
    quantity: 200,
    avgCost: "¥6,850",
    currentPrice: "¥6,420",
    profitLoss: "-¥86,000",
    profitPositive: false,
    signal: "売り",
  },
  {
    name: "キーエンス",
    code: "6861",
    quantity: 10,
    avgCost: "¥62,500",
    currentPrice: "¥65,800",
    profitLoss: "+¥33,000",
    profitPositive: true,
    signal: "保持",
  },
  {
    name: "NTT",
    code: "9432",
    quantity: 300,
    avgCost: "¥172",
    currentPrice: "¥178.5",
    profitLoss: "+¥1,950",
    profitPositive: true,
    signal: "買い",
  },
  {
    name: "三菱UFJ FG",
    code: "8306",
    quantity: 400,
    avgCost: "¥1,280",
    currentPrice: "¥1,325",
    profitLoss: "+¥18,000",
    profitPositive: true,
    signal: "保持",
  },
];

const sectors = [
  { name: "自動車", percent: 35, color: "Emerald" as const },
  { name: "電機", percent: 25, color: "Blue" as const },
  { name: "通信", percent: 18, color: "Purple" as const },
  { name: "精密機器", percent: 12, color: "Amber" as const },
  { name: "金融", percent: 10, color: "Red" as const },
];

const performancePeriods: PerformancePeriod[] = ["1W", "1M", "3M", "1Y", "ALL"];

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
          <Avatar size="sm" fallback="YH" />
          <div className={layoutStyles.sidebarFooterInfo}>
            <Text as="span" size="sm" weight="medium" style={truncateStyle}>春山 裕太</Text>
            <Text as="span" size="xs" color="subtle" style={truncateStyle}>y.haruyama@example.com</Text>
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
          <Avatar size="sm" fallback="YH" />
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
      <Grid columns={3} columnsSm={1} gap="var(--spacing-4, 1rem)" style={{ marginBottom: "var(--spacing-6, 1.5rem)" }}>
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
              <Tabs variant="pills">
                {performancePeriods.map((period) => (
                  <Tab
                    key={period}
                    active={activePeriod === period}
                    onClick={() => setActivePeriod(period)}
                  >
                    {period}
                  </Tab>
                ))}
              </Tabs>
            </div>
          </CardHeader>
          <CardBody>
            <div className={styles.chartArea}>
              <div className={styles.chartLine} />
              <div className={styles.chartLinePath}>
                <svg
                  viewBox="0 0 600 240"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <polyline
                    points="0,180 60,160 120,140 180,130 240,150 300,100 360,80 420,90 480,60 540,45 600,30"
                    stroke="var(--color-success, #10b981)"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Sector Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>セクター配分</CardTitle>
          </CardHeader>
          <CardBody>
            <div className={styles.sectorList}>
              {sectors.map((sector) => (
                <div key={sector.name} className={styles.sectorItem}>
                  <span className={styles.sectorLabel}>
                    <span
                      className={cn(
                        styles.sectorDot,
                        styles[`sectorDot${sector.color}`],
                      )}
                    />
                    {sector.name}
                  </span>
                  <Text as="span" weight="medium" color="muted" style={{ fontVariantNumeric: "tabular-nums" }}>
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
                      <span className={styles.tabularNums}>
                        {stock.code}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className={styles.tabularNums}>
                    {stock.quantity.toLocaleString()}
                  </TableCell>
                  <TableCell className={styles.tabularNums}>
                    {stock.avgCost}
                  </TableCell>
                  <TableCell className={styles.tabularNums}>
                    {stock.currentPrice}
                  </TableCell>
                  <TableCell
                    className={cn(
                      styles.tabularNums,
                      stock.profitPositive
                        ? styles.profitPositive
                        : styles.profitNegative,
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
