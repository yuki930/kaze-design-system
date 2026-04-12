import type { Meta, StoryObj } from "@storybook/nextjs";
import { Tracker } from "./Tracker";

const meta = {
  title: "Components/Tracker",
  component: Tracker,
} satisfies Meta<typeof Tracker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: Array.from({ length: 30 }, (_, i) => ({
      status:
        i % 7 === 0
          ? ("warning" as const)
          : i % 13 === 0
            ? ("negative" as const)
            : ("positive" as const),
      tooltip: `Day ${i + 1}`,
    })),
  },
};
