import type { Meta, StoryObj } from "@storybook/nextjs";
import { Watermark } from "./Watermark";

/**
 * Auto-generated minimal story — replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/Watermark",
  component: Watermark,
  args: {
    text: "テキスト",
  },
} satisfies Meta<typeof Watermark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
