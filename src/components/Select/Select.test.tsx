import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Select } from "./Select";

const options = (
  <>
    <option value="a">A</option>
    <option value="b">B</option>
  </>
);

describe("Select", () => {
  it("renders a combobox with options and no error state by default", () => {
    render(<Select aria-label="選択">{options}</Select>);
    const select = screen.getByRole("combobox", { name: "選択" });
    expect(select).toHaveClass("select");
    expect(select).not.toHaveClass("select--error");
    expect(select).not.toHaveAttribute("aria-invalid");
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  it("marks the error state with error", () => {
    render(<Select error>{options}</Select>);
    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("select--error");
    expect(select).toHaveAttribute("aria-invalid", "true");
  });

  it("error overrides an explicit aria-invalid=false", () => {
    render(
      <Select error aria-invalid={false}>
        {options}
      </Select>,
    );
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-invalid", "true");
  });

  it.each([true, "true", "grammar", "spelling"] as const)(
    "shows the error state from aria-invalid=%s alone",
    (value) => {
      render(<Select aria-invalid={value}>{options}</Select>);
      const select = screen.getByRole("combobox");
      expect(select).toHaveClass("select--error");
      expect(select).toHaveAttribute("aria-invalid", String(value));
    },
  );

  it("does not show the error state for aria-invalid=false", () => {
    render(<Select aria-invalid="false">{options}</Select>);
    const select = screen.getByRole("combobox");
    expect(select).not.toHaveClass("select--error");
    expect(select).toHaveAttribute("aria-invalid", "false");
  });

  it("supports controlled value and onChange", () => {
    const onChange = vi.fn();
    render(
      <Select value="a" onChange={onChange}>
        {options}
      </Select>,
    );
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("a");
    fireEvent.change(select, { target: { value: "b" } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("forwards ref, merges className and passes rest props", () => {
    const ref = createRef<HTMLSelectElement>();
    render(
      <Select ref={ref} className="extra" name="pref" disabled>
        {options}
      </Select>,
    );
    const select = screen.getByRole("combobox");
    expect(ref.current).toBe(select);
    expect(select).toHaveClass("select", "extra");
    expect(select).toHaveAttribute("name", "pref");
    expect(select).toBeDisabled();
  });
});
