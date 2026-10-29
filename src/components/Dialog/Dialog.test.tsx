import { act, render } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Dialog, DialogBody } from "@/components/Dialog";
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
