import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NumberField, parseLocaleNumber } from "./NumberField";
import { resetDeprecationWarnings } from "@/lib/deprecate";

function typeAndBlur(input: HTMLElement, text: string) {
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: text } });
  fireEvent.blur(input);
}

describe("parseLocaleNumber", () => {
  it("parses fullwidth digits", () => {
    expect(parseLocaleNumber("１２３")).toBe(123);
  });
  it("parses fullwidth minus and comma", () => {
    expect(parseLocaleNumber("－１，０００")).toBe(-1000);
  });
  it("returns null for empty or non-numeric input", () => {
    expect(parseLocaleNumber("")).toBeNull();
    expect(parseLocaleNumber("  ")).toBeNull();
    expect(parseLocaleNumber("abc")).toBeNull();
    expect(parseLocaleNumber("-")).toBeNull();
  });
  it("respects locale group and decimal symbols", () => {
    expect(parseLocaleNumber("1.234,5", "de-DE")).toBe(1234.5);
    expect(parseLocaleNumber("1,234.5", "en-US")).toBe(1234.5);
  });
});

describe("NumberField", () => {
  it("commits fullwidth input as an ASCII number", () => {
    const onChange = vi.fn();
    render(<NumberField aria-label="数量" onValueChange={onChange} />);
    typeAndBlur(screen.getByRole("textbox"), "１２３");
    expect(onChange).toHaveBeenLastCalledWith(123);
  });

  it("commits empty input as null, not 0", () => {
    const onChange = vi.fn();
    render(<NumberField aria-label="数量" value={5} onValueChange={onChange} />);
    typeAndBlur(screen.getByRole("textbox"), "");
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it("does not commit on Enter during IME composition", () => {
    const onChange = vi.fn();
    render(<NumberField aria-label="数量" onValueChange={onChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "１２" } });
    fireEvent.keyDown(input, { key: "Enter", isComposing: true });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("commits on Enter outside composition", () => {
    const onChange = vi.fn();
    render(<NumberField aria-label="数量" onValueChange={onChange} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    input.focus();
    fireEvent.change(input, { target: { value: "42" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenLastCalledWith(42);
  });

  it("still commits when the consumer passes onBlur, and calls it", () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();
    render(<NumberField aria-label="数量" onValueChange={onChange} onBlur={onBlur} />);
    typeAndBlur(screen.getByRole("textbox"), "7");
    expect(onBlur).toHaveBeenCalled();
    expect(onChange).toHaveBeenLastCalledWith(7);
  });

  it("supports defaultValue (uncontrolled)", () => {
    render(<NumberField aria-label="数量" defaultValue={1500} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("1,500");
    typeAndBlur(input, "２０００");
    expect(input.value).toBe("2,000");
  });

  it("submits the raw number through a hidden input when name is set", () => {
    const { container } = render(<NumberField aria-label="金額" name="amount" value={12345} />);
    const hidden = container.querySelector(
      'input[type="hidden"][name="amount"]',
    ) as HTMLInputElement;
    expect(hidden.value).toBe("12345");
    expect(screen.getByRole("textbox")).not.toHaveAttribute("name");
  });

  it("clamps to min / max", () => {
    const onChange = vi.fn();
    render(<NumberField aria-label="数量" min={0} max={10} onValueChange={onChange} />);
    typeAndBlur(screen.getByRole("textbox"), "99");
    expect(onChange).toHaveBeenLastCalledWith(10);
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

describe("NumberField API", () => {
  it("keeps the deprecated onChange working and warns once", () => {
    const onChange = vi.fn();
    render(<NumberField aria-label="数量" onChange={onChange} />);
    const input = screen.getByRole("textbox", { name: "数量" });
    typeAndBlur(input, "5");
    typeAndBlur(input, "6");
    expect(onChange).toHaveBeenLastCalledWith(6);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("prefers onValueChange over onChange", () => {
    const onChange = vi.fn();
    const onValueChange = vi.fn();
    render(<NumberField aria-label="数量" onChange={onChange} onValueChange={onValueChange} />);
    typeAndBlur(screen.getByRole("textbox", { name: "数量" }), "9");
    expect(onValueChange).toHaveBeenLastCalledWith(9);
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("NumberField inside FormField", () => {
  it("keeps the aria-invalid that FormField injects for an error", async () => {
    const { FormField } = await import("../FormField");
    render(
      <FormField label="数量" error="1 以上で入力してください">
        <NumberField aria-label="数量" />
      </FormField>,
    );
    expect(screen.getByRole("textbox", { name: "数量" })).toHaveAttribute("aria-invalid", "true");
  });

  it("still marks the field invalid from its own error prop", () => {
    render(<NumberField aria-label="金額" error />);
    expect(screen.getByRole("textbox", { name: "金額" })).toHaveAttribute("aria-invalid", "true");
  });
});
