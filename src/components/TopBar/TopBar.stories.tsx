import type { Meta, StoryObj } from "@storybook/nextjs";
import { TopBar } from "./TopBar";

const meta = {
  title: "Components/TopBar",
  component: TopBar,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof TopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <strong>ダッシュボード</strong>,
    actions: <span>宮田 千夏</span>,
  },
};
