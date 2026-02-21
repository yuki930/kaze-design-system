import { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
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
  Alert,
  Pagination,
  DescriptionList,
  DescriptionItem,
  Text,
  Grid,
  FAB,
} from "@/components";
import type { BarChartItem, DonutChartSegment } from "@/components";
import { AppLayout } from "@/components/Layout";
import { Sidebar, NavItem } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { Logo } from "@/components/Logo";
import { useTheme } from "@/hooks";
import styles from "./ECDashboard.module.css";
import layoutStyles from "../dashboardLayout.module.css";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Settings,
  Moon,
  Sun,
} from "lucide-react";

/* ── Types ─────────────────────────────────────────────────── */

interface Order {
  orderId: string;
  customer: string;
  customerInitials: string;
  items: string;
  total: string;
  status: "配送済み" | "発送準備中" | "処理中" | "キャンセル";
  date: string;
  payment: "クレジットカード" | "銀行振込" | "代引き" | "PayPay";
}

interface TopProduct {
  rank: number;
  name: string;
  category: string;
  sold: number;
  revenue: string;
  stockPercent: number;
}

interface KpiData {
  label: string;
  value: string;
  change: { value: string; trend: "positive" | "negative" };
  sparkData: number[];
}

type ChartTab = "売上" | "注文数" | "利益率";

/* ── Data ──────────────────────────────────────────────────── */

const kpis: KpiData[] = [
  { label: "本日の売上", value: "¥1,284,500", change: { value: "+18.2%", trend: "positive" }, sparkData: [45, 52, 38, 65, 72, 58, 85] },
  { label: "注文件数", value: "142件", change: { value: "+12件", trend: "positive" }, sparkData: [20, 25, 18, 30, 28, 35, 42] },
  { label: "平均注文額", value: "¥9,045", change: { value: "-¥320", trend: "negative" }, sparkData: [95, 88, 92, 85, 90, 87, 90] },
  { label: "カート放棄率", value: "24.8%", change: { value: "-3.2%", trend: "positive" }, sparkData: [32, 30, 28, 27, 26, 25, 25] },
];

const categoryRevenue: BarChartItem[] = [
  { label: "アパレル", value: 4850000 },
  { label: "家電", value: 3200000 },
  { label: "食品", value: 2100000 },
  { label: "コスメ", value: 1850000 },
  { label: "書籍", value: 980000 },
  { label: "スポーツ", value: 720000 },
];

const orderStatusData: DonutChartSegment[] = [
  { label: "配送済み", value: 856 },
  { label: "発送準備中", value: 142 },
  { label: "処理中", value: 68 },
  { label: "返品", value: 23 },
];

const recentOrders: Order[] = [
  { orderId: "ORD-20250220-001", customer: "高橋 大輔", customerInitials: "DT", items: "ワイヤレスイヤホン 他2点", total: "¥18,500", status: "発送準備中", date: "14:25", payment: "クレジットカード" },
  { orderId: "ORD-20250220-002", customer: "小林 さくら", customerInitials: "SK", items: "オーガニックコットンTシャツ", total: "¥4,980", status: "処理中", date: "13:58", payment: "PayPay" },
  { orderId: "ORD-20250220-003", customer: "渡辺 拓也", customerInitials: "TW", items: "プロテインパウダー 3kg", total: "¥8,900", status: "配送済み", date: "12:30", payment: "クレジットカード" },
  { orderId: "ORD-20250220-004", customer: "伊藤 美月", customerInitials: "MI", items: "スマートウォッチ Pro", total: "¥34,800", status: "配送済み", date: "11:45", payment: "銀行振込" },
  { orderId: "ORD-20250220-005", customer: "木村 翔", customerInitials: "SK", items: "ランニングシューズ 26.5cm", total: "¥12,800", status: "キャンセル", date: "10:12", payment: "代引き" },
  { orderId: "ORD-20250219-048", customer: "松本 里奈", customerInitials: "RM", items: "ヨガマット + ブロックセット", total: "¥6,480", status: "配送済み", date: "昨日", payment: "PayPay" },
];

const topProducts: TopProduct[] = [
  { rank: 1, name: "ワイヤレスイヤホン Pro X", category: "家電", sold: 284, revenue: "¥2,840,000", stockPercent: 45 },
  { rank: 2, name: "オーガニックコットンTシャツ", category: "アパレル", sold: 198, revenue: "¥985,020", stockPercent: 12 },
  { rank: 3, name: "プロテインパウダー 3kg", category: "食品", sold: 156, revenue: "¥1,388,400", stockPercent: 68 },
  { rank: 4, name: "スマートウォッチ Pro", category: "家電", sold: 89, revenue: "¥3,097,200", stockPercent: 31 },
  { rank: 5, name: "ナチュラルファンデーション", category: "コスメ", sold: 167, revenue: "¥585,900", stockPercent: 8 },
];

const chartTabs: ChartTab[] = ["売上", "注文数", "利益率"];

/* ── Helpers ───────────────────────────────────────────────── */

function orderStatusVariant(status: Order["status"]) {
  switch (status) {
    case "配送済み": return "positive" as const;
    case "発送準備中": return "info" as const;
    case "処理中": return "warning" as const;
    case "キャンセル": return "negative" as const;
  }
}

function stockColor(percent: number): "positive" | "warning" | "negative" {
  if (percent < 15) return "negative";
  if (percent < 30) return "warning";
  return "positive";
}

/* ── EC Dashboard Component ────────────────────────────────── */

export function ECDashboard() {
  const [activeTab, setActiveTab] = useState<ChartTab>("売上");
  const [currentPage, setCurrentPage] = useState(1);
  const { resolvedTheme, toggleTheme } = useTheme();

  /* ── Sidebar ───────────────────────────────────────────── */

  const sidebar = (
    <Sidebar
      logo={<Logo />}
      footer={
        <div className={layoutStyles.sidebarFooter}>
          <Avatar size="sm" fallback="YN" />
          <div className={layoutStyles.sidebarFooterInfo}>
            <Text as="span" size="sm" weight="medium" className={styles.sidebarFooterTruncate}>中村 優花</Text>
            <Text as="span" variant="caption" color="subtle" className={styles.sidebarFooterTruncate}>y.nakamura@example.com</Text>
          </div>
        </div>
      }
    >
      <NavItem icon={<LayoutDashboard size={18} />} active>
        ダッシュボード
      </NavItem>
      <NavItem icon={<ShoppingCart size={18} />}>注文管理</NavItem>
      <NavItem icon={<Package size={18} />}>商品管理</NavItem>
      <NavItem icon={<Users size={18} />}>顧客管理</NavItem>
      <NavItem icon={<TrendingUp size={18} />}>売上レポート</NavItem>
      <NavItem icon={<Settings size={18} />}>設定</NavItem>
    </Sidebar>
  );

  /* ── TopBar ────────────────────────────────────────────── */

  const topbar = (
    <TopBar
      actions={
        <div className={layoutStyles.topBarActions}>
          <Select defaultValue="today">
            <option value="today">本日</option>
            <option value="week">今週</option>
            <option value="month">今月</option>
            <option value="quarter">四半期</option>
          </Select>
          <Avatar size="sm" fallback="YN" />
        </div>
      }
    >
      <Search placeholder="注文番号・商品名で検索..." shortcut="⌘K" />
    </TopBar>
  );

  /* ── Render ────────────────────────────────────────────── */

  return (
    <AppLayout sidebar={sidebar} topbar={topbar}>
      {/* Alert Banner */}
      <div className={styles.alertSection}>
        <Alert variant="warning" title="在庫アラート">
          3件の商品が在庫切れ間近です。早めの発注をおすすめします。
        </Alert>
      </div>

      {/* 4-column KPI Cards with Sparklines */}
      <Grid columns={4} columnsMd={2} columnsSm={1} gap="var(--space-4)" style={{ marginBottom: "var(--space-6)" }}>
        {kpis.map((kpi) => (
          <Card key={kpi.label} variant="compact">
            <CardBody>
              <div className={styles.kpiCardInner}>
                <Metric
                  label={kpi.label}
                  value={kpi.value}
                  change={kpi.change}
                />
                <Sparkline data={kpi.sparkData} width={80} height={32} />
              </div>
            </CardBody>
          </Card>
        ))}
      </Grid>

      {/* Charts Row */}
      <div className={styles.chartsGrid}>
        {/* Category Revenue BarChart */}
        <Card>
          <CardHeader>
            <div className={layoutStyles.chartHeader}>
              <CardTitle>カテゴリ別売上</CardTitle>
              <Tabs variant="pills">
                {chartTabs.map((tab) => (
                  <Tab
                    key={tab}
                    active={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </Tab>
                ))}
              </Tabs>
            </div>
          </CardHeader>
          <CardBody>
            <BarChart
              aria-label="カテゴリ別売上"
              data={categoryRevenue}
              formatValue={(v) => `¥${(v / 10000).toFixed(0)}万`}
            />
          </CardBody>
        </Card>

        {/* Order Status DonutChart */}
        <Card>
          <CardHeader>
            <CardTitle>注文ステータス</CardTitle>
          </CardHeader>
          <CardBody>
            <DonutChart
              aria-label="注文ステータス比率"
              data={orderStatusData}
              centerLabel="1,089"
              showLegend
            />
          </CardBody>
        </Card>
      </div>

      <Divider subtle />

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <div className={styles.ordersHeader}>
            <CardTitle>最近の注文</CardTitle>
            <Badge>本日142件</Badge>
            <div className={styles.ordersHeaderActions}>
              <Button variant="ghost" size="sm">すべて表示</Button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className={layoutStyles.tableWrapper}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>注文番号</TableHead>
                  <TableHead>顧客</TableHead>
                  <TableHead>商品</TableHead>
                  <TableHead>金額</TableHead>
                  <TableHead>決済方法</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>時刻</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell>
                      <span className={styles.orderIdCell}>{order.orderId}</span>
                    </TableCell>
                    <TableCell>
                      <div className={styles.customerCell}>
                        <Avatar size="sm" fallback={order.customerInitials} />
                        {order.customer}
                      </div>
                    </TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell className={styles.tabularNums}>
                      {order.total}
                    </TableCell>
                    <TableCell>{order.payment}</TableCell>
                    <TableCell>
                      <Badge variant={orderStatusVariant(order.status)} dot>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className={styles.tabularNums}>
                      {order.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className={styles.paginationWrapper}>
            <Pagination
              currentPage={currentPage}
              totalPages={12}
              onPageChange={setCurrentPage}
            />
          </div>
        </CardBody>
      </Card>

      {/* Bottom Row: Top Products + Today Summary */}
      <Grid columns={2} columnsMd={1} gap="var(--space-4)" style={{ marginTop: "var(--space-4)" }}>
        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <div className={styles.ordersHeader}>
              <CardTitle>売れ筋商品</CardTitle>
              <Badge>今月</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <List divided>
              {topProducts.map((product) => (
                <ListItem
                  key={product.rank}
                  leading={
                    <span className={styles.rankBadge}>{product.rank}</span>
                  }
                  title={product.name}
                  description={`${product.category} · ${product.sold}個販売 · ${product.revenue}`}
                  trailing={
                    <div className={styles.stockIndicator}>
                      <Progress
                        value={product.stockPercent}
                        max={100}
                        size="sm"
                        color={stockColor(product.stockPercent)}
                      />
                      <Text as="span" variant="caption" color="subtle">在庫</Text>
                    </div>
                  }
                />
              ))}
            </List>
          </CardBody>
        </Card>

        {/* Today's Summary */}
        <Card>
          <CardHeader>
            <CardTitle>本日のサマリー</CardTitle>
          </CardHeader>
          <CardBody>
            <DescriptionList horizontal bordered>
              <DescriptionItem term="新規顧客">18人</DescriptionItem>
              <DescriptionItem term="リピート率">42.3%</DescriptionItem>
              <DescriptionItem term="最高額注文">¥34,800</DescriptionItem>
              <DescriptionItem term="返品依頼">2件</DescriptionItem>
              <DescriptionItem term="問い合わせ">8件</DescriptionItem>
              <DescriptionItem term="レビュー投稿">15件</DescriptionItem>
            </DescriptionList>
          </CardBody>
          <CardFooter>
            <div className={styles.summaryFooter}>
              <Button variant="secondary" size="sm">詳細レポートを表示</Button>
            </div>
          </CardFooter>
        </Card>
      </Grid>

      {/* Floating Theme Toggle */}
      <FAB
        label="テーマ切替"
        variant="secondary"
        size="sm"
        onClick={toggleTheme}
        aria-label="テーマ切替"
      >
        {resolvedTheme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      </FAB>
    </AppLayout>
  );
}
