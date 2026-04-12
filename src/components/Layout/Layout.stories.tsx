import type { Meta, StoryObj } from "@storybook/nextjs";
import { AppLayout } from "./Layout";

const meta = {
  title: "Components/AppLayout",
  component: AppLayout,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sidebar: (
      <div style={{ padding: 16, color: "var(--color-fg-secondary)" }}>
        Sidebar placeholder
      </div>
    ),
    children: (
      <div style={{ padding: 24 }}>
        <h1>本文エリア</h1>
        <p>AppLayout はサイドバーとメイン領域を組み合わせます。</p>
      </div>
    ),
  },
};
