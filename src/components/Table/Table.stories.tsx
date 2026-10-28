import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./Table";
import { Badge } from "../Badge/Badge";

const meta = {
  title: "Components/Table",
  component: Table,
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const stockData = [
  { name: "潮見電機", price: "¥2,845", change: "+1.2%" },
  { name: "北斗精工", price: "¥13,200", change: "-0.8%" },
  { name: "あかつき遊技", price: "¥8,150", change: "+2.5%" },
  { name: "燕重工", price: "¥62,300", change: "+0.3%" },
  { name: "若葉アパレル", price: "¥41,500", change: "-1.1%" },
];

export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>銘柄名</TableHead>
          <TableHead>株価</TableHead>
          <TableHead>変動</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stockData.map((stock) => (
          <TableRow key={stock.name}>
            <TableCell>{stock.name}</TableCell>
            <TableCell>{stock.price}</TableCell>
            <TableCell>{stock.change}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Compact: Story = {
  render: (args) => (
    <Table {...args} compact>
      <TableHeader>
        <TableRow>
          <TableHead>銘柄名</TableHead>
          <TableHead>株価</TableHead>
          <TableHead>変動</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stockData.map((stock) => (
          <TableRow key={stock.name}>
            <TableCell>{stock.name}</TableCell>
            <TableCell>{stock.price}</TableCell>
            <TableCell>{stock.change}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

const signalData = [
  { name: "潮見電機", price: "¥2,845", signal: "買い" as const },
  { name: "北斗精工", price: "¥13,200", signal: "売り" as const },
  { name: "あかつき遊技", price: "¥8,150", signal: "買い" as const },
  { name: "燕重工", price: "¥62,300", signal: "中立" as const },
  { name: "若葉アパレル", price: "¥41,500", signal: "売り" as const },
];

const signalVariant = {
  "買い": "positive",
  "売り": "negative",
  "中立": "warning",
} as const;

export const WithBadges: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>銘柄名</TableHead>
          <TableHead>株価</TableHead>
          <TableHead>シグナル</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {signalData.map((stock) => (
          <TableRow key={stock.name}>
            <TableCell>{stock.name}</TableCell>
            <TableCell>{stock.price}</TableCell>
            <TableCell>
              <Badge variant={signalVariant[stock.signal]} dot>
                {stock.signal}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
