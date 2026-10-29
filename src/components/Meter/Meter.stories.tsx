import type { Meta, StoryObj } from "@storybook/nextjs";
import { Meter } from "./Meter";

/**
 * Auto-generated minimal story. Replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/Meter",
  component: Meter,
  args: {
    value: 62,
    label: "ストレージ使用量",
    showValue: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Warning: Story = {
  args: { value: 82, warningThreshold: 0.75, dangerThreshold: 0.9 },
};

export const Danger: Story = {
  args: { value: 95, warningThreshold: 0.75, dangerThreshold: 0.9 },
};
