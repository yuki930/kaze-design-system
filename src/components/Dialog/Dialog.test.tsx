import { act, fireEvent, render, screen } from "@testing-library/react";
import { createRef, useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Dialog, DialogBody, DialogFooter, DialogHeader, DialogTitle } from "@/components/Dialog";
import { resetDeprecationWarnings } from "@/lib/deprecate";

const settle = () => act(async () => new Promise((r) => setTimeout(r, 300)));

function Harness({ onClose }: { onClose?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" id="opener" onClick={() => setOpen(true)}>
        open
      </button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          onClose?.();
          setOpen(next);
        }}
      >
        <DialogBody>
          <button type="button" id="first">
            first
          </button>
          <button type="button" id="second">
            second
          </button>
        </DialogBody>
      </Dialog>
    </div>
  );
}

async function openDialog() {
  const utils = render(<Harness />);
  const opener = document.getElementById("opener") as HTMLButtonElement;
  opener.focus();
  await act(async () => {
    opener.click();
  });
  await settle();
  return { ...utils, opener };
}

describe("Dialog focus management", () => {
  it("moves focus into the dialog when opened", async () => {
    await openDialog();
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    expect(document.activeElement?.id).toBe("first");
  });

  it("wraps Tab from the last to the first element", async () => {
    await openDialog();
    const second = document.getElementById("second") as HTMLButtonElement;
    second.focus();
    const ev = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    second.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    expect(document.activeElement?.id).toBe("first");
  });

  it("closes on Escape even when focus is outside, and restores focus to the opener", async () => {
    const onClose = vi.fn();
    const { getByText } = render(<Harness onClose={onClose} />);
    const opener = document.getElementById("opener") as HTMLButtonElement;
    opener.focus();
    await act(async () => {
      getByText("open").click();
    });
    await settle();
    (document.activeElement as HTMLElement).blur();
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    await settle();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement?.id).toBe("opener");
  });

  it("makes background content inert while open and releases it on close", async () => {
    const { container } = await openDialog();
    expect(container.hasAttribute("inert")).toBe(true);
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    await settle();
    expect(container.hasAttribute("inert")).toBe(false);
  });
});

let warn: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  resetDeprecationWarnings();
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  warn.mockRestore();
});

function Controlled({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const [open, setOpen] = useState(true);
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        setOpen(next);
      }}
    >
      <DialogBody>本文</DialogBody>
    </Dialog>
  );
}

describe("Dialog API", () => {
  it("calls onOpenChange(false) on Escape and flips data-state", async () => {
    const onOpenChange = vi.fn();
    render(<Controlled onOpenChange={onOpenChange} />);
    await settle();
    const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog.dataset.state).toBe("open");
    expect((dialog.parentElement as HTMLElement).dataset.state).toBe("open");
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(dialog.dataset.state).toBe("closed");
    await settle();
    expect(warn).not.toHaveBeenCalled();
  });

  it("still calls the deprecated onClose and warns once", async () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose}>
        <DialogBody>本文</DialogBody>
      </Dialog>,
    );
    await settle();
    for (let i = 0; i < 2; i++) {
      await act(async () => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      });
    }
    expect(onClose).toHaveBeenCalledTimes(2);
    expect(warn).toHaveBeenCalledTimes(1);
  });
});

const pressEscape = () =>
  act(async () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  });

describe("Dialog rendering", () => {
  it("renders nothing while closed", () => {
    render(
      <Dialog open={false}>
        <DialogBody>本文</DialogBody>
      </Dialog>,
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("portals into body and is labelled by DialogTitle", async () => {
    const { container } = render(
      <Dialog open className="custom" data-testid="dlg">
        <DialogHeader className="h">
          <DialogTitle>削除の確認</DialogTitle>
        </DialogHeader>
        <DialogBody>本文</DialogBody>
        <DialogFooter className="f">操作</DialogFooter>
      </Dialog>,
    );
    await settle();
    const dialog = screen.getByRole("dialog", { name: "削除の確認" });
    expect(container.contains(dialog)).toBe(false);
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("tabindex", "-1");
    expect(dialog).toHaveClass("dialog", "custom");
    expect(dialog).toHaveAttribute("data-testid", "dlg");
    expect(dialog.parentElement).toHaveClass("overlay");
    expect(screen.getByText("削除の確認").tagName).toBe("H2");
    expect(screen.getByText("削除の確認")).toHaveClass("dialog__title");
    expect(screen.getByText("本文")).toHaveClass("dialog__body");
    expect(screen.getByText("操作")).toHaveClass("dialog__footer", "f");
    expect(dialog.querySelector(".dialog__header")).toHaveClass("h");
  });

  it("lets DialogTitle override its id", async () => {
    render(
      <Dialog open>
        <DialogTitle id="own">タイトル</DialogTitle>
      </Dialog>,
    );
    await settle();
    expect(screen.getByText("タイトル")).toHaveAttribute("id", "own");
  });

  it("renders DialogTitle outside a Dialog without an id", () => {
    render(<DialogTitle>単独</DialogTitle>);
    expect(screen.getByText("単独")).not.toHaveAttribute("id");
  });

  it("forwards object and callback refs", async () => {
    const objRef = createRef<HTMLDivElement>();
    const { unmount } = render(
      <Dialog open ref={objRef}>
        本文
      </Dialog>,
    );
    await settle();
    expect(objRef.current).toBe(screen.getByRole("dialog"));
    unmount();

    const fnRef = vi.fn();
    render(
      <Dialog open ref={fnRef}>
        本文
      </Dialog>,
    );
    await settle();
    expect(fnRef).toHaveBeenCalledWith(screen.getByRole("dialog"));
  });

  it("forwards refs on the sub components", () => {
    const h = createRef<HTMLDivElement>();
    const t = createRef<HTMLHeadingElement>();
    const b = createRef<HTMLDivElement>();
    const f = createRef<HTMLDivElement>();
    render(
      <>
        <DialogHeader ref={h} />
        <DialogTitle ref={t} />
        <DialogBody ref={b} />
        <DialogFooter ref={f} />
      </>,
    );
    expect(h.current).toHaveClass("dialog__header");
    expect(t.current).toHaveClass("dialog__title");
    expect(b.current).toHaveClass("dialog__body");
    expect(f.current).toHaveClass("dialog__footer");
  });
});

function Nested({
  outer,
  inner,
}: {
  outer: (open: boolean) => void;
  inner: (open: boolean) => void;
}) {
  const [outerOpen, setOuterOpen] = useState(true);
  const [innerOpen, setInnerOpen] = useState(false);
  return (
    <Dialog
      open={outerOpen}
      aria-label="外側"
      onOpenChange={(o) => {
        outer(o);
        setOuterOpen(o);
      }}
    >
      <button type="button" onClick={() => setInnerOpen(true)}>
        開く
      </button>
      <Dialog
        open={innerOpen}
        aria-label="内側"
        onOpenChange={(o) => {
          inner(o);
          setInnerOpen(o);
        }}
      >
        <button type="button">内側のボタン</button>
      </Dialog>
    </Dialog>
  );
}

describe("Dialog closing", () => {
  it("closes on overlay click but not on a click inside the panel", async () => {
    const onOpenChange = vi.fn();
    render(<Controlled onOpenChange={onOpenChange} />);
    await settle();
    fireEvent.click(screen.getByText("本文"));
    expect(onOpenChange).not.toHaveBeenCalled();
    const overlay = screen.getByRole("dialog").parentElement as HTMLElement;
    await act(async () => {
      fireEvent.click(overlay);
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("plays the closing animation before unmounting", async () => {
    const { rerender } = render(
      <Dialog open>
        <DialogBody>本文</DialogBody>
      </Dialog>,
    );
    await settle();
    rerender(
      <Dialog open={false}>
        <DialogBody>本文</DialogBody>
      </Dialog>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("data-state", "closed");
    expect(dialog.parentElement).toHaveClass("overlay--closing");
    await settle();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("reopening during the closing animation keeps it mounted", async () => {
    const { rerender } = render(<Dialog open>本文</Dialog>);
    await settle();
    rerender(<Dialog open={false}>本文</Dialog>);
    rerender(<Dialog open>本文</Dialog>);
    await settle();
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("data-state", "open");
    expect(dialog.parentElement).not.toHaveClass("overlay--closing");
  });

  it("closes only the top-most of nested dialogs on Escape", async () => {
    const outer = vi.fn();
    const inner = vi.fn();
    render(<Nested outer={outer} inner={inner} />);
    await settle();
    await act(async () => {
      fireEvent.click(screen.getByText("開く"));
    });
    await settle();
    expect(screen.getAllByRole("dialog", { hidden: true })).toHaveLength(2);

    await pressEscape();
    expect(inner).toHaveBeenCalledWith(false);
    expect(outer).not.toHaveBeenCalled();
    await settle();

    await pressEscape();
    expect(outer).toHaveBeenCalledWith(false);
  });

  it("calls both onOpenChange and the deprecated onClose when given together", async () => {
    const onOpenChange = vi.fn();
    const onClose = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange} onClose={onClose}>
        本文
      </Dialog>,
    );
    await settle();
    await pressEscape();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("does not throw when closed without any handler", async () => {
    render(<Dialog open>本文</Dialog>);
    await settle();
    await pressEscape();
    // still open: the caller owns `open`
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open");
  });
});
