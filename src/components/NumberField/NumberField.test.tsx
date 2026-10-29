import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { NumberField, parseLocaleNumber } from "./NumberField";

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

describe("NumberField API", () => {
  it("reports the parsed number through onValueChange", () => {
    const onValueChange = vi.fn();
    render(<NumberField aria-label="数量" onValueChange={onValueChange} />);
    const input = screen.getByRole("textbox", { name: "数量" });
    typeAndBlur(input, "5");
    typeAndBlur(input, "6");
    expect(onValueChange).toHaveBeenLastCalledWith(6);
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

describe("NumberField formatting", () => {
  it("formats JPY with a yen prefix and no decimals", () => {
    const { container } = render(<NumberField aria-label="金額" currency="JPY" value={1234.6} />);
    expect(screen.getByRole("textbox")).toHaveValue("1,235");
    expect(container.querySelector(".number-field__affix")).toHaveTextContent("¥");
  });

  it("formats USD with two decimals", () => {
    render(<NumberField aria-label="金額" currency="USD" value={1234.5} />);
    expect(screen.getByRole("textbox")).toHaveValue("1,234.50");
  });

  it("formats EUR with the German separators and edits with a comma decimal", () => {
    const onValueChange = vi.fn();
    render(
      <NumberField aria-label="金額" currency="EUR" value={1234.5} onValueChange={onValueChange} />,
    );
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("1.234,50");
    fireEvent.focus(input);
    expect(input).toHaveValue("1234,5");
    fireEvent.change(input, { target: { value: "2.000,25" } });
    fireEvent.blur(input);
    expect(onValueChange).toHaveBeenLastCalledWith(2000.25);
  });

  it("uses the locale prop when no currency is set", () => {
    render(<NumberField aria-label="数量" locale="de-DE" value={9876.5} />);
    expect(screen.getByRole("textbox")).toHaveValue("9.876,5");
  });

  it("shows the raw number without grouping while editing", () => {
    render(<NumberField aria-label="数量" value={1234567} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("1,234,567");
    fireEvent.focus(input);
    expect(input).toHaveValue("1234567");
  });

  it("shows empty text for a null value and while editing it", () => {
    render(<NumberField aria-label="数量" value={null} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
    fireEvent.focus(input);
    expect(input).toHaveValue("");
  });

  it("lets prefix override the currency symbol and renders a suffix", () => {
    const { container } = render(
      <NumberField aria-label="率" currency="JPY" prefix="約" suffix="%" value={5} />,
    );
    const affixes = container.querySelectorAll(".number-field__affix");
    expect(Array.from(affixes).map((a) => a.textContent)).toEqual(["約", "%"]);
  });

  it("commits unparsable text as null", () => {
    const onValueChange = vi.fn();
    render(<NumberField aria-label="数量" value={3} onValueChange={onValueChange} />);
    typeAndBlur(screen.getByRole("textbox"), "abc");
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });
});

describe("NumberField stepping", () => {
  it("increments and decrements with the stepper buttons by step", () => {
    const onValueChange = vi.fn();
    render(
      <NumberField aria-label="数量" defaultValue={10} step={5} onValueChange={onValueChange} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "増加" }));
    expect(onValueChange).toHaveBeenLastCalledWith(15);
    expect(screen.getByRole("textbox")).toHaveValue("15");
    fireEvent.click(screen.getByRole("button", { name: "減少" }));
    fireEvent.click(screen.getByRole("button", { name: "減少" }));
    expect(onValueChange).toHaveBeenLastCalledWith(5);
  });

  it("starts stepping from 0 when empty", () => {
    const onValueChange = vi.fn();
    render(<NumberField aria-label="数量" onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("button", { name: "減少" }));
    expect(onValueChange).toHaveBeenLastCalledWith(-1);
  });

  it("disables the buttons at min and max", () => {
    const { rerender } = render(<NumberField aria-label="数量" value={0} min={0} max={3} />);
    expect(screen.getByRole("button", { name: "減少" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "増加" })).toBeEnabled();
    rerender(<NumberField aria-label="数量" value={3} min={0} max={3} />);
    expect(screen.getByRole("button", { name: "増加" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "減少" })).toBeEnabled();
  });

  it("clamps stepping to min / max", () => {
    const onValueChange = vi.fn();
    render(
      <NumberField aria-label="数量" value={9} max={10} step={5} onValueChange={onValueChange} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "増加" }));
    expect(onValueChange).toHaveBeenLastCalledWith(10);
  });

  it("clamps typed values below min", () => {
    const onValueChange = vi.fn();
    render(<NumberField aria-label="数量" min={1} onValueChange={onValueChange} />);
    typeAndBlur(screen.getByRole("textbox"), "-5");
    expect(onValueChange).toHaveBeenLastCalledWith(1);
  });

  it("steps with ArrowUp / ArrowDown and prevents the caret move", () => {
    const onValueChange = vi.fn();
    render(<NumberField aria-label="数量" value={2} step={2} onValueChange={onValueChange} />);
    const input = screen.getByRole("textbox");
    expect(fireEvent.keyDown(input, { key: "ArrowUp" })).toBe(false);
    expect(onValueChange).toHaveBeenLastCalledWith(4);
    expect(fireEvent.keyDown(input, { key: "ArrowDown" })).toBe(false);
    expect(onValueChange).toHaveBeenLastCalledWith(0);
    expect(fireEvent.keyDown(input, { key: "a" })).toBe(true);
  });

  it("ignores arrow keys while composing", () => {
    const onValueChange = vi.fn();
    render(<NumberField aria-label="数量" value={2} onValueChange={onValueChange} />);
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "ArrowUp", isComposing: true });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("calls a consumer onKeyDown and onFocus", () => {
    const onKeyDown = vi.fn();
    const onFocus = vi.fn();
    render(<NumberField aria-label="数量" onKeyDown={onKeyDown} onFocus={onFocus} />);
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it("does nothing on stepper click when disabled", () => {
    const onValueChange = vi.fn();
    render(<NumberField aria-label="数量" value={1} disabled onValueChange={onValueChange} />);
    const inc = screen.getByRole("button", { name: "増加" });
    const dec = screen.getByRole("button", { name: "減少" });
    expect(inc).toBeDisabled();
    expect(dec).toBeDisabled();
    expect(screen.getByRole("textbox")).toBeDisabled();
    fireEvent.click(inc);
    fireEvent.click(dec);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("keeps the stepper buttons out of the tab order and honors custom labels", () => {
    render(<NumberField aria-label="数量" decrementLabel="1 減らす" incrementLabel="1 増やす" />);
    expect(screen.getByRole("button", { name: "1 減らす" })).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("button", { name: "1 増やす" })).toHaveAttribute("tabindex", "-1");
  });

  it("hides the stepper with showStepper={false}", () => {
    render(<NumberField aria-label="数量" showStepper={false} />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("NumberField structure", () => {
  it("associates the label with the input", () => {
    render(<NumberField label="数量" id="qty" />);
    const input = screen.getByRole("textbox", { name: "数量" });
    expect(input).toHaveAttribute("id", "qty");
    expect(input).toHaveAttribute("inputmode", "decimal");
  });

  it("links the error message and keeps an external aria-describedby", () => {
    const { container } = render(
      <NumberField
        label="数量"
        id="qty"
        error
        errorMessage="1 以上で入力してください"
        aria-describedby="hint"
        className="extra"
      />,
    );
    const input = screen.getByRole("textbox", { name: "数量" });
    expect(input).toHaveAttribute("aria-describedby", "hint qty-error");
    expect(screen.getByRole("alert")).toHaveAttribute("id", "qty-error");
    expect(container.firstChild).toHaveClass("number-field", "number-field--error", "extra");
  });

  it("omits aria-describedby when there is nothing to describe", () => {
    render(<NumberField aria-label="数量" />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-describedby");
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
  });

  it("submits what is being typed before blur", () => {
    const { container } = render(<NumberField aria-label="金額" name="amount" defaultValue={1} />);
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "１，２００" } });
    const hidden = container.querySelector('input[name="amount"]') as HTMLInputElement;
    expect(hidden.value).toBe("1200");
    fireEvent.change(input, { target: { value: "" } });
    expect(hidden.value).toBe("");
  });

  it("disables the hidden input with the field", () => {
    const { container } = render(<NumberField aria-label="金額" name="amount" disabled />);
    expect(container.querySelector('input[name="amount"]')).toBeDisabled();
  });

  it("forwards object and callback refs to the input", () => {
    const objRef = createRef<HTMLInputElement>();
    const { unmount } = render(<NumberField aria-label="数量" ref={objRef} />);
    expect(objRef.current).toBe(screen.getByRole("textbox"));
    unmount();
    const fnRef = vi.fn();
    render(<NumberField aria-label="数量" ref={fnRef} />);
    expect(fnRef).toHaveBeenCalledWith(screen.getByRole("textbox"));
  });

  it("passes rest props to the input", () => {
    render(<NumberField aria-label="数量" placeholder="0" data-testid="nf" />);
    expect(screen.getByTestId("nf")).toHaveAttribute("placeholder", "0");
  });
});
