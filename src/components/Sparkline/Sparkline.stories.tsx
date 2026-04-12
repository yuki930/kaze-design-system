import type { Meta, StoryObj } from "@storybook/nextjs";
import { Sparkline } from "./Sparkline";

const meta = {
  title: "Components/Sparkline",
  component: Sparkline,
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [12, 18, 15, 22, 28, 24, 30, 35, 32, 40],
    width: 120,
    height: 32,
  },
};
