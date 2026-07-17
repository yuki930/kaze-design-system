import type { Meta, StoryObj } from "@storybook/nextjs";
import { DescriptionList, DescriptionItem } from "./DescriptionList";

const meta = {
  title: "Components/DescriptionList",
  component: DescriptionList,
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <DescriptionItem term="氏名">野々村 圭</DescriptionItem>
        <DescriptionItem term="メール">kei.nonomura@norn.co.jp</DescriptionItem>
        <DescriptionItem term="所属">技術開発部</DescriptionItem>
      </>
    ),
  },
};
