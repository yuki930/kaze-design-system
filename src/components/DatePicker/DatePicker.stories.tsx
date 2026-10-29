import type { Meta, StoryObj } from "@storybook/nextjs";
import { DatePicker } from "./DatePicker";
import { FormField } from "../FormField/FormField";

const meta = {
  title: "Components/DatePicker",
  component: DatePicker,
  args: { "aria-label": "開始日" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "20rem", minHeight: "24rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { defaultValue: "2026-10-29" } };

export const JapaneseEra: Story = { args: { era: "japanese", defaultValue: "2026-10-29" } };

export const MondayStart: Story = { args: { weekStartsOn: 1, defaultValue: "2026-10-29" } };

export const WithRange: Story = {
  args: {
    defaultValue: "2026-10-15",
    min: "2026-10-10",
    max: "2026-10-25",
    // Weekends are unavailable in this demo; real holiday data is up to the app
    isDateDisabled: (date) => [0, 6].includes(new Date(`${date}T00:00:00Z`).getUTCDay()),
  },
};

export const Invalid: Story = {
  render: (args) => (
    <FormField label="開始日" error="日付を入力してください">
      <DatePicker {...args} aria-label={undefined} />
    </FormField>
  ),
};

export const OpenByDefault: Story = { args: { defaultOpen: true, defaultValue: "2026-10-29" } };

export const Small: Story = { args: { size: "sm" } };
