import type { Meta, StoryObj } from "@storybook/nextjs";
import { Text } from "./Text";

/**
 * Auto-generated minimal story — replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/Text",
  component: Text,
  args: {

  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
