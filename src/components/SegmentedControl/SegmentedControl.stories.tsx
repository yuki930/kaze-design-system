import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { SegmentedControl } from "./SegmentedControl";

const periods = [
  { value: "1w", label: "1W" },
  { value: "1m", label: "1M" },
  { value: "3m", label: "3M" },
  { value: "1y", label: "1Y" },
];

const meta = {
  title: "Components/SegmentedControl",
  component: SegmentedControl,
  args: { "aria-label": "期間", options: periods, defaultValue: "1m" },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = { args: { size: "sm" } };

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    "aria-label": "表示切り替え",
    options: [
      { value: "chart", label: "グラフ" },
      { value: "table", label: "表" },
    ],
    defaultValue: "chart",
  },
};

export const WithDisabled: Story = {
  args: {
    options: [
      { value: "1w", label: "1W" },
      { value: "1m", label: "1M", disabled: true },
      { value: "3m", label: "3M" },
      { value: "1y", label: "1Y" },
    ],
    defaultValue: "1w",
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [v, setV] = useState("3m");
    return (
      <div style={{ display: "grid", gap: "0.75rem", justifyItems: "start" }}>
        <SegmentedControl {...args} value={v} onValueChange={setV} />
        <span>選択中: {v}</span>
      </div>
    );
  },
};
