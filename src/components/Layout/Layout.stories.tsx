import type { Meta, StoryObj } from "@storybook/nextjs";
import { NavItem, Sidebar } from "../Sidebar/Sidebar";
import { TopBar } from "../TopBar/TopBar";
import { AppLayout } from "./Layout";

const meta = {
  title: "Components/AppLayout",
  component: AppLayout,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sidebar: (
      <div style={{ padding: 16, color: "var(--color-fg-secondary)" }}>Sidebar placeholder</div>
    ),
    children: (
      <div style={{ padding: 24 }}>
        <h1>本文エリア</h1>
        <p>AppLayout はサイドバーとメイン領域を組み合わせます。</p>
      </div>
    ),
  },
};

const phoneFrame = (Story: () => React.JSX.Element) => (
  <div
    style={{ width: 375, height: 640, border: "1px solid var(--color-border)", overflow: "auto" }}
  >
    <Story />
  </div>
);

const navSidebar = (
  <Sidebar logo="Kaze">
    <NavItem href="#" active>
      ダッシュボード
    </NavItem>
    <NavItem href="#">プロジェクト</NavItem>
    <NavItem href="#">設定</NavItem>
  </Sidebar>
);

const phoneArgs = {
  sidebar: navSidebar,
  topbar: <TopBar>ダッシュボード</TopBar>,
  children: <div style={{ padding: 16 }}>本文エリア</div>,
};

/** 768px 未満ではサイドバーが隠れ、TopBar のメニューボタンから開く */
export const PhoneClosed: Story = {
  args: phoneArgs,
  decorators: [phoneFrame],
  tags: ["vrt-phone"],
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

export const PhoneOpen: Story = {
  args: { ...phoneArgs, defaultNavOpen: true },
  decorators: [phoneFrame],
  tags: ["vrt-phone"],
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

/** topbar を渡さないときは、メニューボタンだけの最小のバーが出る */
export const PhoneWithoutTopbar: Story = {
  args: { sidebar: navSidebar, children: phoneArgs.children },
  decorators: [phoneFrame],
  tags: ["vrt-phone"],
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
