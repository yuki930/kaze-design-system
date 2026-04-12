import type { Meta, StoryObj } from "@storybook/nextjs";
import { Alert } from "./Alert";

/**
 * Auto-generated minimal story — replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/Alert",
  component: Alert,
  args: {
    children: "コンテンツ",
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
