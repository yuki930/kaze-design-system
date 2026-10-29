import type { Meta, StoryObj } from "@storybook/nextjs";
import { VisuallyHidden } from "./VisuallyHidden";
import { Button } from "../Button/Button";

const meta = {
  title: "Components/VisuallyHidden",
  component: VisuallyHidden,
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IconButtonName: Story = {
  render: () => (
    <Button variant="outline" iconOnly>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <VisuallyHidden>検索</VisuallyHidden>
    </Button>
  ),
};

export const SkipLink: Story = {
  render: () => (
    <div>
      <p style={{ margin: "0 0 1rem", fontSize: "var(--font-size-xs)" }}>
        Tab キーでフォーカスすると表示されます。
      </p>
      <VisuallyHidden asChild focusable>
        <a href="#main">本文へ移動</a>
      </VisuallyHidden>
      <main id="main">本文</main>
    </div>
  ),
};
