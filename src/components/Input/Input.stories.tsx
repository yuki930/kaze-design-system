import type { Meta, StoryObj } from "@storybook/nextjs";
import { Input } from "./Input";

const meta = {
  title: "Components/Input",
  component: Input,
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "テキストを入力...",
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div>
      <label className="label">メールアドレス</label>
      <Input {...args} placeholder="example@email.com" type="email" />
    </div>
  ),
};

export const Error: Story = {
  args: {
    error: true,
    placeholder: "入力エラー",
    defaultValue: "不正な値",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "編集不可",
  },
};
