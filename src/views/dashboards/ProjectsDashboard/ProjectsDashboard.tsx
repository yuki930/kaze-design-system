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
  Progress,
  List,
  ListItem,
  Stepper,
  Timeline,
  TimelineItem,
  Grid,
  FAB,
  Text,
} from "@/components";
import type { StepperStep } from "@/components";
import { AppLayout } from "@/components/Layout";
import { Sidebar, NavItem } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { Logo } from "@/components/Logo";
import { useTheme } from "@/hooks";
import styles from "./ProjectsDashboard.module.css";
import layoutStyles from "../dashboardLayout.module.css";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Calendar,
  FileBarChart,
  Plus,
  Moon,
  Sun,
} from "lucide-react";

const truncateStyle = {
  whiteSpace: "nowrap" as const,
  overflow: "hidden" as const,
  textOverflow: "ellipsis" as const,
};

/* ── Types ─────────────────────────────────────────────────── */

interface Task {
  id: string;
  title: string;
  assignee: string;
  assigneeInitials: string;
  priority: "高" | "中" | "低";
  dueDate: string;
  status: "未着手" | "進行中" | "レビュー待ち";
}

interface TeamMember {
  name: string;
  initials: string;
  role: string;
  activeTasks: number;
  maxTasks: number;
  completedThisWeek: number;
}

interface Deadline {
  task: string;
  project: string;
  assignee: string;
  assigneeInitials: string;
  dueDate: string;
  daysLeft: number;
  priority: "高" | "中" | "低";
}

type TaskTab = "すべて" | "マイタスク" | "チーム";

/* ── Data ──────────────────────────────────────────────────── */

const milestones: StepperStep[] = [
  { label: "企画" },
  { label: "デザイン" },
  { label: "開発" },
  { label: "テスト" },
  { label: "リリース" },
];

const tasks: Task[] = [
  { id: "KZ-142", title: "Buttonコンポーネントのa11y改善", assignee: "佐藤 健太", assigneeInitials: "KS", priority: "高", dueDate: "2月25日", status: "進行中" },
  { id: "KZ-139", title: "ダークモードのカラートークン調整", assignee: "鈴木 あい", assigneeInitials: "AS", priority: "高", dueDate: "2月22日", status: "レビュー待ち" },
  { id: "KZ-145", title: "Tableコンポーネントのソート機能", assignee: "山田 太郎", assigneeInitials: "TY", priority: "中", dueDate: "3月1日", status: "未着手" },
  { id: "KZ-138", title: "Storybook v8へのマイグレーション", assignee: "佐藤 健太", assigneeInitials: "KS", priority: "中", dueDate: "3月5日", status: "進行中" },
  { id: "KZ-150", title: "CI/CDパイプラインの最適化", assignee: "田村 裕子", assigneeInitials: "YT", priority: "低", dueDate: "3月10日", status: "未着手" },
];

const teamMembers: TeamMember[] = [
  { name: "佐藤 健太", initials: "KS", role: "リードエンジニア", activeTasks: 5, maxTasks: 6, completedThisWeek: 8 },
  { name: "鈴木 あい", initials: "AS", role: "デザイナー", activeTasks: 3, maxTasks: 5, completedThisWeek: 5 },
  { name: "山田 太郎", initials: "TY", role: "フロントエンド", activeTasks: 4, maxTasks: 6, completedThisWeek: 3 },
  { name: "田村 裕子", initials: "YT", role: "バックエンド", activeTasks: 2, maxTasks: 5, completedThisWeek: 6 },
];

const activities = [
  { time: "14:32", title: "佐藤 健太がKZ-142を進行中に変更", status: "info" as const },
  { time: "13:15", title: "鈴木 あいがKZ-139のレビューを依頼", status: "warning" as const },
  { time: "11:48", title: "山田 太郎がKZ-136を完了", status: "positive" as const },
  { time: "10:20", title: "田村 裕子がKZ-150を作成", status: "default" as const },
  { time: "09:05", title: "佐藤 健太がKZ-138にコメントを追加", status: "info" as const },
];

const deadlines: Deadline[] = [
  { task: "KZ-139: ダークモードカラー調整", project: "Design System v2", assignee: "鈴木 あい", assigneeInitials: "AS", dueDate: "2月22日", daysLeft: 2, priority: "高" },
  { task: "KZ-142: Button a11y改善", project: "Design System v2", assignee: "佐藤 健太", assigneeInitials: "KS", dueDate: "2月25日", daysLeft: 5, priority: "高" },
  { task: "KZ-145: Tableソート機能", project: "Design System v2", assignee: "山田 太郎", assigneeInitials: "TY", dueDate: "3月1日", daysLeft: 9, priority: "中" },
  { task: "KZ-138: Storybook移行", project: "Design System v2", assignee: "佐藤 健太", assigneeInitials: "KS", dueDate: "3月5日", daysLeft: 13, priority: "中" },
];

const taskTabs: TaskTab[] = ["すべて", "マイタスク", "チーム"];

/* ── Helpers ───────────────────────────────────────────────── */

function priorityVariant(priority: Task["priority"]) {
  switch (priority) {
    case "高": return "negative" as const;
    case "中": return "warning" as const;
    case "低": return "default" as const;
  }
}

function statusVariant(status: Task["status"]) {
  switch (status) {
    case "未着手": return "default" as const;
    case "進行中": return "info" as const;
    case "レビュー待ち": return "warning" as const;
  }
}

function workloadColor(active: number, max: number): "positive" | "warning" | "negative" {
  const ratio = active / max;
  if (ratio > 0.9) return "negative";
  if (ratio > 0.7) return "warning";
  return "positive";
}

function daysLeftVariant(days: number) {
  if (days <= 3) return "negative" as const;
  if (days <= 7) return "warning" as const;
  return "default" as const;
}

/* ── Projects Dashboard Component ──────────────────────────── */

export function ProjectsDashboard() {
  const [activeTab, setActiveTab] = useState<TaskTab>("すべて");
  const { resolvedTheme, toggleTheme } = useTheme();

  /* ── Sidebar ───────────────────────────────────────────── */

  const sidebar = (
    <Sidebar
      logo={<Logo />}
      footer={
        <div className={layoutStyles.sidebarFooter}>
          <Avatar size="sm" fallback="KS" />
          <div className={layoutStyles.sidebarFooterInfo}>
            <Text as="span" size="sm" weight="medium" style={truncateStyle}>佐藤 健太</Text>
            <Text as="span" size="xs" color="subtle" style={truncateStyle}>k.sato@example.com</Text>
          </div>
        </div>
      }
    >
      <NavItem icon={<LayoutDashboard size={18} />} active>
        ダッシュボード
      </NavItem>
      <NavItem icon={<FolderKanban size={18} />}>プロジェクト</NavItem>
      <NavItem icon={<CheckSquare size={18} />}>タスク</NavItem>
      <NavItem icon={<Users size={18} />}>チーム</NavItem>
      <NavItem icon={<Calendar size={18} />}>カレンダー</NavItem>
      <NavItem icon={<FileBarChart size={18} />}>レポート</NavItem>
    </Sidebar>
  );

  /* ── TopBar ────────────────────────────────────────────── */

  const topbar = (
    <TopBar
      actions={
        <div className={layoutStyles.topBarActions}>
          <Button variant="primary" size="sm">
            <Plus size={14} />
            新規タスク
          </Button>
          <Avatar size="sm" fallback="KS" />
        </div>
      }
    >
      <Search placeholder="タスクやプロジェクトを検索..." shortcut="⌘K" />
    </TopBar>
  );

  /* ── Render ────────────────────────────────────────────── */

  return (
    <AppLayout sidebar={sidebar} topbar={topbar}>
      {/* Project Header with Stepper */}
      <Card className={styles.projectHeader}>
        <CardHeader>
          <div className={styles.projectHeaderTitle}>
            <CardTitle>Kaze Design System v2.0</CardTitle>
            <Badge variant="info" dot>進行中</Badge>
          </div>
        </CardHeader>
        <CardBody>
          <div className={styles.stepperWrapper}>
            <Stepper steps={milestones} currentStep={2} />
          </div>
          <Progress value={62} max={100} label="全体進捗" showValue color="info" />
        </CardBody>
      </Card>

      {/* 4-column Task Metrics */}
      <Grid columns={4} columnsMd={2} columnsSm={1} gap="var(--space-4)" style={{ marginBottom: "var(--space-6)" }}>
        <Card variant="compact">
          <CardBody>
            <Metric label="未着手" value="12" />
          </CardBody>
        </Card>
        <Card variant="compact">
          <CardBody>
            <Metric label="進行中" value="8" />
          </CardBody>
        </Card>
        <Card variant="compact">
          <CardBody>
            <Metric label="レビュー待ち" value="5" />
          </CardBody>
        </Card>
        <Card variant="compact">
          <CardBody>
            <Metric
              label="完了（今週）"
              value="23"
              change={{ value: "+15%", trend: "positive" }}
            />
          </CardBody>
        </Card>
      </Grid>

      {/* Two-column: Tasks + Team Workload */}
      <Grid columns={2} columnsMd={1} gap="var(--space-4)" style={{ marginBottom: "var(--space-6)" }}>
        {/* Task List */}
        <Card>
          <CardHeader>
            <div className={layoutStyles.chartHeader}>
              <CardTitle>タスク状況</CardTitle>
              <Tabs variant="pills">
                {taskTabs.map((tab) => (
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
            <List divided>
              {tasks.map((task) => (
                <ListItem
                  key={task.id}
                  leading={<Avatar size="sm" fallback={task.assigneeInitials} />}
                  title={
                    <>
                      {task.title}{" "}
                      <Badge variant={priorityVariant(task.priority)}>
                        {task.priority}
                      </Badge>
                    </>
                  }
                  description={`${task.id} · ${task.assignee} · 期限: ${task.dueDate}`}
                  trailing={
                    <Badge variant={statusVariant(task.status)} dot>
                      {task.status}
                    </Badge>
                  }
                />
              ))}
            </List>
          </CardBody>
        </Card>

        {/* Team Workload */}
        <Card>
          <CardHeader>
            <CardTitle>チームメンバー負荷</CardTitle>
          </CardHeader>
          <CardBody>
            {teamMembers.map((member) => (
              <div key={member.initials} className={styles.memberRow}>
                <Avatar size="sm" fallback={member.initials} />
                <div className={styles.memberInfo}>
                  <Text as="span" size="sm" weight="medium">{member.name}</Text>
                  <Text as="span" size="xs" color="subtle">{member.role}</Text>
                </div>
                <div className={styles.memberProgress}>
                  <Progress
                    value={member.activeTasks}
                    max={member.maxTasks}
                    size="sm"
                    color={workloadColor(member.activeTasks, member.maxTasks)}
                  />
                </div>
                <Text as="span" size="xs" color="muted" style={{ whiteSpace: "nowrap" }}>
                  今週完了: {member.completedThisWeek}件
                </Text>
              </div>
            ))}
          </CardBody>
        </Card>
      </Grid>

      <Divider subtle />

      {/* Activity Timeline */}
      <Card style={{ marginBottom: "var(--space-4)" }}>
        <CardHeader>
          <CardTitle>最近のアクティビティ</CardTitle>
        </CardHeader>
        <CardBody>
          <Timeline>
            {activities.map((activity, i) => (
              <TimelineItem
                key={i}
                time={activity.time}
                title={activity.title}
                status={activity.status}
              />
            ))}
          </Timeline>
        </CardBody>
      </Card>

      {/* Deadlines Table */}
      <Card>
        <CardHeader>
          <div className={styles.tableHeader}>
            <CardTitle>今後の期限</CardTitle>
            <Badge>4件</Badge>
          </div>
        </CardHeader>
        <CardBody>
          <div className={layoutStyles.tableWrapper}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>タスク</TableHead>
                  <TableHead>プロジェクト</TableHead>
                  <TableHead>担当者</TableHead>
                  <TableHead>期限</TableHead>
                  <TableHead>残日数</TableHead>
                  <TableHead>優先度</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deadlines.map((deadline) => (
                  <TableRow key={deadline.task}>
                    <TableCell>{deadline.task}</TableCell>
                    <TableCell>{deadline.project}</TableCell>
                    <TableCell>
                      <div className={styles.assigneeCell}>
                        <Avatar size="sm" fallback={deadline.assigneeInitials} />
                        {deadline.assignee}
                      </div>
                    </TableCell>
                    <TableCell>{deadline.dueDate}</TableCell>
                    <TableCell>
                      <Badge variant={daysLeftVariant(deadline.daysLeft)}>
                        {deadline.daysLeft}日
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={priorityVariant(deadline.priority)}>
                        {deadline.priority}
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
        {resolvedTheme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      </FAB>
    </AppLayout>
  );
}
