import type { Meta, StoryObj } from "@storybook/nextjs";
import { Spinner } from "./Spinner";
import { Button } from "../Button/Button";

const meta = {
  title: "Components/Spinner",
  component: Spinner,
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

export const InButton: Story = {
  render: () => <Button loading>保存中</Button>,
};

export const OnDark: Story = {
  render: () => (
    <span
      style={{
        background: "var(--zinc-950)",
        color: "#fff",
        borderRadius: "var(--radius-md)",
        padding: "0.5rem 0.75rem",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        fontSize: "var(--font-size-xs)",
      }}
    >
      <Spinner size="sm" label="同期しています" />
      同期しています
    </span>
  ),
};
