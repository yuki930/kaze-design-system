import type { Meta, StoryObj } from "@storybook/nextjs";
import { DonutChart } from "./DonutChart";

const meta = {
  title: "Components/DonutChart",
  component: DonutChart,
} satisfies Meta<typeof DonutChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "aria-label": "流入経路",
    data: [
      { label: "Organic", value: 5420 },
      { label: "Direct", value: 3210 },
      { label: "Referral", value: 1870 },
      { label: "Social", value: 980 },
    ],
  },
};
