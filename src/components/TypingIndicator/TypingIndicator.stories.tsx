import type { Meta, StoryObj } from "@storybook/nextjs";
import { TypingIndicator } from "./TypingIndicator";

const meta = {
  title: "Components/TypingIndicator",
  component: TypingIndicator,
} satisfies Meta<typeof TypingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
      <TypingIndicator size="sm" />
      <TypingIndicator size="md" />
      <TypingIndicator size="lg" />
    </div>
  ),
};

export const WithName: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <TypingIndicator size="sm" label="宮田 千夏さんが入力中" />
      <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-fg-secondary)" }}>
        宮田 千夏さんが入力中
      </span>
    </div>
  ),
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
      <TypingIndicator size="sm" />
      同期しています
    </span>
  ),
};
