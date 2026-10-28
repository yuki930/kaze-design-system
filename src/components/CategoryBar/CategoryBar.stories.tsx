import type { Meta, StoryObj } from "@storybook/nextjs";
import { CategoryBar } from "./CategoryBar";

const meta = {
  title: "Components/CategoryBar",
  component: CategoryBar,
  args: {
    "aria-label": "ストレージ使用量の内訳",
    data: [
      { label: "ドキュメント", value: 42 },
      { label: "画像", value: 28 },
      { label: "動画", value: 18 },
      { label: "その他", value: 12 },
    ],
    formatValue: (v: number) => `${v} GB`,
  },
} satisfies Meta<typeof CategoryBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPercent: Story = { args: { showPercent: true } };

export const WithMarker: Story = {
  args: {
    "aria-label": "予算消化の内訳",
    data: [
      { label: "広告", value: 480 },
      { label: "人件費", value: 320 },
      { label: "外注", value: 150 },
    ],
    marker: { value: 700, label: "目標" },
    formatValue: (v: number) => `${v} 万円`,
    showPercent: true,
  },
};

export const Nps: Story = {
  args: {
    "aria-label": "NPS の分布",
    data: [
      { label: "批判者", value: 18, color: "var(--color-negative)" },
      { label: "中立者", value: 32, color: "var(--color-fg-tertiary)" },
      { label: "推奨者", value: 50, color: "var(--color-positive)" },
    ],
    formatValue: (v: number) => `${v}`,
    showPercent: true,
  },
};

export const Thick: Story = { args: { height: 16, showLabels: false } };
