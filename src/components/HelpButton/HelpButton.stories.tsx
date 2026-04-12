import type { Meta, StoryObj } from "@storybook/nextjs";
import { HelpButton } from "./HelpButton";

/**
 * Auto-generated minimal story — replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/HelpButton",
  component: HelpButton,
  args: {
    children: "コンテンツ",
  },
} satisfies Meta<typeof HelpButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
