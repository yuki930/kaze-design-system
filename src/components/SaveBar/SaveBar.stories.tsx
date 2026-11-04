import type { Meta, StoryObj } from "@storybook/nextjs";
import { SaveBar } from "./SaveBar";
const meta = {
  title: "Components/SaveBar",
  component: SaveBar,
  args: { state: "idle", onSave: () => {}, onReset: () => {} },
} satisfies Meta<typeof SaveBar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Idle: Story = { args: { state: "idle" } };
export const Dirty: Story = { args: { state: "dirty" } };
export const Saving: Story = { args: { state: "saving" } };
export const Saved: Story = { args: { state: "saved" } };
export const Error: Story = { args: { state: "error" } };
