import type { Meta, StoryObj } from "@storybook/nextjs";
import { CTABanner } from "./CTABanner";
import { Button } from "../Button";

const meta = {
  title: "Components/CTABanner",
  component: CTABanner,
} satisfies Meta<typeof CTABanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "今日から始めよう",
    description: "セットアップは 30 秒。クレジットカード不要です。",
    children: <Button variant="primary">無料で試す</Button>,
  },
};
