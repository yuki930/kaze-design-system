import type { Meta, StoryObj } from "@storybook/nextjs";
import { NameField } from "./NameField";

const meta = {
  title: "Components/NameField",
  component: NameField,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NameField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { required: true } };

export const Filled: Story = {
  args: {
    defaultValue: { family: "相楽", given: "実咲", familyKana: "サガラ", givenKana: "ミサキ" },
  },
};

export const Hiragana: Story = { args: { kana: "hiragana" } };

export const WithoutReading: Story = { args: { kana: false } };

export const WithErrors: Story = {
  args: {
    required: true,
    errors: { family: "姓を入力してください", givenKana: "メイをカタカナで入力してください" },
  },
};
