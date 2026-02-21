import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders with label text", () => {
    render(<Checkbox label="利用規約に同意する" />);
    expect(screen.getByLabelText("利用規約に同意する")).toBeInTheDocument();
  });

  it("handles onChange", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Checkbox label="選択する" onChange={handleChange} />);

    await user.click(screen.getByLabelText("選択する"));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("generates unique id for label association", () => {
    render(<Checkbox label="ラベル付き" />);
    const checkbox = screen.getByRole("checkbox");
    const id = checkbox.getAttribute("id");
    expect(id).toBeTruthy();

    // The label's htmlFor should match the checkbox id
    const label = checkbox.closest("label");
    expect(label).toHaveAttribute("for", id);
  });

  it("uses provided id prop instead of generated id", () => {
    render(<Checkbox label="カスタムID" id="custom-id" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("id", "custom-id");
  });

  it("forwards checked state", () => {
    render(<Checkbox label="チェック済み" checked onChange={() => {}} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("renders unchecked by default", () => {
    render(<Checkbox label="未チェック" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });
});
