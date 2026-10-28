import type { Meta, StoryObj } from "@storybook/nextjs";
import { ColumnChart } from "./ColumnChart";

const meta = {
  title: "Components/ColumnChart",
  component: ColumnChart,
} satisfies Meta<typeof ColumnChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const quarterly = [
  { month: "1月", web: 420, app: 310, store: 180 },
  { month: "2月", web: 380, app: 340, store: 210 },
  { month: "3月", web: 520, app: 390, store: 240 },
  { month: "4月", web: 610, app: 420, store: 230 },
  { month: "5月", web: 570, app: 480, store: 260 },
  { month: "6月", web: 690, app: 510, store: 290 },
];

const series = [
  { key: "web", label: "Web" },
  { key: "app", label: "アプリ" },
  { key: "store", label: "店舗" },
];

export const Grouped: Story = {
  args: { "aria-label": "チャネル別の月次売上", data: quarterly, index: "month", series },
};

export const Stacked: Story = {
  args: { ...Grouped.args, layout: "stacked", "aria-label": "チャネル別の月次売上(積み上げ)" },
};

export const NegativeValues: Story = {
  args: {
    "aria-label": "月次の営業利益",
    index: "month",
    layout: "stacked",
    data: [
      { month: "1月", revenue: 320, cost: -180 },
      { month: "2月", revenue: 280, cost: -240 },
      { month: "3月", revenue: 410, cost: -200 },
      { month: "4月", revenue: 150, cost: -260 },
      { month: "5月", revenue: 380, cost: -190 },
    ],
    series: [
      { key: "revenue", label: "売上" },
      { key: "cost", label: "費用" },
    ],
  },
};

export const SingleSeries: Story = {
  args: {
    "aria-label": "週次のアクティブユーザー数",
    index: "week",
    data: [
      { week: "第1週", users: 1200 },
      { week: "第2週", users: 1480 },
      { week: "第3週", users: 1320 },
      { week: "第4週", users: 1760 },
    ],
    series: [{ key: "users", label: "アクティブユーザー" }],
    formatValue: (v) => `${v.toLocaleString("ja-JP")}人`,
    yAxisWidth: 64,
  },
};
