import type { Meta, StoryObj } from "@storybook/nextjs";
import { FAQ, FAQItem } from "./FAQ";

const meta = {
  title: "Components/FAQ",
  component: FAQ,
} satisfies Meta<typeof FAQ>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <FAQ>
      <FAQItem question="無料で使えますか？" answer="個人利用・商用利用ともに MIT ライセンスで無料です。" />
      <FAQItem question="React 18 でも動きますか？" answer="React 18 以上で動作します（React 19 推奨）。" />
      <FAQItem question="Tailwind と併用できますか？" answer="できます。CSS カスケードレイヤーで詳細度が管理されています。" />
    </FAQ>
  ),
};
