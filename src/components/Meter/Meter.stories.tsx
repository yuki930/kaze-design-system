import type { Meta, StoryObj } from "@storybook/nextjs";
import { Meter } from "./Meter";

/**
 * Auto-generated minimal story — replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/Meter",
  component: Meter,
  args: {
    value: 0,
  },
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
