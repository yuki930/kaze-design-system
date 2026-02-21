import type { Meta, StoryObj } from "@storybook/nextjs";
import { Select } from "./Select";

const meta = {
  title: "Components/Select",
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Select {...args}>
      <option value="">選択してください</option>
      <option value="none">未経験</option>
      <option value="less1">1年未満</option>
      <option value="1to3">1〜3年</option>
      <option value="3to5">3〜5年</option>
      <option value="over5">5年以上</option>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <div>
      <label className="label">投資経験</label>
      <Select {...args}>
        <option value="">選択してください</option>
        <option value="none">未経験</option>
        <option value="less1">1年未満</option>
        <option value="1to3">1〜3年</option>
        <option value="3to5">3〜5年</option>
        <option value="over5">5年以上</option>
      </Select>
    </div>
  ),
};
