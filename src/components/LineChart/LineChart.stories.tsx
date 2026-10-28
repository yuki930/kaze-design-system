import type { Meta, StoryObj } from "@storybook/nextjs";
import { LineChart } from "./LineChart";

const months = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
];
const sales = [320, 340, 310, 390, 420, 460, 450, 510, 540, 520, 580, 640];
const users = [210, 230, 245, 260, 300, 310, 340, 360, 372, 410, 430, 470];

const data = months.map((month, i) => ({ month, sales: sales[i], users: users[i] }));

const meta = {
  title: "Components/LineChart",
  component: LineChart,
  args: {
    "aria-label": "月別の売上と利用者数",
    index: "month",
    data,
    series: [{ key: "sales", label: "売上（万円）" }],
  },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Area: Story = {
  args: { area: true, curve: "monotone" },
};

export const MultiSeries: Story = {
  args: {
    series: [
      { key: "sales", label: "売上（万円）" },
      { key: "users", label: "利用者数（人）" },
    ],
    showDots: true,
  },
};

export const MissingValues: Story = {
  args: {
    data: data.map((row, i) => (i === 4 || i === 5 ? { ...row, sales: null } : row)),
    series: [
      { key: "sales", label: "売上（万円）" },
      { key: "users", label: "利用者数（人）" },
    ],
  },
};
