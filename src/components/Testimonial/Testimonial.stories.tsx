import type { Meta, StoryObj } from "@storybook/nextjs";
import { TestimonialGrid, TestimonialCard } from "./Testimonial";

const meta = {
  title: "Components/Testimonial",
  component: TestimonialGrid,
} satisfies Meta<typeof TestimonialGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TestimonialGrid>
      <TestimonialCard
        quote="設定ゼロで導入できて、最初の成果が出るまでが一番早かった。"
        authorName="呉羽 直樹"
        authorRole="取締役CTO, 合同会社潮目"
      />
      <TestimonialCard
        quote="日本語組版が最初から最適化されているのは助かる。"
        authorName="宮田 千夏"
        authorRole="デザインエンジニア, 八十八株式会社"
      />
    </TestimonialGrid>
  ),
};
