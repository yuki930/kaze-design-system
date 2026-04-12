import type { Meta, StoryObj } from "@storybook/nextjs";
import { Stats, StatItem } from "./Stats";

const meta = {
  title: "Components/Stats",
  component: Stats,
} satisfies Meta<typeof Stats>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Stats>
      <StatItem label="稼働率" value="99.98%" />
      <StatItem label="平均応答時間" value="42ms" />
      <StatItem label="月間リクエスト" value="2.3B" />
      <StatItem label="対応言語" value="6" />
    </Stats>
  ),
};
