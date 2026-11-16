import type { Meta, StoryObj } from "@storybook/nextjs";
import { FormField } from "../FormField";
import { PhoneField } from "./PhoneField";

const meta = {
  title: "Components/PhoneField",
  component: PhoneField,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <FormField label="電話番号" description="ハイフンはなくてもかまいません">
          <Story />
        </FormField>
      </div>
    ),
  ],
} satisfies Meta<typeof PhoneField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Digits only in; shown with hyphens because 090 has a fixed split */
export const Mobile: Story = { args: { defaultValue: "09012345678" } };

export const Invalid: Story = { args: { defaultValue: "0901234", error: true } };
