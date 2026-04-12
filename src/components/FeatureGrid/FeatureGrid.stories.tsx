import type { Meta, StoryObj } from "@storybook/nextjs";
import { Zap, Shield, Layers } from "lucide-react";
import { FeatureGrid, FeatureCard } from "./FeatureGrid";

const meta = {
  title: "Components/FeatureGrid",
  component: FeatureGrid,
} satisfies Meta<typeof FeatureGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <FeatureGrid>
      <FeatureCard icon={<Zap />} title="高速" description="ローカル起動が 0.5 秒以内。" />
      <FeatureCard icon={<Shield />} title="型安全" description="TypeScript strict モードで全コンポーネントの型が保証される。" />
      <FeatureCard icon={<Layers />} title="モジュラー" description="必要な分だけ tree-shake されて最小バンドルに。" />
    </FeatureGrid>
  ),
};
