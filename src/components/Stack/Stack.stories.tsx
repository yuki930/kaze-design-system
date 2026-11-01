import type { Meta, StoryObj } from "@storybook/nextjs";
import { Stack } from "./Stack";

/**
 * Auto-generated minimal story. Replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/Stack",
  component: Stack,
  args: {},
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
