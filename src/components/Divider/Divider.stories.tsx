import type { Meta, StoryObj } from "@storybook/nextjs";
import { Divider } from "./Divider";

const meta = {
  title: "Components/Divider",
  component: Divider,
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Subtle: Story = {
  args: {
    subtle: true,
  },
};

export const WithText: Story = {
  args: {
    text: "またはメールで登録",
  },
};
