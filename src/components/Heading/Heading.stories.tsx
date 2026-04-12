import type { Meta, StoryObj } from "@storybook/nextjs";
import { Heading } from "./Heading";

/**
 * Auto-generated minimal story — replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/Heading",
  component: Heading,
  args: {
    children: "コンテンツ",
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
