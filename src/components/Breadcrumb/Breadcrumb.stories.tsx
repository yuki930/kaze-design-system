import type { Meta, StoryObj } from "@storybook/nextjs";
import { Breadcrumb } from "./Breadcrumb";

const meta = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: "ホーム", href: "#" },
      { label: "プロジェクト", href: "#" },
      { label: "設定" },
    ],
  },
};
