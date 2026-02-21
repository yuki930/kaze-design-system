import type { Meta, StoryObj } from "@storybook/nextjs";
import { Icon } from "./Icon";
import {
  Search,
  Settings,
  Bell,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Heart,
  Plus,
  X,
} from "lucide-react";

const meta = {
  title: "Components/Icon",
  component: Icon,
  args: {
    icon: Search,
    size: "md",
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Icon icon={Search} size="xs" />
      <Icon icon={Search} size="sm" />
      <Icon icon={Search} size="md" />
      <Icon icon={Search} size="lg" />
      <Icon icon={Search} size="xl" />
    </div>
  ),
};

export const FinancialIcons: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Icon icon={TrendingUp} size="lg" label="上昇トレンド" style={{ color: "var(--color-emerald)" }} />
      <Icon icon={TrendingDown} size="lg" label="下降トレンド" style={{ color: "var(--color-red)" }} />
      <Icon icon={ArrowUpRight} size="lg" label="上昇" style={{ color: "var(--color-emerald)" }} />
      <Icon icon={ArrowDownRight} size="lg" label="下降" style={{ color: "var(--color-red)" }} />
    </div>
  ),
};

export const CommonUI: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Icon icon={Search} size="md" label="検索" />
      <Icon icon={Settings} size="md" label="設定" />
      <Icon icon={Bell} size="md" label="通知" />
      <Icon icon={Star} size="md" label="お気に入り" />
      <Icon icon={Heart} size="md" label="いいね" />
      <Icon icon={Plus} size="md" label="追加" />
      <Icon icon={X} size="md" label="閉じる" />
      <Icon icon={ChevronDown} size="md" label="展開" />
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    icon: Bell,
    size: "lg",
    label: "通知アイコン",
  },
};
