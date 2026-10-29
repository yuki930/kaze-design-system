import type { Meta, StoryObj } from "@storybook/nextjs";
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerTitle } from "./Drawer";
import { Button } from "../Button/Button";

const meta = {
  title: "Components/Drawer",
  component: Drawer,
  args: {
    open: true,
    onOpenChange: (_open: boolean) => {},
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {
  render: (args) => (
    <Drawer {...args}>
      <DrawerHeader>
        <DrawerTitle>絞り込み</DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <p>条件を選んで一覧を絞り込みます。</p>
      </DrawerBody>
      <DrawerFooter>
        <Button variant="outline" onClick={() => args.onOpenChange?.(false)}>
          キャンセル
        </Button>
        <Button variant="primary">適用</Button>
      </DrawerFooter>
    </Drawer>
  ),
};

export const Left: Story = { ...Right, args: { side: "left", size: "sm" } };

export const BottomSheet: Story = { ...Right, args: { side: "bottom", size: "md" } };

export const Large: Story = { ...Right, args: { size: "lg" } };
