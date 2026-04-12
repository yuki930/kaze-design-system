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
        authorName="田中 健"
        authorRole="CTO, マルシェテック"
      />
      <TestimonialCard
        quote="日本語組版が最初から最適化されているのは助かる。"
        authorName="佐藤 美咲"
        authorRole="デザインリード, ワイズサーチ"
      />
    </TestimonialGrid>
  ),
};
