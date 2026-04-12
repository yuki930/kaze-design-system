import type { Meta, StoryObj } from "@storybook/nextjs";
import { Grid } from "./Grid";

/**
 * Auto-generated minimal story — replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/Grid",
  component: Grid,
  args: {

  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
