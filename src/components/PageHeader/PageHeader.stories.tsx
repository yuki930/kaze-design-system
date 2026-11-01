import type { Meta, StoryObj } from "@storybook/nextjs";
import { PageHeader } from "./PageHeader";

/**
 * Auto-generated minimal story. Replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/PageHeader",
  component: PageHeader,
  args: {
    title: "サンプルタイトル",
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
