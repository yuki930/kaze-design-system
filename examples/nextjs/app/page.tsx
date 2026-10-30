import {
  AppLayout,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Grid,
  Logo,
  Metric,
  NavItem,
  Sidebar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TopBar,
} from "kaze-design-system";
import { Building2, FileText, LayoutDashboard, Settings } from "lucide-react";
import styles from "./page.module.css";

type Status = "paid" | "waiting" | "overdue";

const statusLabel: Record<Status, { label: string; tone: "positive" | "default" | "negative" }> = {
  paid: { label: "入金済み", tone: "positive" },
  waiting: { label: "入金待ち", tone: "default" },
  overdue: { label: "期限切れ", tone: "negative" },
};

const invoices: { id: string; client: string; due: string; amount: number; status: Status }[] = [
  {
    id: "INV-1042",
    client: "株式会社ノーツ",
    due: "2026/11/30",
    amount: 1280000,
    status: "waiting",
  },
  {
    id: "INV-1041",
    client: "八十八株式会社",
    due: "2026/11/15",
    amount: 486000,
    status: "waiting",
  },
  { id: "INV-1040", client: "合同会社潮目", due: "2026/10/31", amount: 92400, status: "overdue" },
  { id: "INV-1039", client: "株式会社みなも", due: "2026/10/31", amount: 330000, status: "paid" },
  {
    id: "INV-1038",
    client: "燕コンピュータ株式会社",
    due: "2026/10/15",
    amount: 1650000,
    status: "paid",
  },
];

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

export default function InvoicesPage() {
  return (
    <AppLayout
      sidebar={
        <Sidebar logo={<Logo />}>
          <NavItem href="#" icon={<LayoutDashboard size={18} />}>
            ダッシュボード
          </NavItem>
          <NavItem href="#" icon={<FileText size={18} />} active>
            請求書
          </NavItem>
          <NavItem href="#" icon={<Building2 size={18} />}>
            取引先
          </NavItem>
          <NavItem href="#" icon={<Settings size={18} />}>
            設定
          </NavItem>
        </Sidebar>
      }
      topbar={<TopBar actions={<Button>請求書を作成する</Button>}>請求書</TopBar>}
    >
      <Grid columns={3} columnsSm={1} gap="md">
        <Metric
          label="今月の請求額"
          value={yen(3838400)}
          change={{ value: "前月比 +12.4%", trend: "positive" }}
        />
        <Metric label="入金待ち" value={yen(1766000)} />
        <Metric label="期限切れ" value={yen(92400)} />
      </Grid>

      <Card className={styles.section}>
        <CardHeader>
          <CardTitle>今月の請求書</CardTitle>
        </CardHeader>
        <CardBody>
          <Table className={styles.invoiceTable}>
            <TableHeader>
              <TableRow>
                <TableHead>請求番号</TableHead>
                <TableHead>取引先</TableHead>
                <TableHead>支払期日</TableHead>
                <TableHead className="table__cell--numeric">金額（円）</TableHead>
                <TableHead>状態</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>{inv.id}</TableCell>
                  <TableCell>{inv.client}</TableCell>
                  <TableCell>{inv.due}</TableCell>
                  <TableCell className="table__cell--numeric">
                    {inv.amount.toLocaleString("ja-JP")}
                  </TableCell>
                  <TableCell>
                    <Badge tone={statusLabel[inv.status].tone}>
                      {statusLabel[inv.status].label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </AppLayout>
  );
}
