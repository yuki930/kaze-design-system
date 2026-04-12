import type { Meta, StoryObj } from "@storybook/nextjs";
import { Section, SectionHeader } from "./Section";

const meta = {
  title: "Components/Section",
  component: Section,
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <SectionHeader title="導入事例" description="ユーザー企業の声" />
        <p>セクションの本文がここに入ります。</p>
      </>
    ),
  },
};
