import type { Meta, StoryObj } from "@storybook/nextjs";
import { FormSection } from "./FormSection";

/**
 * Auto-generated minimal story. Replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/FormSection",
  component: FormSection,
  args: {
    title: "サンプルタイトル",
  },
} satisfies Meta<typeof FormSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
