import type { Meta, StoryObj } from "@storybook/nextjs";
import { Badge } from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  args: {
    children: "ラベル",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    children: "デフォルト",
  },
};

export const Positive: Story = {
  args: {
    variant: "positive",
    children: "上昇",
  },
};

export const Negative: Story = {
  args: {
    variant: "negative",
    children: "下落",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: "注意",
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    children: "情報",
  },
};

export const WithDot: Story = {
  args: {
    variant: "positive",
    dot: true,
    children: "稼働中",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <Badge variant="default">デフォルト</Badge>
      <Badge variant="positive">上昇</Badge>
      <Badge variant="negative">下落</Badge>
      <Badge variant="warning">注意</Badge>
      <Badge variant="info">情報</Badge>
    </div>
  ),
};
