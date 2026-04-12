import type { Meta, StoryObj } from "@storybook/nextjs";
import { BarChart } from "./BarChart";

const meta = {
  title: "Components/BarChart",
  component: BarChart,
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "aria-label": "月次売上",
    data: [
      { label: "1月", value: 420 },
      { label: "2月", value: 580 },
      { label: "3月", value: 720 },
      { label: "4月", value: 650 },
      { label: "5月", value: 840 },
    ],
  },
};
