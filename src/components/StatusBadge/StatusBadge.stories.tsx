import type { Meta, StoryObj } from "@storybook/nextjs";
import { StatusBadge } from "./StatusBadge";

/**
 * Auto-generated minimal story — replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/StatusBadge",
  component: StatusBadge,
  args: {
    status: "live",
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
