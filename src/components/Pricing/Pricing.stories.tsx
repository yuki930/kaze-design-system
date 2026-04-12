import type { Meta, StoryObj } from "@storybook/nextjs";
import { PricingGrid, PricingCard } from "./Pricing";

const meta = {
  title: "Components/Pricing",
  component: PricingGrid,
} satisfies Meta<typeof PricingGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <PricingGrid>
      <PricingCard
        name="Free"
        price="¥0"
        period="/月"
        description="個人利用向け"
        features={["3 プロジェクトまで", "基本コンポーネント", "コミュニティサポート"]}
      />
      <PricingCard
        name="Pro"
        price="¥1,980"
        period="/月"
        description="個人・フリーランス向け"
        features={["無制限プロジェクト", "全コンポーネント", "メールサポート"]}
        featured
      />
      <PricingCard
        name="Team"
        price="¥4,980"
        period="/月"
        description="チーム・企業向け"
        features={["無制限メンバー", "SLA 99.9%", "優先サポート"]}
      />
    </PricingGrid>
  ),
};
