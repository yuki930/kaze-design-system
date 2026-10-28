import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { ChartLegend } from "./ChartLegend";

const meta = {
  title: "Components/ChartLegend",
  component: ChartLegend,
} satisfies Meta<typeof ChartLegend>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { key: "web", label: "Web", color: "var(--chart-1)" },
  { key: "ios", label: "iOS", color: "var(--chart-2)" },
  { key: "android", label: "Android", color: "var(--chart-3)" },
];

export const Default: Story = {
  args: { items },
};

export const Toggleable: Story = {
  args: { items },
  render: (args) => {
    const [hidden, setHidden] = useState<string[]>(["android"]);
    return (
      <ChartLegend
        {...args}
        hidden={hidden}
        onToggle={(key) =>
          setHidden((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
        }
      />
    );
  },
};
