import type { Meta, StoryObj } from "@storybook/nextjs";
import { PanelHeader } from "./PanelHeader";

/**
 * Auto-generated minimal story. Replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/PanelHeader",
  component: PanelHeader,
  args: {
    title: "サンプルタイトル",
  },
} satisfies Meta<typeof PanelHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
