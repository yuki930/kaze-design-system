import type { Meta, StoryObj } from "@storybook/nextjs";
import { BarList } from "./BarList";

const meta = {
  title: "Components/BarList",
  component: BarList,
} satisfies Meta<typeof BarList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [
      { label: "/dashboard", value: 1840 },
      { label: "/analytics", value: 1320 },
      { label: "/settings", value: 980 },
      { label: "/pricing", value: 540 },
      { label: "/blog", value: 410 },
    ],
  },
};
