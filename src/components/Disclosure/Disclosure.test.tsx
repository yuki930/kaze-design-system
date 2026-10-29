import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Disclosure } from "./Disclosure";

describe("Disclosure", () => {
  it("exposes data-state on the trigger and the content", () => {
    render(<Disclosure title="詳細">本文</Disclosure>);
    const trigger = screen.getByRole("button", { name: "詳細" });
    const content = document.querySelector(".disclosure__content");
    expect(trigger).toHaveAttribute("data-state", "closed");
    expect(content).toHaveAttribute("data-state", "closed");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("data-state", "open");
    expect(content).toHaveAttribute("data-state", "open");
  });
});

describe("Disclosure behaviour", () => {
  it("links the trigger and content region and hides content while closed", () => {
    render(<Disclosure title="詳細">本文</Disclosure>);
    const trigger = screen.getByRole("button", { name: "詳細" });
    expect(trigger).toHaveAttribute("type", "button");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    const content = document.getElementById(trigger.getAttribute("aria-controls") ?? "");
    expect(content).not.toBeNull();
    expect(content).toHaveAttribute("aria-labelledby", trigger.id);
    expect(content).not.toBeVisible();
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: "詳細" })).toHaveTextContent("本文");
  });

  it("applies default size / variant classes and the open modifier", () => {
    const { container } = render(
      <Disclosure title="t" defaultOpen>
        c
      </Disclosure>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass(
      "disclosure",
      "disclosure--md",
      "disclosure--default",
      "disclosure--open",
    );
    expect(root).toHaveAttribute("data-state", "open");
    expect(screen.getByRole("region")).toBeVisible();
  });

  it("applies size, variant and the extra class names", () => {
    const { container } = render(
      <Disclosure
        title="t"
        size="sm"
        variant="bordered"
        className="root-x"
        triggerClassName="trigger-x"
        contentClassName="content-x"
      >
        c
      </Disclosure>,
    );
    expect(container.firstElementChild).toHaveClass(
      "disclosure--sm",
      "disclosure--bordered",
      "root-x",
    );
    expect(screen.getByRole("button")).toHaveClass("disclosure__trigger", "trigger-x");
    expect(container.querySelector(".disclosure__content")).toHaveClass("content-x");
  });

  it("closes on Escape while open and ignores other keys", () => {
    const onOpenChange = vi.fn();
    render(
      <Disclosure title="t" defaultOpen onOpenChange={onOpenChange}>
        c
      </Disclosure>,
    );
    const trigger = screen.getByRole("button");
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(onOpenChange).not.toHaveBeenCalled();
    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(onOpenChange).toHaveBeenCalledWith(false);
    onOpenChange.mockClear();
    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("does not toggle when disabled", () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Disclosure title="t" disabled onOpenChange={onOpenChange}>
        c
      </Disclosure>,
    );
    const trigger = screen.getByRole("button");
    expect(trigger).toBeDisabled();
    expect(container.firstElementChild).toHaveClass("disclosure--disabled");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("is controlled by open and only reports changes through onOpenChange", () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Disclosure title="t" open={false} onOpenChange={onOpenChange}>
        c
      </Disclosure>,
    );
    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    rerender(
      <Disclosure title="t" open onOpenChange={onOpenChange}>
        c
      </Disclosure>,
    );
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(trigger);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("renders the chevron marker on the left by default and rotates it", () => {
    const { container } = render(<Disclosure title="t">c</Disclosure>);
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveClass("disclosure__trigger--icon-left");
    const icon = container.querySelector(".disclosure__icon") as HTMLElement;
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveClass("disclosure__icon--rotate");
    expect(icon).not.toHaveClass("disclosure__icon--end");
    expect(icon.querySelectorAll("path")).toHaveLength(1);
    expect(trigger.firstElementChild).toBe(icon);
  });

  it("renders the plus marker on the right", () => {
    const { container } = render(
      <Disclosure title="t" icon="plus" iconPosition="right">
        c
      </Disclosure>,
    );
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveClass("disclosure__trigger--icon-right");
    const icon = container.querySelector(".disclosure__icon") as HTMLElement;
    expect(icon).toHaveClass("disclosure__icon--end", "disclosure__icon--rotate");
    expect(icon.querySelectorAll("path")).toHaveLength(2);
    expect(trigger.lastElementChild).toBe(icon);
  });

  it("renders a custom marker without auto-rotation", () => {
    const { container } = render(
      <Disclosure title="t" icon={<span data-testid="marker">*</span>}>
        c
      </Disclosure>,
    );
    expect(screen.getByTestId("marker")).toBeInTheDocument();
    expect(container.querySelector(".disclosure__icon")).not.toHaveClass(
      "disclosure__icon--rotate",
    );
  });

  it("falls back to the chevron when icon is null", () => {
    const { container } = render(
      <Disclosure title="t" icon={null}>
        c
      </Disclosure>,
    );
    expect(container.querySelector(".disclosure__icon-svg")).not.toBeNull();
  });

  it("forwards ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Disclosure ref={ref} title="t">
        c
      </Disclosure>,
    );
    expect(ref.current).toBe(container.firstElementChild);
  });
});
