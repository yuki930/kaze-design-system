import type { Meta, StoryObj } from "@storybook/nextjs";
import { Watermark } from "./Watermark";

/**
 * Auto-generated minimal story. Replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/Watermark",
  component: Watermark,
  args: {
    text: "社外秘",
    children: (
      <div
        style={{ width: 480, height: 240, padding: 24, border: "1px solid var(--color-border)" }}
      >
        四半期の売上レポート（下書き）
      </div>
    ),
  },
} satisfies Meta<typeof Watermark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
