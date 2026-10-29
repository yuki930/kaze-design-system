import type { Meta, StoryObj } from "@storybook/nextjs";
import { Grid } from "./Grid";

/**
 * Auto-generated minimal story. Replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const cell = (label: string) => (
  <div
    key={label}
    style={{
      padding: 16,
      borderRadius: 8,
      background: "var(--color-bg-secondary)",
      border: "1px solid var(--color-border)",
    }}
  >
    {label}
  </div>
);

const meta = {
  title: "Components/Grid",
  component: Grid,
  args: {
    columns: 3,
    gap: "md",
    children: ["売上", "注文数", "客単価", "新規顧客", "解約率", "継続率"].map(cell),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TwoColumns: Story = {
  args: { columns: 2, gap: "lg" },
};
