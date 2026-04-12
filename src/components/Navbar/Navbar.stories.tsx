import type { Meta, StoryObj } from "@storybook/nextjs";
import { Navbar, NavbarLinks, NavbarLink } from "./Navbar";

const meta = {
  title: "Components/Navbar",
  component: Navbar,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    logo: <strong>Kaze</strong>,
    children: (
      <NavbarLinks>
        <NavbarLink href="#">ドキュメント</NavbarLink>
        <NavbarLink href="#">コンポーネント</NavbarLink>
        <NavbarLink href="#">料金</NavbarLink>
        <NavbarLink href="#">ブログ</NavbarLink>
      </NavbarLinks>
    ),
  },
};
