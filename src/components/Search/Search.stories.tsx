import type { Meta, StoryObj } from "@storybook/nextjs";
import { Search } from "./Search";

const meta = {
  title: "Components/Search",
  component: Search,
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "検索...",
  },
};

export const WithShortcut: Story = {
  args: {
    placeholder: "検索...",
    shortcut: "⌘K",
  },
};
