import type { Meta, StoryObj } from "@storybook/nextjs";
import { Slider } from "./Slider";

/**
 * Auto-generated minimal story. Replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/Slider",
  component: Slider,
  args: {},
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
