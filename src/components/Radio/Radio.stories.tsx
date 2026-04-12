import type { Meta, StoryObj } from "@storybook/nextjs";
import { Radio, RadioGroup } from "./Radio";

const meta = {
  title: "Components/Radio",
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup label="お支払い方法" orientation="vertical">
      <Radio label="クレジットカード" name="payment" value="credit" defaultChecked />
      <Radio label="銀行振込" name="payment" value="bank" />
      <Radio label="代金引換" name="payment" value="cod" />
    </RadioGroup>
  ),
};
