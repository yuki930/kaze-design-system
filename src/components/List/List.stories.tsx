import type { Meta, StoryObj } from "@storybook/nextjs";
import { List, ListItem } from "./List";

const meta = {
  title: "Components/List",
  component: List,
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <ListItem>最初の項目</ListItem>
        <ListItem>次の項目</ListItem>
        <ListItem>最後の項目</ListItem>
      </>
    ),
  },
};
