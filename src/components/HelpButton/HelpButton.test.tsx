import { createRef } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HelpButton, type HelpButtonPosition } from "./HelpButton";

function rect(x: number, y: number, width: number, height: number): DOMRect {
  return {
    x,
    y,
    left: x,
    top: y,
    width,
    height,
    right: x + width,
    bottom: y + height,
    toJSON: () => ({}),
  } as DOMRect;
}

afterEach(() => vi.restoreAllMocks());

describe("HelpButton", () => {
  it("exposes data-state on the trigger and the popover", () => {
    render(<HelpButton title="ヘルプ">本文</HelpButton>);
    const trigger = screen.getByRole("button", { name: "ヘルプ" });
    expect(trigger).toHaveAttribute("data-state", "closed");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("data-state", "open");
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open");
  });

  it("renders a '?' trigger with the Japanese default label and no popover while closed", () => {
    render(<HelpButton>本文</HelpButton>);
    const trigger = screen.getByRole("button", { name: "ヘルプ" });
    expect(trigger).toHaveTextContent("?");
    expect(trigger).toHaveAttribute("type", "button");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).not.toHaveAttribute("aria-controls");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("wires aria-expanded / aria-controls to the non-modal popover in document.body", () => {
    render(
      <HelpButton title="保存について" size="lg">
        本文
      </HelpButton>,
    );
    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", dialog.id);
    expect(dialog).toHaveAttribute("aria-modal", "false");
    expect(dialog.parentElement).toBe(document.body);
    expect(dialog).toHaveClass("help-popover", "help-popover--lg");
    expect(screen.getByText("保存について")).toHaveClass("help-popover__title");
    expect(screen.getByText("本文")).toHaveClass("help-popover__body");
  });

  it("uses md size by default and omits the title when not given", () => {
    const { baseElement } = render(<HelpButton>本文</HelpButton>);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("dialog")).toHaveClass("help-popover--md");
    expect(baseElement.querySelector(".help-popover__title")).toBeNull();
  });

  it("accepts a custom icon, aria label and className", () => {
    render(
      <HelpButton icon={<span>i</span>} ariaLabel="料金の説明" className="extra">
        本文
      </HelpButton>,
    );
    const trigger = screen.getByRole("button", { name: "料金の説明" });
    expect(trigger).toHaveTextContent("i");
    expect(trigger).not.toHaveTextContent("?");
    expect(trigger).toHaveClass("help-button", "extra");
  });

  it("toggles closed on a second click", () => {
    render(<HelpButton>本文</HelpButton>);
    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);
    fireEvent.click(trigger);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on Escape and returns focus to the trigger", () => {
    render(<HelpButton>本文</HelpButton>);
    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Enter" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes on an outside mousedown but not on one inside the popover or trigger", () => {
    render(
      <>
        <HelpButton>本文</HelpButton>
        <p>外側</p>
      </>,
    );
    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);
    fireEvent.mouseDown(screen.getByText("本文"));
    fireEvent.mouseDown(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByText("外側"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it.each<[HelpButtonPosition, { top: number; left: number }]>([
    // trigger: x=100 y=200 20x20 / popover: 60x40 / gap 8
    ["top", { top: 200 - 40 - 8, left: 100 + 10 - 30 }],
    ["bottom", { top: 220 + 8, left: 100 + 10 - 30 }],
    ["left", { top: 200 + 10 - 20, left: 100 - 60 - 8 }],
    ["right", { top: 200 + 10 - 20, left: 120 + 8 }],
  ])("positions the popover on the %s side", async (position, expected) => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.getAttribute("role") === "dialog" ? rect(0, 0, 60, 40) : rect(100, 200, 20, 20);
    });
    render(<HelpButton position={position}>本文</HelpButton>);
    fireEvent.click(screen.getByRole("button"));
    const dialog = screen.getByRole("dialog");
    await waitFor(() => {
      expect(dialog.style.top).toBe(`${expected.top}px`);
      expect(dialog.style.left).toBe(`${expected.left}px`);
    });
  });

  it("repositions on scroll and resize, and stops listening after closing", async () => {
    let triggerTop = 200;
    const spy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        return this.getAttribute("role") === "dialog"
          ? rect(0, 0, 60, 40)
          : rect(100, triggerTop, 20, 20);
      });
    render(<HelpButton>本文</HelpButton>);
    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog");
    await waitFor(() => expect(dialog.style.top).toBe("228px"));

    triggerTop = 300;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(dialog.style.top).toBe("328px");

    triggerTop = 400;
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });
    expect(dialog.style.top).toBe("428px");

    fireEvent.click(trigger);
    spy.mockClear();
    window.dispatchEvent(new Event("scroll"));
    expect(spy).not.toHaveBeenCalled();
  });

  it("forwards an object ref to the trigger", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<HelpButton ref={ref}>本文</HelpButton>);
    expect(ref.current).toBe(screen.getByRole("button"));
  });

  it("forwards a callback ref to the trigger", () => {
    const ref = vi.fn();
    render(<HelpButton ref={ref}>本文</HelpButton>);
    expect(ref).toHaveBeenCalledWith(screen.getByRole("button"));
  });
});
