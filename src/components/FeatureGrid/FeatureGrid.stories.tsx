import type { Meta, StoryObj } from "@storybook/nextjs";
import { Zap, Shield, Layers } from "lucide-react";
import { FeatureGrid, FeatureCard } from "./FeatureGrid";

const meta = {
  title: "Components/FeatureGrid",
  component: FeatureGrid,
} satisfies Meta<typeof FeatureGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Spotlight: Story = {
  render: () => (
    <FeatureGrid variant="spotlight">
      <FeatureCard
        figure={
          <>
            23<small>KB</small>
          </>
        }
        title="圧倒的な軽量さ"
        description="ランタイム JavaScript ゼロ。gzip 後 23KB 程度の CSS で、すべてのコンポーネントをスタイリングします。"
      >
        <pre>
          <code>import "kaze-design-system/css/all";</code>
        </pre>
      </FeatureCard>
      <FeatureCard
        title="デザイントークン"
        description="カラー・タイポグラフィ・スペーシングを一元管理。テーマの切り替えもわずか数行です。"
      />
      <FeatureCard
        title="アクセシビリティ"
        description="キーボード操作、スクリーンリーダー対応を標準搭載しています。"
      />
      <FeatureCard
        title="ダークモード"
        description="ライト / ダークをワンクリックで切り替え。追加の CSS は不要です。"
      />
    </FeatureGrid>
  ),
};

export const Default: Story = {
  render: () => (
    <FeatureGrid>
      <FeatureCard icon={<Zap />} title="高速" description="ローカル起動が 0.5 秒以内。" />
      <FeatureCard
        icon={<Shield />}
        title="型安全"
        description="TypeScript strict モードで全コンポーネントの型が保証される。"
      />
      <FeatureCard
        icon={<Layers />}
        title="モジュラー"
        description="必要な分だけ tree-shake されて最小バンドルに。"
      />
    </FeatureGrid>
  ),
};
