import { useState } from "react";
import {
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
  Select,
  BarChart,
  DonutChart,
  Sparkline,
  Progress,
  List,
  ListItem,
  Grid,
  FAB,
  Text,
} from "@/components";
import type { BarChartItem, DonutChartSegment } from "@/components";
import { AppLayout } from "@/components/Layout";
import { Sidebar, NavItem } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { Logo } from "@/components/Logo";
import { useTheme } from "@/hooks";
import styles from "./AnalyticsDashboard.module.css";
import layoutStyles from "../dashboardLayout.module.css";
import {
  LayoutDashboard,
  Activity,
  TrendingUp,
  FileText,
  Target,
  Moon,
  Sun,
} from "lucide-react";

const truncateStyle = {
  whiteSpace: "nowrap" as const,
  overflow: "hidden" as const,
  textOverflow: "ellipsis" as const,
};

/* ── Types ─────────────────────────────────────────────────── */

interface TrafficSource {
  rank: number;
  source: string;
  sessions: string;
  convRate: string;
  revenue: string;
  trend: number[];
}

interface PopularPage {
  rank: number;
  path: string;
  title: string;
  views: string;
  share: number;
}

type ChartPeriod = "日別" | "週別" | "月別";

/* ── Data ──────────────────────────────────────────────────── */

const channelData: BarChartItem[] = [
  { label: "オーガニック検索", value: 124500 },
  { label: "ダイレクト", value: 68200 },
  { label: "ソーシャル", value: 45800 },
  { label: "リファラル", value: 28900 },
  { label: "メール", value: 16992 },
];

const deviceData: DonutChartSegment[] = [
  { label: "モバイル", value: 58 },
  { label: "デスクトップ", value: 34 },
  { label: "タブレット", value: 8 },
];

const trafficSources: TrafficSource[] = [
  { rank: 1, source: "google / organic", sessions: "98,420", convRate: "3.8%", revenue: "¥4,280,000", trend: [20, 25, 22, 28, 35, 32, 38] },
  { rank: 2, source: "direct / (none)", sessions: "68,200", convRate: "2.9%", revenue: "¥2,150,000", trend: [30, 28, 32, 29, 31, 30, 33] },
  { rank: 3, source: "twitter.com / referral", sessions: "22,450", convRate: "1.2%", revenue: "¥580,000", trend: [10, 15, 22, 18, 25, 30, 28] },
  { rank: 4, source: "facebook.com / social", sessions: "18,300", convRate: "2.1%", revenue: "¥890,000", trend: [15, 12, 18, 20, 16, 19, 22] },
  { rank: 5, source: "newsletter / email", sessions: "16,992", convRate: "5.2%", revenue: "¥1,920,000", trend: [8, 10, 12, 15, 14, 18, 20] },
];

const popularPages: PopularPage[] = [
  { rank: 1, path: "/", title: "トップページ", views: "142,800", share: 100 },
  { rank: 2, path: "/products/summer-sale", title: "サマーセール特集", views: "89,200", share: 62 },
  { rank: 3, path: "/blog/seo-guide-2025", title: "SEO完全ガイド 2025年版", views: "45,600", share: 32 },
  { rank: 4, path: "/pricing", title: "料金プラン", views: "38,400", share: 27 },
  { rank: 5, path: "/contact", title: "お問い合わせ", views: "22,100", share: 15 },
];

const chartPeriods: ChartPeriod[] = ["日別", "週別", "月別"];

/* ── Analytics Dashboard Component ─────────────────────────── */

export function AnalyticsDashboard() {
  const [activePeriod, setActivePeriod] = useState<ChartPeriod>("日別");
  const { resolvedTheme, toggleTheme } = useTheme();

  /* ── Sidebar ───────────────────────────────────────────── */

  const sidebar = (
    <Sidebar
      logo={<Logo />}
      footer={
        <div className={layoutStyles.sidebarFooter}>
          <Avatar size="sm" fallback="TM" />
          <div className={layoutStyles.sidebarFooterInfo}>
            <Text as="span" size="sm" weight="medium" style={truncateStyle}>田中 美咲</Text>
            <Text as="span" size="xs" color="subtle" style={truncateStyle}>m.tanaka@example.com</Text>
          </div>
        </div>
      }
    >
      <NavItem icon={<LayoutDashboard size={18} />} active>
        ダッシュボード
      </NavItem>
      <NavItem icon={<Activity size={18} />}>リアルタイム</NavItem>
      <NavItem icon={<TrendingUp size={18} />}>集客</NavItem>
      <NavItem icon={<FileText size={18} />}>コンテンツ</NavItem>
      <NavItem icon={<Target size={18} />}>コンバージョン</NavItem>
    </Sidebar>
  );

  /* ── TopBar ────────────────────────────────────────────── */

  const topbar = (
    <TopBar
      actions={
        <div className={layoutStyles.topBarActions}>
          <Select defaultValue="30d">
            <option value="7d">過去7日間</option>
            <option value="30d">過去30日間</option>
            <option value="90d">過去90日間</option>
            <option value="1y">過去1年間</option>
          </Select>
          <Avatar size="sm" fallback="TM" />
        </div>
      }
    >
      <Search placeholder="ページURLや指標を検索..." shortcut="⌘K" />
    </TopBar>
  );

  /* ── Render ────────────────────────────────────────────── */

  return (
    <AppLayout sidebar={sidebar} topbar={topbar}>
      {/* Hero Metric */}
      <section className={styles.heroSection}>
        <Metric
          label="合計セッション数"
          value="284,392"
          large
          change={{ value: "+12.4%（前期比）", trend: "positive" }}
        />
      </section>

      {/* 4-column KPI Cards */}
      <Grid columns={4} columnsMd={2} columnsSm={1} gap="var(--space-4)" style={{ marginBottom: "var(--space-6)" }}>
        <Card variant="compact">
          <CardBody>
            <Metric
              label="ページビュー"
              value="892,451"
              change={{ value: "+8.2%", trend: "positive" }}
            />
          </CardBody>
        </Card>
        <Card variant="compact">
          <CardBody>
            <Metric
              label="直帰率"
              value="34.2%"
              change={{ value: "-2.1%", trend: "positive" }}
            />
          </CardBody>
        </Card>
        <Card variant="compact">
          <CardBody>
            <Metric
              label="平均セッション時間"
              value="4分32秒"
              change={{ value: "+0:18", trend: "positive" }}
            />
          </CardBody>
        </Card>
        <Card variant="compact">
          <CardBody>
            <Metric
              label="コンバージョン率"
              value="3.24%"
              change={{ value: "+0.5%", trend: "positive" }}
            />
          </CardBody>
        </Card>
      </Grid>

      {/* Charts Row */}
      <div className={styles.chartsGrid}>
        {/* Channel Sessions BarChart */}
        <Card>
          <CardHeader>
            <div className={layoutStyles.chartHeader}>
              <CardTitle>チャネル別セッション</CardTitle>
              <Tabs variant="pills">
                {chartPeriods.map((period) => (
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
            <BarChart
              aria-label="チャネル別トラフィック"
              data={channelData}
              formatValue={(v) => `${(v / 1000).toFixed(1)}K`}
            />
          </CardBody>
        </Card>

        {/* Device DonutChart */}
        <Card>
          <CardHeader>
            <CardTitle>デバイス構成</CardTitle>
          </CardHeader>
          <CardBody>
            <DonutChart
              aria-label="デバイス構成比率"
              data={deviceData}
              centerLabel="58%"
              showLegend
            />
          </CardBody>
        </Card>
      </div>

      <Divider subtle />

      {/* Traffic Sources Table */}
      <Card>
        <CardHeader>
          <div className={styles.tableHeader}>
            <CardTitle>流入元ランキング</CardTitle>
            <Badge>上位5</Badge>
          </div>
        </CardHeader>
        <CardBody>
          <div className={layoutStyles.tableWrapper}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>順位</TableHead>
                  <TableHead>流入元</TableHead>
                  <TableHead>セッション</TableHead>
                  <TableHead>CV率</TableHead>
                  <TableHead>収益</TableHead>
                  <TableHead>トレンド</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trafficSources.map((source) => (
                  <TableRow key={source.rank}>
                    <TableCell>
                      <span className={styles.rankBadge}>{source.rank}</span>
                    </TableCell>
                    <TableCell>{source.source}</TableCell>
                    <TableCell className={styles.tabularNums}>
                      {source.sessions}
                    </TableCell>
                    <TableCell className={styles.tabularNums}>
                      {source.convRate}
                    </TableCell>
                    <TableCell className={styles.tabularNums}>
                      {source.revenue}
                    </TableCell>
                    <TableCell>
                      <Sparkline data={source.trend} width={80} height={24} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardBody>
      </Card>

      {/* Popular Pages */}
      <Card style={{ marginTop: "var(--space-4)" }}>
        <CardHeader>
          <CardTitle>人気ページ</CardTitle>
        </CardHeader>
        <CardBody>
          <List divided>
            {popularPages.map((page) => (
              <ListItem
                key={page.rank}
                leading={
                  <span className={styles.rankBadge}>{page.rank}</span>
                }
                title={page.title}
                description={`${page.path} · ${page.views} PV`}
                trailing={
                  <div className={styles.pageTrailing}>
                    <div className={styles.progressWrap}>
                      <Progress
                        value={page.share}
                        max={100}
                        size="sm"
                        color="info"
                      />
                    </div>
                  </div>
                }
              />
            ))}
          </List>
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
        {resolvedTheme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      </FAB>
    </AppLayout>
  );
}
