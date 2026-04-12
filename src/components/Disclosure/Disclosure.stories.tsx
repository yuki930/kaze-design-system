import type { Meta, StoryObj } from "@storybook/nextjs";
import { Disclosure } from "./Disclosure";

/**
 * Auto-generated minimal story — replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/Disclosure",
  component: Disclosure,
  args: {
    title: "サンプルタイトル",
    children: "コンテンツ",
  },
} satisfies Meta<typeof Disclosure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
