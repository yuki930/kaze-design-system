import type { Meta, StoryObj } from "@storybook/nextjs";
import { Textarea } from "./Textarea";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "メッセージを入力...",
    rows: 4,
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div>
      <label className="label">備考</label>
      <Textarea {...args} placeholder="補足事項があればご記入ください" rows={4} />
    </div>
  ),
};
