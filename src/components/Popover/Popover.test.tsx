import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "./Popover";

function setup(props: { defaultOpen?: boolean; onOpenChange?: (open: boolean) => void } = {}) {
  return render(
    <div>
      <Popover {...props}>
        <PopoverTrigger>設定</PopoverTrigger>
        <PopoverContent aria-label="表示設定">
          <button type="button">一つ目</button>
          <PopoverClose>閉じる</PopoverClose>
        </PopoverContent>
      </Popover>
      <button type="button">外のボタン</button>
    </div>,
  );
}

const trigger = () => screen.getByRole("button", { name: "設定" });

describe("Popover trigger", () => {
  it("injects disclosure + dialog attributes", () => {
    setup();
    expect(trigger()).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(trigger()).not.toHaveAttribute("aria-controls");
    expect(trigger()).toHaveAttribute("data-state", "closed");
    expect(trigger()).toHaveAttribute("type", "button");
  });

  it("opens on click and links aria-controls to the dialog", () => {
    setup();
    fireEvent.click(trigger());
    const dialog = screen.getByRole("dialog", { name: "表示設定" });
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(trigger()).toHaveAttribute("aria-controls", dialog.id);
    expect(trigger()).toHaveAttribute("data-state", "open");
    expect(dialog).toHaveAttribute("data-state", "open");
    expect(dialog).not.toHaveAttribute("aria-modal");
  });

  it("toggles closed when the trigger is clicked again", () => {
    setup();
    fireEvent.click(trigger());
    fireEvent.click(trigger());
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders an asChild trigger without a wrapper", () => {
    render(
      <Popover>
        <PopoverTrigger asChild>
          <a href="#x">リンク</a>
        </PopoverTrigger>
        <PopoverContent>本文</PopoverContent>
      </Popover>,
    );
    const link = screen.getByRole("link", { name: "リンク" });
    expect(link).toHaveAttribute("aria-haspopup", "dialog");
    expect(link).not.toHaveAttribute("type");
    expect(document.querySelectorAll("button")).toHaveLength(0);
  });

  it("composes the consumer onClick and respects preventDefault", () => {
    const onClick = vi.fn((e: { preventDefault: () => void }) => e.preventDefault());
    render(
      <Popover>
        <PopoverTrigger onClick={onClick}>設定</PopoverTrigger>
        <PopoverContent>本文</PopoverContent>
      </Popover>,
    );
    fireEvent.click(trigger());
    expect(onClick).toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("Popover content", () => {
  it("moves focus to the first focusable element when opened", () => {
    setup();
    fireEvent.click(trigger());
    expect(screen.getByRole("button", { name: "一つ目" })).toHaveFocus();
  });

  it("focuses the panel itself when it has no focusable children", () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>設定</PopoverTrigger>
        <PopoverContent aria-label="説明">本文だけ</PopoverContent>
      </Popover>,
    );
    expect(screen.getByRole("dialog")).toHaveFocus();
  });

  it("lets onOpenAutoFocus take over the initial focus", () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>設定</PopoverTrigger>
        <PopoverContent
          aria-label="説明"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          <button type="button">一つ目</button>
        </PopoverContent>
      </Popover>,
    );
    expect(screen.getByRole("button", { name: "一つ目" })).not.toHaveFocus();
  });

  it("closes on Escape and returns focus to the trigger", () => {
    setup();
    fireEvent.click(trigger());
    fireEvent.keyDown(screen.getByRole("button", { name: "一つ目" }), { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger()).toHaveFocus();
  });

  it("closes on Escape pressed on the trigger", () => {
    setup();
    fireEvent.click(trigger());
    fireEvent.keyDown(trigger(), { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes on an outside mousedown and returns focus to the trigger", async () => {
    setup();
    fireEvent.click(trigger());
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger()).toHaveFocus();
    await act(async () => new Promise((r) => setTimeout(r, 10)));
    expect(trigger()).toHaveFocus();
  });

  it("does not steal focus when the user moved on to another control", () => {
    setup();
    fireEvent.click(trigger());
    const outside = screen.getByRole("button", { name: "外のボタン" });
    fireEvent.mouseDown(outside);
    act(() => outside.focus());
    expect(outside).toHaveFocus();
  });

  it("stays open on a mousedown inside the panel", () => {
    setup();
    fireEvent.click(trigger());
    fireEvent.mouseDown(screen.getByRole("dialog"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes from PopoverClose and restores focus", () => {
    setup();
    fireEvent.click(trigger());
    fireEvent.click(screen.getByRole("button", { name: "閉じる" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger()).toHaveFocus();
  });

  it("positions the panel with fixed coordinates and reports the side", () => {
    setup({ defaultOpen: true });
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("data-side", "bottom");
    expect(dialog).toHaveAttribute("data-align", "center");
    expect(dialog.style.top).not.toBe("");
  });
});

function Controlled() {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>設定</PopoverTrigger>
      <PopoverContent>本文</PopoverContent>
    </Popover>
  );
}

describe("Popover state", () => {
  it("supports defaultOpen and reports changes in uncontrolled mode", () => {
    const onOpenChange = vi.fn();
    setup({ defaultOpen: true, onOpenChange });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(trigger());
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("is controlled by `open` and only reports requests", () => {
    const onOpenChange = vi.fn();
    render(
      <Popover open={false} onOpenChange={onOpenChange}>
        <PopoverTrigger>設定</PopoverTrigger>
        <PopoverContent>本文</PopoverContent>
      </Popover>,
    );
    fireEvent.click(trigger());
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("works controlled with external state", () => {
    render(<Controlled />);
    fireEvent.click(trigger());
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("throws a clear error when used outside <Popover>", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<PopoverTrigger>x</PopoverTrigger>)).toThrow(/within a <Popover>/);
    spy.mockRestore();
  });
});
