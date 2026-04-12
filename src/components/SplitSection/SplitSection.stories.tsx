import type { Meta, StoryObj } from "@storybook/nextjs";
import { SplitSection } from "./SplitSection";

const meta = {
  title: "Components/SplitSection",
  component: SplitSection,
} satisfies Meta<typeof SplitSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    mediaBg: "linear-gradient(135deg, #f4f4f5 0%, #e4e4e7 100%)",
    children: (
      <>
        <h2 style={{ fontSize: 28, marginBottom: 8 }}>ゼロ設定で高速起動</h2>
        <p>Turbopack + Vite でローカル開発の立ち上がりが 0.5 秒以内。</p>
      </>
    ),
  },
};
