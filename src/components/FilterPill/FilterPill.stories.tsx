import type { Meta, StoryObj } from "@storybook/nextjs";
import { FilterPill } from "./FilterPill";

const meta = {
  title: "Components/FilterPill",
  component: FilterPill,
  args: {
    children: "フィルター",
  },
} satisfies Meta<typeof FilterPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "すべて",
  },
};

export const Active: Story = {
  args: {
    active: true,
    children: "アクティブ",
  },
};

export const WithColor: Story = {
  args: {
    active: true,
    color: "#10b981",
    dot: true,
    children: "ペアカード",
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      <FilterPill>すべて</FilterPill>
      <FilterPill active>選択中</FilterPill>
      <FilterPill active color="#10b981" dot>ペアカード</FilterPill>
      <FilterPill active color="#3b82f6" dot>口座開設</FilterPill>
      <FilterPill active color="#f59e0b" dot>お知らせ</FilterPill>
      <FilterPill active color="#ef4444" dot>キャンペーン</FilterPill>
      <FilterPill active color="#8b5cf6" dot>アプリ</FilterPill>
    </div>
  ),
};
