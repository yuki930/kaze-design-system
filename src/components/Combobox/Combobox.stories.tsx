import type { Meta, StoryObj } from "@storybook/nextjs";
import { Combobox } from "./Combobox";
import { FormField } from "../FormField/FormField";

const options = [
  { value: "tokyo", label: "東京都", keywords: ["とうきょう"] },
  { value: "osaka", label: "大阪府", keywords: ["おおさか"] },
  { value: "kyoto", label: "京都府", keywords: ["きょうと"] },
  { value: "hokkaido", label: "北海道", keywords: ["ほっかいどう"] },
  { value: "fukuoka", label: "福岡県", keywords: ["ふくおか"], disabled: true },
];

const meta = {
  title: "Components/Combobox",
  component: Combobox,
  args: { options, placeholder: "選択または入力", "aria-label": "都道府県" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "20rem", minHeight: "16rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDefaultValue: Story = { args: { defaultValue: "osaka" } };

export const Small: Story = { args: { size: "sm" } };

export const Invalid: Story = {
  render: (args) => (
    <FormField label="都道府県" error="都道府県を選択してください">
      <Combobox {...args} aria-label={undefined} />
    </FormField>
  ),
};

export const Disabled: Story = { args: { disabled: true, defaultValue: "tokyo" } };
