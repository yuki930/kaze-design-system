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
} from "@/components";
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
