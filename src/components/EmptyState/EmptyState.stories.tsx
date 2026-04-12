import type { Meta, StoryObj } from "@storybook/nextjs";
import { EmptyState } from "./EmptyState";

/**
 * Auto-generated minimal story — replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  args: {
    title: "サンプルタイトル",
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
