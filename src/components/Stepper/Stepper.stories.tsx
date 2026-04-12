import type { Meta, StoryObj } from "@storybook/nextjs";
import { Stepper } from "./Stepper";

const meta = {
  title: "Components/Stepper",
  component: Stepper,
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentStep: 2,
    steps: [
      { label: "アカウント情報" },
      { label: "プロフィール設定" },
      { label: "確認" },
      { label: "完了" },
    ],
  },
};
