import type { Meta, StoryObj } from "@storybook/nextjs";
import { LPFooter } from "./LPFooter";

const meta = {
  title: "Components/LPFooter",
  component: LPFooter,
} satisfies Meta<typeof LPFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    description: "静かで、読みやすい React デザインシステム",
    columns: [
      {
        title: "製品",
        links: [
          { label: "ドキュメント", href: "#" },
          { label: "サンプル", href: "#" },
          { label: "料金", href: "#" },
        ],
      },
      {
        title: "会社",
        links: [
          { label: "会社概要", href: "#" },
          { label: "採用情報", href: "#" },
        ],
      },
    ],
    bottomLeft: "© 2026 Kaze",
  },
};
