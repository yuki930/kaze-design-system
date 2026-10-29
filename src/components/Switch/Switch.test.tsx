import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("renders a native checkbox exposed as a switch, named by its label", () => {
    render(<Switch label="通知" />);
    const sw = screen.getByRole("switch", { name: "通知" });
    expect(sw).toHaveAttribute("type", "checkbox");
    expect(sw).toHaveClass("switch__input");
    expect(sw).not.toBeChecked();
    const label = sw.closest("label") as HTMLElement;
    expect(label).toHaveClass("switch");
    expect(label).toHaveAttribute("for", sw.id);
    expect(sw.id).not.toBe("");
    expect(screen.getByText("通知")).toHaveClass("switch__label");
  });

  it("omits the label text when no label is given", () => {
    const { container } = render(<Switch aria-label="x" />);
    expect(container.querySelector(".switch__label")).toBeNull();
    expect(container.querySelector(".switch__track .switch__thumb")).not.toBeNull();
  });

  it("uses a provided id", () => {
    render(<Switch id="my-switch" label="L" />);
    const sw = screen.getByRole("switch");
    expect(sw).toHaveAttribute("id", "my-switch");
    expect(sw.closest("label")).toHaveAttribute("for", "my-switch");
  });

  it("toggles when uncontrolled (clicking the label)", () => {
    render(<Switch label="切替" defaultChecked={false} />);
    const sw = screen.getByRole("switch");
    fireEvent.click(screen.getByText("切替"));
    expect(sw).toBeChecked();
    fireEvent.click(sw);
    expect(sw).not.toBeChecked();
  });

  it("reflects the controlled checked prop and calls onChange", () => {
    const onChange = vi.fn();
    const { rerender } = render(<Switch label="c" checked={false} onChange={onChange} />);
    const sw = screen.getByRole("switch");
    fireEvent.click(sw);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(sw).not.toBeChecked();
    rerender(<Switch label="c" checked onChange={onChange} />);
    expect(sw).toBeChecked();
  });

  it("forwards ref to the input, merges className on the label and passes rest props", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Switch ref={ref} label="r" className="extra" disabled name="notify" />);
    const sw = screen.getByRole("switch");
    expect(ref.current).toBe(sw);
    expect(sw).toBeDisabled();
    expect(sw).toHaveAttribute("name", "notify");
    expect(sw.closest("label")).toHaveClass("switch", "extra");
  });
});
