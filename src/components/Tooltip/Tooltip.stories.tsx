import type { Meta, StoryObj } from "@storybook/nextjs";
import { Tooltip } from "./Tooltip";
import { Button } from "../Button/Button";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Top: Story = {
  args: {
    content: "上に表示されるツールチップ",
    side: "top",
    children: (<Button variant="outline">ホバーしてください</Button>),
  },
};

export const Bottom: Story = {
  args: {
    content: "下に表示されるツールチップ",
    side: "bottom",
    children: (<Button variant="outline">下</Button>),
  },
};

export const Left: Story = {
  args: {
    content: "左に表示",
    side: "left",
    children: (<Button variant="outline">左</Button>),
  },
};

export const Right: Story = {
  args: {
    content: "右に表示",
    side: "right",
    children: (<Button variant="outline">右</Button>),
  },
};
