import type { Meta, StoryObj } from "@storybook/nextjs";
import { Logo } from "./Logo";

/**
 * Auto-generated minimal story — replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/Logo",
  component: Logo,
  args: {

  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
