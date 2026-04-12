import type { Meta, StoryObj } from "@storybook/nextjs";
import { Hero } from "./Hero";

const meta = {
  title: "Components/Hero",
  component: Hero,
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    badge: "新機能",
    title: "静かで、速くて、読みやすい。",
    subtitle: "管理画面と日本語コンテンツのための React デザインシステム。",
  },
};
