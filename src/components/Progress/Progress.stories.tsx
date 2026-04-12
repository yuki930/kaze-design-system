import type { Meta, StoryObj } from "@storybook/nextjs";
import { Progress } from "./Progress";

/**
 * Auto-generated minimal story — replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/Progress",
  component: Progress,
  args: {
    value: 0,
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
