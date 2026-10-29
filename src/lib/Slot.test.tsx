import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Slot } from "./Slot";

describe("Slot", () => {
  it("renders the child element with the Slot's props merged in", () => {
    render(
      <Slot className="kz-btn" style={{ color: "red", margin: 0 }} data-size="md">
        <a href="/docs" className="link" style={{ color: "blue" }}>
          Docs
        </a>
      </Slot>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveClass("kz-btn", "link");
    expect(link).toHaveStyle({ color: "rgb(0, 0, 255)", margin: "0px" });
    expect(link).toHaveAttribute("data-size", "md");
  });

  it("runs the child's handler first and the Slot's after it", () => {
    const order: string[] = [];
    render(
      <Slot onClick={() => order.push("slot")}>
        <button type="button" onClick={() => order.push("child")}>
          Go
        </button>
      </Slot>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(order).toEqual(["child", "slot"]);
  });

  it("skips the Slot's handler when the child called preventDefault()", () => {
    const slotHandler = vi.fn();
    render(
      <Slot onClick={slotHandler}>
        <button type="button" onClick={(e) => e.preventDefault()}>
          Go
        </button>
      </Slot>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(slotHandler).not.toHaveBeenCalled();
  });

  it("forwards its ref and keeps the child's ref working", () => {
    const slotRef = createRef<HTMLElement>();
    const childRef = createRef<HTMLAnchorElement>();
    render(
      <Slot ref={slotRef}>
        <a href="/" ref={childRef}>
          Home
        </a>
      </Slot>,
    );
    const link = screen.getByRole("link");
    expect(slotRef.current).toBe(link);
    expect(childRef.current).toBe(link);
  });

  it("lets a prop set on the child win over the Slot's", () => {
    render(
      <Slot title="from slot" tabIndex={-1}>
        <button type="button" title="from child">
          x
        </button>
      </Slot>,
    );
    const el = screen.getByRole("button");
    expect(el).toHaveAttribute("title", "from child");
    expect(el).toHaveAttribute("tabindex", "-1");
  });

  it("rejects anything but a single element child", () => {
    const silence = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <Slot>
          <span>a</span>
          <span>b</span>
        </Slot>,
      ),
    ).toThrow();
    expect(() => render(<Slot>plain text</Slot>)).toThrow();
    silence.mockRestore();
  });
});
