import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "./Dialog";
import { Button } from "../Button/Button";

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  args: {
    open: true,
    onClose: () => {},
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
  },
  render: (args) => (
    <Dialog {...args}>
      <DialogHeader>
        <DialogTitle>注文の確認</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <p>この注文を確定してもよろしいですか？確定後の取り消しはできません。</p>
      </DialogBody>
      <DialogFooter>
        <Button variant="outline" onClick={args.onClose}>
          キャンセル
        </Button>
        <Button variant="primary">確認</Button>
      </DialogFooter>
    </Dialog>
  ),
};
