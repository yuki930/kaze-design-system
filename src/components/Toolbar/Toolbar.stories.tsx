import type { Meta, StoryObj } from "@storybook/nextjs";
import { Toolbar } from "./Toolbar";

/**
 * Auto-generated minimal story. Replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/Toolbar",
  component: Toolbar,
  args: {
    "aria-label": "サンプル",
  },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
