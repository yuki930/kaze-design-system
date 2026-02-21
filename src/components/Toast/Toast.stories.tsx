import type { Meta, StoryObj } from "@storybook/nextjs";
import { ToastProvider, useToast } from "./Toast";
import { Button } from "../Button/Button";

/* ── Helper component to trigger toasts inside stories ───── */

function ToastTrigger({
  title,
  description,
  variant,
}: {
  title: string;
  description?: string;
  variant?: "default" | "positive" | "negative" | "warning";
}) {
  const { toast } = useToast();
  return (
    <Button
      variant="outline"
      onClick={() => toast({ title, description, variant })}
    >
      トーストを表示
    </Button>
  );
}

const meta = {
  title: "Components/Toast",
  component: ToastProvider,
  args: {
    children: null!,
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ToastTrigger
      title="変更が保存されました"
      description="すべての変更が正常に保存されました。"
    />
  ),
};

export const Positive: Story = {
  render: () => (
    <ToastTrigger
      title="操作が完了しました"
      description="ファイルが正常にアップロードされました。"
      variant="positive"
    />
  ),
};

export const Negative: Story = {
  render: () => (
    <ToastTrigger
      title="エラーが発生しました"
      description="接続に失敗しました。もう一度お試しください。"
      variant="negative"
    />
  ),
};

export const Warning: Story = {
  render: () => (
    <ToastTrigger
      title="注意が必要です"
      description="ストレージの使用量が90%を超えています。"
      variant="warning"
    />
  ),
};
