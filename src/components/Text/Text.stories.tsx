import type { Meta, StoryObj } from "@storybook/nextjs";
import { Text } from "./Text";

/**
 * Auto-generated minimal story. Replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/Text",
  component: Text,
  args: {
    children: "風のように軽やかな、日本語に最適化されたデザインシステム。",
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Lead: Story = {
  args: { variant: "lead" },
};

export const Caption: Story = {
  args: { variant: "caption", children: "最終更新 2026年10月29日" },
};

export const Muted: Story = {
  args: { color: "muted", size: "sm" },
};
