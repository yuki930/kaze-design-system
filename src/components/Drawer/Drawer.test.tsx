import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Dialog, DialogBody } from "../Dialog/Dialog";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  type DrawerProps,
} from "./Drawer";

const settle = () => act(async () => new Promise((r) => setTimeout(r, 300)));
const pressEscape = () =>
  act(async () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  });

const drawer = () => document.querySelector<HTMLElement>('[role="dialog"]');

function Harness({
  onOpenChange,
  ...props
}: { onOpenChange?: (open: boolean) => void } & Partial<DrawerProps>) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" id="opener" onClick={() => setOpen(true)}>
        open
      </button>
      <Drawer
        open={open}
        onOpenChange={(next) => {
          onOpenChange?.(next);
          setOpen(next);
        }}
        {...props}
      >
        <DrawerHeader>
          <DrawerTitle>絞り込み</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <button type="button" id="first">
            first
          </button>
          <button type="button" id="second">
            second
          </button>
        </DrawerBody>
        <DrawerFooter>
          <button type="button" id="last">
            適用
          </button>
        </DrawerFooter>
      </Drawer>
    </div>
  );
}

async function openDrawer(props: Parameters<typeof Harness>[0] = {}) {
  const utils = render(<Harness {...props} />);
  const opener = document.getElementById("opener") as HTMLButtonElement;
  opener.focus();
  await act(async () => {
    opener.click();
  });
  await settle();
  return { ...utils, opener };
}

describe("Drawer semantics", () => {
  it("renders nothing while closed", () => {
    render(
      <Drawer open={false}>
        <DrawerBody>本文</DrawerBody>
      </Drawer>,
    );
    expect(drawer()).toBeNull();
  });

  it("is a modal dialog labelled by its title", async () => {
    await openDrawer();
    const dialog = screen.getByRole("dialog", { name: "絞り込み" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", screen.getByText("絞り込み").id);
  });

  it("lets aria-label replace the title reference", () => {
    render(
      <Drawer open aria-label="メニュー">
        <DrawerBody>本文</DrawerBody>
      </Drawer>,
    );
    const dialog = screen.getByRole("dialog", { name: "メニュー" });
    expect(dialog).not.toHaveAttribute("aria-labelledby");
  });

  it("defaults to the right edge at medium size", async () => {
    await openDrawer();
    expect(drawer()).toHaveClass("drawer", "drawer--right", "drawer--md");
    expect(drawer()).toHaveAttribute("data-side", "right");
  });

  it.each([
    ["left", "lg"],
    ["bottom", "sm"],
  ] as const)("applies side=%s size=%s", async (side, size) => {
    await openDrawer({ side, size });
    expect(drawer()).toHaveClass(`drawer--${side}`, `drawer--${size}`);
    expect(drawer()?.parentElement).toHaveAttribute("data-side", side);
  });

  it("merges className and forwards the ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <Drawer open ref={ref} className="custom">
        <DrawerBody>本文</DrawerBody>
      </Drawer>,
    );
    expect(ref.current).toBe(drawer());
    expect(drawer()).toHaveClass("drawer", "custom");
  });

  it("renders header, body and footer parts", async () => {
    await openDrawer();
    expect(document.querySelector(".drawer__header")).not.toBeNull();
    expect(document.querySelector(".drawer__body")).not.toBeNull();
    expect(document.querySelector(".drawer__footer")).not.toBeNull();
    expect(document.querySelector("h2.drawer__title")).not.toBeNull();
  });
});

describe("Drawer focus and background", () => {
  it("moves focus into the drawer when opened", async () => {
    await openDrawer();
    expect(document.activeElement?.id).toBe("first");
  });

  it("wraps Tab from the last to the first focusable element", async () => {
    await openDrawer();
    const last = document.getElementById("last") as HTMLButtonElement;
    last.focus();
    const ev = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    last.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    expect(document.activeElement?.id).toBe("first");
  });

  it("wraps Shift+Tab from the first to the last focusable element", async () => {
    await openDrawer();
    const first = document.getElementById("first") as HTMLButtonElement;
    first.focus();
    const ev = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    first.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    expect(document.activeElement?.id).toBe("last");
  });

  it("restores focus to the opener after closing", async () => {
    await openDrawer();
    await pressEscape();
    await settle();
    expect(drawer()).toBeNull();
    expect(document.activeElement?.id).toBe("opener");
  });

  it("makes background content inert while open and releases it on close", async () => {
    const { container } = await openDrawer();
    expect(container.hasAttribute("inert")).toBe(true);
    await pressEscape();
    await settle();
    expect(container.hasAttribute("inert")).toBe(false);
  });

  it("locks body scroll while open and releases it on close", async () => {
    await openDrawer();
    expect(document.body.style.overflow).toBe("hidden");
    await pressEscape();
    await settle();
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});

describe("Drawer closing", () => {
  it("calls onOpenChange(false) on Escape and plays the closing animation before unmounting", async () => {
    const onOpenChange = vi.fn();
    await openDrawer({ onOpenChange });
    const panel = drawer() as HTMLElement;
    expect(panel.dataset.state).toBe("open");
    expect((panel.parentElement as HTMLElement).dataset.state).toBe("open");
    await pressEscape();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(panel.dataset.state).toBe("closed");
    expect(panel.parentElement).toHaveClass("overlay--closing");
    await settle();
    expect(drawer()).toBeNull();
  });

  it("closes on a backdrop click but not on a click inside the panel", async () => {
    const onOpenChange = vi.fn();
    await openDrawer({ onOpenChange });
    const panel = drawer() as HTMLElement;
    fireEvent.click(panel);
    fireEvent.click(document.getElementById("first") as HTMLElement);
    expect(onOpenChange).not.toHaveBeenCalled();
    fireEvent.click(panel.parentElement as HTMLElement);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not close itself when `open` is controlled and the caller ignores the request", async () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer open onOpenChange={onOpenChange}>
        <DrawerBody>本文</DrawerBody>
      </Drawer>,
    );
    await settle();
    await pressEscape();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(drawer()).not.toBeNull();
    expect((drawer() as HTMLElement).dataset.state).toBe("open");
  });

  it("closes only the top-most layer on Escape when a Dialog is stacked on it", async () => {
    const onDrawer = vi.fn();
    const onDialog = vi.fn();
    render(
      <>
        <Drawer open onOpenChange={onDrawer}>
          <DrawerBody>本文</DrawerBody>
        </Drawer>
        <Dialog open onOpenChange={onDialog}>
          <DialogBody>確認</DialogBody>
        </Dialog>
      </>,
    );
    await settle();
    await pressEscape();
    expect(onDialog).toHaveBeenCalledTimes(1);
    expect(onDrawer).not.toHaveBeenCalled();
  });

  it("does not run Escape handling while closed", async () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer open={false} onOpenChange={onOpenChange}>
        <DrawerBody>本文</DrawerBody>
      </Drawer>,
    );
    await pressEscape();
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
