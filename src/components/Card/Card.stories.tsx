import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
} from "./Card";
import { Metric } from "../Metric/Metric";

const meta = {
  title: "Components/Card",
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>ポートフォリオ概要</CardTitle>
        <CardDescription>保有資産の全体像を確認できます</CardDescription>
      </CardHeader>
      <CardBody>
        <p>ポートフォリオの詳細な情報がここに表示されます。</p>
      </CardBody>
      <CardFooter>
        <p>最終更新: 2026年2月19日</p>
      </CardFooter>
    </Card>
  ),
};

export const Interactive: Story = {
  render: (args) => (
    <Card {...args} variant="interactive">
      <CardHeader>
        <CardTitle>日本株ファンド</CardTitle>
        <CardDescription>クリックして詳細を表示</CardDescription>
      </CardHeader>
      <CardBody>
        <p>運用利回り: +12.5%</p>
      </CardBody>
    </Card>
  ),
};

export const Compact: Story = {
  render: (args) => (
    <Card {...args} variant="compact">
      <CardHeader>
        <CardTitle>今日の市場</CardTitle>
      </CardHeader>
      <CardBody>
        <p>日経平均: 38,420.50</p>
      </CardBody>
    </Card>
  ),
};

export const WithMetric: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>投資成績</CardTitle>
        <CardDescription>今月のパフォーマンス</CardDescription>
      </CardHeader>
      <CardBody>
        <Metric
          label="評価損益"
          value="+¥847,320"
          change={{ value: "+3.2%", trend: "positive" }}
        />
      </CardBody>
    </Card>
  ),
};
