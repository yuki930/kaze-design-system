import type { Meta, StoryObj } from "@storybook/nextjs";
import { Link } from "./Link";

const meta = {
  title: "Components/Link",
  component: Link,
  args: { href: "#billing", children: "請求書の設定" },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const External: Story = {
  args: { external: true, children: "ヘルプセンター" },
};

export const InText: Story = {
  render: () => (
    <p style={{ margin: 0, fontSize: "var(--font-size-sm)", lineHeight: 1.75 }}>
      請求書の発行方法は<Link href="#billing">請求書の設定</Link>で変更できます。詳しくは
      <Link href="#billing" external>
        ヘルプセンター
      </Link>
      を見てください。
    </p>
  ),
};

export const AsChild: Story = {
  render: () => (
    <Link asChild>
      <a href="#billing">子要素の a にスタイルを渡す</a>
    </Link>
  ),
};
