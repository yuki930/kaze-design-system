import type { Meta, StoryObj } from "@storybook/nextjs";
import { Home, Settings, BarChart3 } from "lucide-react";
import { Sidebar, NavItem, SidebarGroupLabel } from "./Sidebar";

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <SidebarGroupLabel>メイン</SidebarGroupLabel>
        <NavItem icon={<Home size={16} />} href="#">
          ダッシュボード
        </NavItem>
        <NavItem icon={<BarChart3 size={16} />} href="#">
          分析
        </NavItem>
        <SidebarGroupLabel>設定</SidebarGroupLabel>
        <NavItem icon={<Settings size={16} />} href="#">
          全般設定
        </NavItem>
      </>
    ),
  },
};
