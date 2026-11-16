import type { Meta, StoryObj } from "@storybook/nextjs";
import { AddressField } from "./AddressField";

const meta = {
  title: "Components/AddressField",
  component: AddressField,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AddressField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { required: true } };

export const Filled: Story = {
  args: {
    defaultValue: {
      postalCode: "1500002",
      prefecture: "東京都",
      city: "渋谷区",
      line1: "渋谷 2-21-1",
      line2: "ヒカリエ 8F",
    },
  },
};

export const WithErrors: Story = {
  args: {
    required: true,
    errors: { postalCode: "郵便番号を 7 桁で入力してください", city: "市区町村を入力してください" },
  },
};
