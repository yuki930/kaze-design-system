import type { Meta, StoryObj } from "@storybook/nextjs";
import { Progress } from "./Progress";

/**
 * Auto-generated minimal story. Replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/Progress",
  component: Progress,
  args: {
    value: 45,
    label: "アップロード中",
    showValue: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Positive: Story = {
  args: { value: 100, tone: "positive", label: "完了" },
};

export const Small: Story = {
  args: { value: 30, size: "sm" },
};
