import { useState, useCallback, useRef, type KeyboardEvent } from "react";
import {
  Button,
  Card,
  Badge,
  Input,
  Checkbox,
  Tabs,
  Tab,
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
import styles from "./ShoppingPage.module.css";
import bottomBarStyles from "../bottomBar.module.css";
import {
  ShoppingCart,
  Plus,
  Moon,
  Sun,
  MoreVertical,
  Trash2,
  ShoppingBag,
  Apple,
  Beef,
  Milk,
} from "lucide-react";

/* ── Types ─────────────────────────────────────────────────── */

type Category = "vegetable" | "meat" | "dairy" | "staple" | "snack" | "other";
type BottomTab = "all" | "vegetable" | "meat" | "dairy";
type Filter = "all" | "remaining" | "purchased";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  purchased: boolean;
  category: Category;
}

/* ── Seed data ─────────────────────────────────────────────── */

const initialItems: ShoppingItem[] = [
  { id: "1", name: "トマト", quantity: "3個", purchased: false, category: "vegetable" },
  { id: "2", name: "にんじん", quantity: "2本", purchased: false, category: "vegetable" },
  { id: "3", name: "ほうれん草", quantity: "1袋", purchased: true, category: "vegetable" },
  { id: "4", name: "鶏もも肉", quantity: "300g", purchased: false, category: "meat" },
  { id: "5", name: "豚バラ薄切り", quantity: "200g", purchased: false, category: "meat" },
  { id: "6", name: "牛乳", quantity: "1本", purchased: true, category: "dairy" },
  { id: "7", name: "ヨーグルト", quantity: "4個パック", purchased: false, category: "dairy" },
  { id: "8", name: "卵", quantity: "1パック", purchased: false, category: "dairy" },
  { id: "9", name: "食パン", quantity: "1斤", purchased: true, category: "staple" },
  { id: "10", name: "お米", quantity: "5kg", purchased: false, category: "staple" },
  { id: "11", name: "パスタ", quantity: "2袋", purchased: false, category: "staple" },
  { id: "12", name: "チョコレート", quantity: "1箱", purchased: false, category: "snack" },
  { id: "13", name: "醤油", quantity: "1本", purchased: false, category: "other" },
  { id: "14", name: "オリーブオイル", quantity: "1本", purchased: true, category: "other" },
];

/* ── Helpers ───────────────────────────────────────────────── */

const categoryConfig: Record<
  Category,
  { label: string; variant: "positive" | "negative" | "warning" | "info" | "default" }
> = {
  vegetable: { label: "野菜", variant: "positive" },
  meat: { label: "肉", variant: "negative" },
  dairy: { label: "乳製品", variant: "info" },
  staple: { label: "主食", variant: "warning" },
  snack: { label: "お菓子", variant: "default" },
  other: { label: "その他", variant: "default" },
};

const tabConfig: Record<BottomTab, { label: string; icon: typeof ShoppingCart }> = {
  all: { label: "すべて", icon: ShoppingBag },
  vegetable: { label: "野菜", icon: Apple },
  meat: { label: "肉・魚", icon: Beef },
  dairy: { label: "乳製品", icon: Milk },
};

let nextId = 100;

/* ── Component ─────────────────────────────────────────────── */

export function ShoppingPage() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [items, setItems] = useState<ShoppingItem[]>(initialItems);
  const [filter, setFilter] = useState<Filter>("all");
  const [activeTab, setActiveTab] = useState<BottomTab>("all");
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── Derived ──────────────────────────────────────────────── */

  const purchasedCount = items.filter((i) => i.purchased).length;
  const remainingCount = items.length - purchasedCount;
  const progress =
    items.length > 0 ? Math.round((purchasedCount / items.length) * 100) : 0;

  const filteredItems = items.filter((item) => {
    if (filter === "remaining" && item.purchased) return false;
    if (filter === "purchased" && !item.purchased) return false;
    if (activeTab !== "all" && item.category !== activeTab) return false;
    return true;
  });

  /* ── budget estimate (dummy) ──────────────────────────────── */

  const estimatedTotal = items.filter((i) => !i.purchased).length * 280;
  const purchasedTotal = items.filter((i) => i.purchased).length * 280;

  /* ── Actions ──────────────────────────────────────────────── */

  const addItem = useCallback(() => {
    const name = newItemName.trim();
    if (!name) return;
    setItems((prev) => [
      {
        id: String(nextId++),
        name,
        quantity: newItemQty.trim() || "1個",
        purchased: false,
        category: "other",
      },
      ...prev,
    ]);
    setNewItemName("");
    setNewItemQty("");
    inputRef.current?.focus();
  }, [newItemName, newItemQty]);

  const toggleItem = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, purchased: !i.purchased } : i)),
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setCategory = useCallback((id: string, category: Category) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, category } : i)),
    );
  }, []);

  const clearPurchased = useCallback(() => {
    setItems((prev) => prev.filter((i) => !i.purchased));
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") addItem();
    },
    [addItem],
  );

  /* ── Render ──────────────────────────────────────────────── */

  return (
    <div className={styles.app}>
      {/* ── Header ──────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <ShoppingCart size={22} />
          <Text as="span" size="xl" weight="bold">お買い物リスト</Text>
        </div>
        <div className={styles.headerRight}>
          <Badge variant="positive">{remainingCount} 品</Badge>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            onClick={toggleTheme}
            aria-label="テーマ切替"
          >
            {resolvedTheme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </Button>
        </div>
      </header>

      {/* ── Budget summary ────────────────────────────────── */}
      <div className={styles.budgetBar}>
        <div className={styles.budgetRow}>
          <Text as="span" size="xs" color="subtle">予算目安</Text>
          <Text as="span" size="lg" weight="bold" className={styles.budgetAmount}>
            ¥{(estimatedTotal + purchasedTotal).toLocaleString()}
          </Text>
        </div>
        <Progress value={progress} size="sm" color="positive" />
        <div className={styles.budgetMeta}>
          <Text as="span" variant="caption" color="subtle">購入済み ¥{purchasedTotal.toLocaleString()}</Text>
          <Text as="span" variant="caption" color="subtle">残り ¥{estimatedTotal.toLocaleString()}</Text>
        </div>
      </div>

      {/* ── Main scrollable area ────────────────────────────── */}
      <main className={styles.main}>
        {/* ── Add item ────────────────────────────────────── */}
        <div className={styles.addSection}>
          <Input
            ref={inputRef}
            placeholder="商品名..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Input
            placeholder="数量"
            value={newItemQty}
            onChange={(e) => setNewItemQty(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.qtyInput}
          />
          <Button
            size="sm"
            iconOnly
            onClick={addItem}
            disabled={!newItemName.trim()}
            aria-label="追加"
          >
            <Plus size={18} />
          </Button>
        </div>

        {/* ── Filter tabs ──────────────────────────────────── */}
        <div className={styles.filterRow}>
          <Tabs>
            <Tab active={filter === "all"} onClick={() => setFilter("all")}>
              すべて
            </Tab>
            <Tab active={filter === "remaining"} onClick={() => setFilter("remaining")}>
              未購入
            </Tab>
            <Tab active={filter === "purchased"} onClick={() => setFilter("purchased")}>
              購入済み
            </Tab>
          </Tabs>
        </div>

        {/* ── Shopping list ────────────────────────────────── */}
        {filteredItems.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag size={40} />}
            title={
              filter === "purchased"
                ? "購入済みの商品はありません"
                : "リストは空です"
            }
            description={
              filter === "purchased"
                ? "商品を購入するとここに表示されます。"
                : "上のフォームから商品を追加しましょう。"
            }
          />
        ) : (
          <ul className={styles.itemList}>
            {filteredItems.map((item) => (
              <li key={item.id}>
                <Card variant="fill" className={styles.itemCard}>
                  <div className={styles.itemRow}>
                    <div className={styles.itemLeft}>
                      <Checkbox
                        checked={item.purchased}
                        onChange={() => toggleItem(item.id)}
                        id={`item-${item.id}`}
                        label=""
                      />
                      <div className={styles.itemContent}>
                        <div className={styles.itemNameRow}>
                          <Text
                            as="span"
                            size="sm"
                            color={item.purchased ? "subtle" : "default"}
                            className={item.purchased ? styles.itemNameDone : undefined}
                          >
                            {item.name}
                          </Text>
                          <Text as="span" size="xs" color="muted" className={styles.itemQty}>{item.quantity}</Text>
                        </div>
                        <div className={styles.itemMeta}>
                          <Badge variant={categoryConfig[item.category].variant}>
                            {categoryConfig[item.category].label}
                          </Badge>
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
                        <DropdownItem onClick={() => setCategory(item.id, "vegetable")}>
                          🥬 野菜
                        </DropdownItem>
                        <DropdownItem onClick={() => setCategory(item.id, "meat")}>
                          🥩 肉・魚
                        </DropdownItem>
                        <DropdownItem onClick={() => setCategory(item.id, "dairy")}>
                          🥛 乳製品
                        </DropdownItem>
                        <DropdownItem onClick={() => setCategory(item.id, "staple")}>
                          🍞 主食
                        </DropdownItem>
                        <DropdownItem onClick={() => setCategory(item.id, "snack")}>
                          🍫 お菓子
                        </DropdownItem>
                        <DropdownItem onClick={() => deleteItem(item.id)}>
                          🗑️ 削除
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}

        {/* ── Clear purchased ─────────────────────────────── */}
        {purchasedCount > 0 && filter !== "remaining" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearPurchased}
            className={styles.clearBtn}
          >
            <Trash2 size={14} /> 購入済みを削除
          </Button>
        )}
      </main>

      {/* ── Bottom tab bar ──────────────────────────────────── */}
      <nav className={bottomBarStyles.bottomBar}>
        {(Object.keys(tabConfig) as BottomTab[]).map((key) => {
          const cfg = tabConfig[key];
          const IconComp = cfg.icon;
          const isActive = activeTab === key;
          const count =
            key === "all"
              ? items.filter((i) => !i.purchased).length
              : items.filter((i) => !i.purchased && i.category === key).length;
          return (
            <button
              key={key}
              type="button"
              className={`${bottomBarStyles.bottomTab} ${isActive ? bottomBarStyles.bottomTabActive : ""}`}
              onClick={() => setActiveTab(key)}
            >
              <IconComp size={20} />
              <span className={bottomBarStyles.bottomTabLabel}>{cfg.label}</span>
              {count > 0 && (
                <span className={bottomBarStyles.bottomTabBadge}>{count}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
