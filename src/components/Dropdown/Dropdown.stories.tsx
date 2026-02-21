import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
} from "./Dropdown";
import { Button } from "../Button/Button";

const meta = {
  title: "Components/Dropdown",
  component: Dropdown,
  args: {
    children: null!,
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="outline">メニューを開く</Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onSelect={() => console.log("編集")}>編集</DropdownItem>
        <DropdownItem onSelect={() => console.log("複製")}>複製</DropdownItem>
        <DropdownItem onSelect={() => console.log("削除")}>削除</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="outline">操作</Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onSelect={() => console.log("コピー")}>
          コピー
        </DropdownItem>
        <DropdownItem onSelect={() => console.log("貼り付け")}>
          貼り付け
        </DropdownItem>
        <DropdownItem disabled>切り取り（無効）</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const WithSeparator: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="outline">アカウント</Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onSelect={() => console.log("プロフィール")}>
          プロフィール
        </DropdownItem>
        <DropdownItem onSelect={() => console.log("設定")}>設定</DropdownItem>
        <DropdownSeparator />
        <DropdownItem onSelect={() => console.log("ログアウト")}>
          ログアウト
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};
