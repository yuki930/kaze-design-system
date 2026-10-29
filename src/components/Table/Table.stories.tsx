import type { Meta, StoryObj } from "@storybook/nextjs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./Table";
import { Badge } from "../Badge/Badge";
import { useTableSort } from "../../hooks/useTableSort";

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
  買い: "positive",
  売り: "negative",
  中立: "warning",
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
              <Badge tone={signalVariant[stock.signal]} dot>
                {stock.signal}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

const salesData = [
  { store: "渋谷", sales: 4820000, yoy: 12.4 },
  { store: "梅田", sales: 3915000, yoy: 3.1 },
  { store: "天神", sales: 2140000, yoy: -1.8 },
];

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;
const percent = (n: number) => `${n < 0 ? "−" : "+"}${Math.abs(n)}%`;

function SortableTable({
  initial,
}: {
  initial?: { key: "store" | "sales" | "yoy"; direction: "ascending" | "descending" };
}) {
  const { rows, getSortProps } = useTableSort(salesData, { initial });
  return (
    <Table compact>
      <TableHeader>
        <TableRow>
          <TableHead {...getSortProps("store")}>店舗</TableHead>
          <TableHead className="table__cell--numeric" {...getSortProps("sales")}>
            売上
          </TableHead>
          <TableHead className="table__cell--numeric" {...getSortProps("yoy")}>
            前年比
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.store}>
            <TableCell>{row.store}</TableCell>
            <TableCell className="table__cell--numeric">{yen(row.sales)}</TableCell>
            <TableCell className="table__cell--numeric">{percent(row.yoy)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export const Sortable: Story = {
  render: () => <SortableTable />,
};

/** 「売上」の降順で並べた状態 */
export const SortedBySalesDescending: Story = {
  render: () => <SortableTable initial={{ key: "sales", direction: "descending" }} />,
};
