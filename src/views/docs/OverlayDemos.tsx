"use client";

import { useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  type DrawerSide,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components";
import { useTableSort } from "@/hooks";
import styles from "./docs.module.css";

/** Live previews for the modal components, which cannot be rendered inline on the docs page. */
export function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.preview}>
      <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>下書きを削除しますか</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>削除した下書きは元に戻せません。</p>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            キャンセル
          </Button>
          <Button variant="destructive" onClick={() => setOpen(false)}>
            削除する
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

const sides: { side: DrawerSide; label: string }[] = [
  { side: "right", label: "右から" },
  { side: "left", label: "左から" },
  { side: "bottom", label: "下から" },
];

export function DrawerDemo() {
  const [open, setOpen] = useState(false);
  // Kept after closing so the panel slides out the way it came in
  const [side, setSide] = useState<DrawerSide>("right");
  const close = () => setOpen(false);
  return (
    <div className={styles.preview}>
      {sides.map((s) => (
        <Button
          key={s.side}
          variant="outline"
          onClick={() => {
            setSide(s.side);
            setOpen(true);
          }}
        >
          {s.label}開く
        </Button>
      ))}
      <Drawer open={open} onOpenChange={setOpen} side={side}>
        <DrawerHeader>
          <DrawerTitle>絞り込み</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Checkbox label="未対応のみ" defaultChecked />
            <Checkbox label="自分が担当" />
            <Checkbox label="期限が今週" />
          </div>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="outline" onClick={close}>
            キャンセル
          </Button>
          <Button onClick={close}>適用</Button>
        </DrawerFooter>
      </Drawer>
    </div>
  );
}

const salesRows = [
  { store: "渋谷", sales: 4820000, yoy: 12.4 },
  { store: "梅田", sales: 3915000, yoy: 3.1 },
  { store: "天神", sales: 2140000, yoy: -1.8 },
];

/** 並べ替えは押したときの状態が要るので、ここ（クライアント）に置く。 */
export function SortableTableDemo() {
  const { rows, getSortProps } = useTableSort(salesRows, {
    initial: { key: "sales", direction: "descending" },
  });
  return (
    <Table compact aria-label="店舗別の売上">
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
            <TableCell className="table__cell--numeric">
              ¥{row.sales.toLocaleString("ja-JP")}
            </TableCell>
            <TableCell className="table__cell--numeric">
              {row.yoy < 0 ? "−" : "+"}
              {Math.abs(row.yoy)}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
