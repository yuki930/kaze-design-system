import type { Meta, StoryObj } from "@storybook/nextjs";
import { AnnouncementBar } from "./AnnouncementBar";
import { Link } from "../Link";

const meta = {
  title: "Components/AnnouncementBar",
  component: AnnouncementBar,
} satisfies Meta<typeof AnnouncementBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "v1.1 を公開しました。Spinner や Table の並べ替えが加わっています。",
    action: <Link href="#">変更点を見る</Link>,
  },
};

export const WithoutAction: Story = {
  args: { children: "本日 23 時から 30 分間、メンテナンスのため停止します。" },
};
