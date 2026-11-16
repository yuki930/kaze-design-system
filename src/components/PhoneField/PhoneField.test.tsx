import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { FormField } from "../FormField";
import { PhoneField, formatPhoneNumber, normalizePhoneNumber } from "./PhoneField";

function Controlled() {
  const [value, setValue] = useState("");
  return (
    <>
      <PhoneField aria-label="電話番号" value={value} onValueChange={setValue} />
      <button type="button" onClick={() => setValue("0120123456")}>
        入れる
      </button>
      <output>{value}</output>
    </>
  );
}

describe("normalizePhoneNumber", () => {
  it.each([
    ["090-1234-5678", "09012345678"],
    ["09012345678", "09012345678"],
    ["０９０ー１２３４ー５６７８", "09012345678"],
    ["090−1234−5678", "09012345678"],
    ["(03) 1234 5678", "0312345678"],
    ["（０３）１２３４－５６７８", "0312345678"],
    ["+81 90-1234-5678", "09012345678"],
    ["+81 (0)90 1234 5678", "09012345678"],
    ["", ""],
  ])("%s → %s", (input, expected) => {
    expect(normalizePhoneNumber(input)).toBe(expected);
  });
});

describe("formatPhoneNumber", () => {
  it.each([
    ["09012345678", "090-1234-5678"],
    ["05012345678", "050-1234-5678"],
    ["02012345678", "020-1234-5678"],
    ["0120123456", "0120-123-456"],
    ["0570123456", "0570-123-456"],
    ["08001234567", "0800-123-4567"],
    ["0312345678", "03-1234-5678"],
    ["0612345678", "06-1234-5678"],
    ["０９０１２３４５６７８", "090-1234-5678"],
  ])("adds hyphens where the split is fixed: %s → %s", (input, expected) => {
    expect(formatPhoneNumber(input)).toBe(expected);
  });

  it.each([
    // Area codes of 3 to 5 digits cannot be told apart without a table: keep what was typed
    ["0451234567", "0451234567"],
    ["045-123-4567", "045-123-4567"],
    ["0267 12 3456", "0267-12-3456"],
    ["（０４５）１２３－４５６７", "045-123-4567"],
    ["+81 45 123 4567", "045-123-4567"],
    ["+81 (0)45-123-4567", "045-123-4567"],
  ])("keeps the typed split elsewhere: %s → %s", (input, expected) => {
    expect(formatPhoneNumber(input)).toBe(expected);
  });

  it("leaves text with letters as typed", () => {
    expect(formatPhoneNumber("090-1234-5678 内線 12")).toBe("090-1234-5678 内線 12");
  });
});

describe("PhoneField", () => {
  it("reports digits while typing and formats on blur, not before", () => {
    const onValueChange = vi.fn();
    render(<PhoneField aria-label="電話番号" onValueChange={onValueChange} />);
    const input = screen.getByLabelText("電話番号") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "０９０１２３４５６７８" } });
    expect(onValueChange).toHaveBeenLastCalledWith("09012345678");
    expect(input.value).toBe("０９０１２３４５６７８");
    fireEvent.blur(input);
    expect(input.value).toBe("090-1234-5678");
  });

  it("does not report again when only the separators change", () => {
    const onValueChange = vi.fn();
    render(
      <PhoneField aria-label="電話番号" defaultValue="09012345678" onValueChange={onValueChange} />,
    );
    const input = screen.getByLabelText("電話番号") as HTMLInputElement;
    expect(input.value).toBe("090-1234-5678");
    fireEvent.change(input, { target: { value: "09012345678" } });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("submits digits through a hidden input and gives the visible field no name", () => {
    const { container } = render(
      <form>
        <PhoneField aria-label="電話番号" name="tel" defaultValue="0312345678" />
      </form>,
    );
    const form = container.querySelector("form") as HTMLFormElement;
    expect(new FormData(form).get("tel")).toBe("0312345678");
    expect(screen.getByLabelText("電話番号")).not.toHaveAttribute("name");
  });

  it("follows a controlled value set from outside", () => {
    render(<Controlled />);
    const input = screen.getByLabelText("電話番号") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "090-1234" } });
    expect(input.value).toBe("090-1234");
    expect(screen.getByRole("status")).toHaveTextContent("0901234");
    fireEvent.click(screen.getByRole("button"));
    expect(input.value).toBe("0120-123-456");
  });

  it("sets tel input modes and works inside FormField", () => {
    render(
      <FormField label="電話番号" error="電話番号を入力してください" required>
        <PhoneField />
      </FormField>,
    );
    const input = screen.getByLabelText(/電話番号/);
    expect(input).toHaveAttribute("type", "tel");
    expect(input).toHaveAttribute("inputmode", "tel");
    expect(input).toHaveAttribute("autocomplete", "tel-national");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toBeRequired();
    expect(input).toHaveClass("input--error");
  });

  it("runs the consumer's onChange and onBlur", () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();
    render(<PhoneField aria-label="電話番号" onChange={onChange} onBlur={onBlur} error />);
    const input = screen.getByLabelText("電話番号");
    fireEvent.change(input, { target: { value: "03" } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalled();
    expect(input).toHaveClass("input--error");
  });
});
