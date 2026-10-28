import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SegmentedControl } from "./SegmentedControl";

const options = [
  { value: "1w", label: "1W" },
  { value: "1m", label: "1M", disabled: true },
  { value: "3m", label: "3M" },
  { value: "1y", label: "1Y" },
];

function Parent() {
  const [v, setV] = useState("1w");
  return <SegmentedControl aria-label="期間" options={options} value={v} onValueChange={setV} />;
}

describe("SegmentedControl", () => {
  it("renders radiogroup with radios and aria-checked", () => {
    render(<SegmentedControl aria-label="期間" options={options} defaultValue="3m" />);
    expect(screen.getByRole("radiogroup", { name: "期間" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(4);
    expect(screen.getByRole("radio", { name: "3M" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "1W" })).toHaveAttribute("aria-checked", "false");
  });

  it("uses roving tabindex", () => {
    render(<SegmentedControl aria-label="期間" options={options} defaultValue="3m" />);
    expect(screen.getByRole("radio", { name: "3M" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("radio", { name: "1W" })).toHaveAttribute("tabindex", "-1");
  });

  it("falls back to first enabled option as tab stop when nothing selected", () => {
    render(<SegmentedControl aria-label="期間" options={options} />);
    expect(screen.getByRole("radio", { name: "1W" })).toHaveAttribute("tabindex", "0");
  });

  it("moves and selects with arrow keys, skipping disabled and wrapping", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        aria-label="期間"
        options={options}
        defaultValue="1w"
        onValueChange={onValueChange}
      />,
    );
    screen.getByRole("radio", { name: "1W" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "3M" })).toHaveFocus();
    expect(screen.getByRole("radio", { name: "3M" })).toHaveAttribute("aria-checked", "true");
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "1Y" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "1W" })).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("radio", { name: "1Y" })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(screen.getByRole("radio", { name: "1W" })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("radio", { name: "1Y" })).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith("1y");
  });

  it("does not select disabled option on click", () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        aria-label="期間"
        options={options}
        defaultValue="1w"
        onValueChange={onValueChange}
      />,
    );
    fireEvent.click(screen.getByRole("radio", { name: "1M" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("uncontrolled: updates internal state on click", () => {
    render(<SegmentedControl aria-label="期間" options={options} defaultValue="1w" />);
    fireEvent.click(screen.getByRole("radio", { name: "1Y" }));
    expect(screen.getByRole("radio", { name: "1Y" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "1W" })).toHaveAttribute("aria-checked", "false");
  });

  it("controlled: only changes when parent updates value", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <SegmentedControl
        aria-label="期間"
        options={options}
        value="1w"
        onValueChange={onValueChange}
      />,
    );
    fireEvent.click(screen.getByRole("radio", { name: "1Y" }));
    expect(onValueChange).toHaveBeenCalledWith("1y");
    expect(screen.getByRole("radio", { name: "1W" })).toHaveAttribute("aria-checked", "true");
    rerender(
      <SegmentedControl
        aria-label="期間"
        options={options}
        value="1y"
        onValueChange={onValueChange}
      />,
    );
    expect(screen.getByRole("radio", { name: "1Y" })).toHaveAttribute("aria-checked", "true");
  });

  it("works with a stateful parent", async () => {
    const user = userEvent.setup();
    render(<Parent />);
    screen.getByRole("radio", { name: "1W" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "3M" })).toHaveAttribute("aria-checked", "true");
  });

  it("emits hidden input when name is given", () => {
    const { container } = render(
      <SegmentedControl aria-label="期間" options={options} defaultValue="3m" name="period" />,
    );
    const input = container.querySelector<HTMLInputElement>('input[name="period"]');
    expect(input?.value).toBe("3m");
  });
});
