import type { Meta, StoryObj } from "@storybook/nextjs";
import { Skeleton } from "./Skeleton";

/**
 * Auto-generated minimal story. Replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  args: {
    width: 240,
    height: 16,
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Circle: Story = {
  args: { width: 40, height: 40, circle: true },
};

export const CardPlaceholder: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", width: 320 }}>
      <Skeleton width={40} height={40} circle />
      <div style={{ display: "grid", gap: 8, flex: 1 }}>
        <Skeleton height={14} width="60%" />
        <Skeleton height={12} />
      </div>
    </div>
  ),
};
