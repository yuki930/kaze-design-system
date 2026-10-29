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
    tone: "default",
    children: "デフォルト",
  },
};

export const Positive: Story = {
  args: {
    tone: "positive",
    children: "上昇",
  },
};

export const Negative: Story = {
  args: {
    tone: "negative",
    children: "下落",
  },
};

export const Warning: Story = {
  args: {
    tone: "warning",
    children: "注意",
  },
};

export const Info: Story = {
  args: {
    tone: "info",
    children: "情報",
  },
};

export const WithDot: Story = {
  args: {
    tone: "positive",
    dot: true,
    children: "稼働中",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <Badge tone="default">デフォルト</Badge>
      <Badge tone="positive">上昇</Badge>
      <Badge tone="negative">下落</Badge>
      <Badge tone="warning">注意</Badge>
      <Badge tone="info">情報</Badge>
    </div>
  ),
};
