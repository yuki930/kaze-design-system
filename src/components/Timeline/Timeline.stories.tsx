import type { Meta, StoryObj } from "@storybook/nextjs";
import { Timeline, TimelineItem } from "./Timeline";

const meta = {
  title: "Components/Timeline",
  component: Timeline,
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <TimelineItem status="positive" title="要件定義" time="2026-01-10" />
        <TimelineItem status="positive" title="設計" time="2026-02-05" />
        <TimelineItem status="info" title="実装" description="進行中" />
        <TimelineItem status="default" title="リリース" description="未着手" />
      </>
    ),
  },
};
