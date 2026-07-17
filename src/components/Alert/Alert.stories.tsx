import type { Meta, StoryObj } from "@storybook/nextjs";
import { Alert } from "./Alert";

const meta = {
  title: "Components/Alert",
  component: Alert,
  args: {
    children: "コンテンツ",
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    title: "お知らせ",
  },
};

export const Positive: Story = {
  args: {
    variant: "positive",
    title: "完了しました",
  },
};

export const Negative: Story = {
  args: {
    variant: "negative",
    title: "エラーが発生しました",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "注意が必要です",
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    title: "情報",
  },
};
