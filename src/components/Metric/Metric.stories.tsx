import type { Meta, StoryObj } from "@storybook/nextjs";
import { Metric } from "./Metric";

const meta = {
  title: "Components/Metric",
  component: Metric,
} satisfies Meta<typeof Metric>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "保有銘柄",
    value: "6",
  },
};

export const WithChange: Story = {
  args: {
    label: "評価損益",
    value: "+¥847,320",
    change: {
      value: "+3.2%",
      trend: "positive",
    },
  },
};

export const Large: Story = {
  args: {
    label: "ポートフォリオ総額",
    value: "¥12,847,320",
    large: true,
  },
};

export const NegativeChange: Story = {
  args: {
    label: "本日の損益",
    value: "-¥23,450",
    change: {
      value: "-1.8%",
      trend: "negative",
    },
  },
};
