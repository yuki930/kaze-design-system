import type { Meta, StoryObj } from "@storybook/nextjs";
import { FAB } from "./FAB";

/**
 * Auto-generated minimal story — replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/FAB",
  component: FAB,
  args: {
    label: "ラベル",
  },
} satisfies Meta<typeof FAB>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
