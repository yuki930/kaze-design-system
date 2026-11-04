import type { Meta, StoryObj } from "@storybook/nextjs";
import { DataStatus } from "./DataStatus";
const meta = {
  title: "Components/DataStatus",
  component: DataStatus,
  args: { status: "available", fetchedAt: "2026年1月8日 10:00 JST", asOf: "2026年1月7日" },
} satisfies Meta<typeof DataStatus>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Available: Story = { args: { status: "available" } };
export const Partial: Story = { args: { status: "partial" } };
export const Stale: Story = { args: { status: "stale" } };
export const Missing: Story = { args: { status: "missing" } };
