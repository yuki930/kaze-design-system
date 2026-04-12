import type { Meta, StoryObj } from "@storybook/nextjs";
import { Skeleton } from "./Skeleton";

/**
 * Auto-generated minimal story — replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  args: {

  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
