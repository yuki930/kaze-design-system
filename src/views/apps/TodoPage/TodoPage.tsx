import { useState, useCallback, useRef, type KeyboardEvent } from "react";
import {
  Button,
  Card,
  CardBody,
  Badge,
  Input,
  Checkbox,
  Tabs,
  Tab,
  Divider,
  Text,
} from "@/components";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Progress } from "@/components/Progress/Progress";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@/components/Dropdown/Dropdown";
import { useTheme } from "@/hooks";
import styles from "./TodoPage.module.css";
import bottomBarStyles from "../bottomBar.module.css";
import {
  CheckSquare,
  Trash2,
  Plus,
  Moon,
  Sun,
  MoreVertical,
  Flag,
  Inbox,
  Star,
  Calendar,
  ListTodo,
  ClipboardList,
} from "lucide-react";

/* ── Types ─────────────────────────────────────────────────── */

type Priority = "high" | "medium" | "low" | "none";
type Filter = "all" | "active" | "completed";
type BottomTab = "inbox" | "today" | "important" | "all";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: Date;
  tag?: string;
}

/* ── Seed data ─────────────────────────────────────────────── */

const initialTodos: Todo[] = [
  {
    id: "1",
    text: "Kaze コンポーネントのドキュメントを整備する",
    completed: true,
    priority: "high",
    createdAt: new Date("2026-02-18"),
    tag: "仕事",
  },
  {
    id: "2",
    text: "デザイントークンのカラーパレットを確認",
    completed: true,
    priority: "medium",
    createdAt: new Date("2026-02-18"),
    tag: "仕事",
  },
  {
    id: "3",
    text: "ダークモードのコントラスト比テスト",
    completed: false,
    priority: "high",
    createdAt: new Date("2026-02-19"),
    tag: "仕事",
  },
  {
    id: "4",
    text: "週次レビューのアジェンダ作成",
    completed: false,
    priority: "medium",
    createdAt: new Date("2026-02-20"),
    tag: "仕事",
  },
  {
    id: "5",
    text: "React 19 の新機能を調査",
    completed: false,
    priority: "low",
    createdAt: new Date("2026-02-20"),
    tag: "学習",
  },
  {
    id: "6",
    text: "チームランチの店を予約する",
    completed: false,
    priority: "medium",
    createdAt: new Date("2026-02-20"),
    tag: "プライベート",
  },
  {
    id: "7",
    text: "CI/CD パイプラインの最適化",
    completed: false,
    priority: "low",
    createdAt: new Date("2026-02-21"),
    tag: "仕事",
  },
  {
    id: "8",
    text: "ユーザビリティテストの計画を立てる",
    completed: false,
    priority: "high",
    createdAt: new Date("2026-02-20"),
    tag: "仕事",
  },
];

/* ── Helpers ───────────────────────────────────────────────── */

const priorityConfig: Record<
  Priority,
  { label: string; variant: "negative" | "warning" | "info" | "default" }
> = {
  high: { label: "高", variant: "negative" },
  medium: { label: "中", variant: "warning" },
  low: { label: "低", variant: "info" },
  none: { label: "なし", variant: "default" },
};

const tabConfig: Record<BottomTab, { label: string; icon: typeof Inbox }> = {
  inbox: { label: "受信トレイ", icon: Inbox },
  today: { label: "今日", icon: Calendar },
  important: { label: "重要", icon: Star },
  all: { label: "すべて", icon: ListTodo },
};

let nextId = 100;

/* ── Component ─────────────────────────────────────────────── */

export function TodoPage() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [filter, setFilter] = useState<Filter>("all");
  const [activeTab, setActiveTab] = useState<BottomTab>("inbox");
  const [newTodoText, setNewTodoText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── Derived ──────────────────────────────────────────────── */

  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.length - completedCount;
  const progress =
    todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active" && todo.completed) return false;
    if (filter === "completed" && !todo.completed) return false;

    if (activeTab === "today") {
      const today = new Date().toDateString();
      if (todo.createdAt.toDateString() !== today) return false;
    }
    if (activeTab === "important" && todo.priority !== "high") return false;

    return true;
  });

  /* ── Actions ──────────────────────────────────────────────── */

  const addTodo = useCallback(() => {
    const text = newTodoText.trim();
    if (!text) return;
    setTodos((prev) => [
      {
        id: String(nextId++),
        text,
        completed: false,
        priority: "none",
        createdAt: new Date(),
      },
      ...prev,
    ]);
    setNewTodoText("");
    inputRef.current?.focus();
  }, [newTodoText]);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const setPriority = useCallback((id: string, priority: Priority) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority } : t)),
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") addTodo();
    },
    [addTodo],
  );

  /* ── Render ──────────────────────────────────────────────── */

  return (
    <div className={styles.app}>
      {/* ── Header ──────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <CheckSquare size={22} />
          <Text as="span" size="xl" weight="bold">{tabConfig[activeTab].label}</Text>
        </div>
        <div className={styles.headerRight}>
          <Badge variant="info">{activeCount} 件</Badge>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            onClick={toggleTheme}
            aria-label="テーマ切替"
          >
            {resolvedTheme === "light" ? (
              <Moon size={18} />
            ) : (
              <Sun size={18} />
            )}
          </Button>
        </div>
      </header>

      {/* ── Progress bar ────────────────────────────────────── */}
      <div className={styles.progressBar}>
        <Progress value={progress} size="sm" />
        <Text as="span" size="xs" color="subtle">
          {completedCount}/{todos.length} 完了
        </Text>
      </div>

      {/* ── Main scrollable area ────────────────────────────── */}
      <main className={styles.main}>
        {/* ── Add todo ────────────────────────────────────── */}
        <div className={styles.addSection}>
          <Input
            ref={inputRef}
            placeholder="新しいタスクを追加..."
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            size="sm"
            iconOnly
            onClick={addTodo}
            disabled={!newTodoText.trim()}
            aria-label="追加"
          >
            <Plus size={18} />
          </Button>
        </div>

        {/* ── Filter tabs ──────────────────────────────────── */}
        <div className={styles.filterRow}>
          <Tabs>
            <Tab
              active={filter === "all"}
              onClick={() => setFilter("all")}
            >
              すべて
            </Tab>
            <Tab
              active={filter === "active"}
              onClick={() => setFilter("active")}
            >
              未完了
            </Tab>
            <Tab
              active={filter === "completed"}
              onClick={() => setFilter("completed")}
            >
              完了済み
            </Tab>
          </Tabs>
        </div>

        {/* ── Todo list ──────────────────────────────────── */}
        {filteredTodos.length === 0 ? (
          <EmptyState
            icon={<ClipboardList size={40} />}
            title={
              filter === "completed"
                ? "完了したタスクはありません"
                : "タスクはありません"
            }
            description={
              filter === "completed"
                ? "タスクを完了するとここに表示されます。"
                : "上のフォームから追加しましょう。"
            }
          />
        ) : (
          <Card className={styles.listCard}>
            <CardBody style={{ padding: 0 }}>
              <ul className={styles.todoList}>
                {filteredTodos.map((todo, i) => (
                  <li key={todo.id} className={styles.todoItem}>
                    <div className={styles.todoLeft}>
                      <Checkbox
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        id={`todo-${todo.id}`}
                        label=""
                      />
                      <div className={styles.todoContent}>
                        <Text
                          as="span"
                          size="sm"
                          color={todo.completed ? "subtle" : "default"}
                          className={todo.completed ? styles.todoTextDone : undefined}
                        >
                          {todo.text}
                        </Text>
                        <div className={styles.todoMeta}>
                          {todo.tag && (
                            <Badge variant="default">{todo.tag}</Badge>
                          )}
                          {todo.priority !== "none" && (
                            <Badge
                              variant={priorityConfig[todo.priority].variant}
                            >
                              <Flag size={10} />{" "}
                              {priorityConfig[todo.priority].label}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <Dropdown>
                      <DropdownTrigger>
                        <Button variant="ghost" size="xs" iconOnly>
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem
                          onClick={() => setPriority(todo.id, "high")}
                        >
                          🔴 優先度: 高
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => setPriority(todo.id, "medium")}
                        >
                          🟡 優先度: 中
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => setPriority(todo.id, "low")}
                        >
                          🔵 優先度: 低
                        </DropdownItem>
                        <DropdownItem onClick={() => deleteTodo(todo.id)}>
                          🗑️ 削除
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>

                    {i < filteredTodos.length - 1 && <Divider subtle />}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        )}

        {/* ── Clear completed ─────────────────────────────── */}
        {completedCount > 0 && filter !== "active" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCompleted}
            className={styles.clearBtn}
          >
            <Trash2 size={14} /> 完了済みを削除
          </Button>
        )}
      </main>

      {/* ── Bottom tab bar ──────────────────────────────────── */}
      <nav className={bottomBarStyles.bottomBar}>
        {(Object.keys(tabConfig) as BottomTab[]).map((key) => {
          const cfg = tabConfig[key];
          const IconComp = cfg.icon;
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              className={`${bottomBarStyles.bottomTab} ${isActive ? bottomBarStyles.bottomTabActive : ""}`}
              onClick={() => setActiveTab(key)}
            >
              <IconComp size={20} />
              <span className={bottomBarStyles.bottomTabLabel}>{cfg.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
