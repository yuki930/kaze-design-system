import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { Input } from "./Input";

describe("Input", () => {
  it("renders with placeholder", () => {
    render(<Input placeholder="メールアドレス" />);
    expect(screen.getByPlaceholderText("メールアドレス")).toBeInTheDocument();
  });

  it("handles onChange", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input placeholder="入力" onChange={handleChange} />);

    await user.type(screen.getByPlaceholderText("入力"), "テスト");
    expect(handleChange).toHaveBeenCalled();
  });

  it("applies error class when error prop is true", () => {
    render(<Input error placeholder="エラー入力" />);
    const input = screen.getByPlaceholderText("エラー入力");
    expect(input).toHaveClass("input", "input--error");
  });

  it("sets aria-invalid when error", () => {
    render(<Input error placeholder="エラー入力" />);
    const input = screen.getByPlaceholderText("エラー入力");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("does not set aria-invalid when no error", () => {
    render(<Input placeholder="通常入力" />);
    const input = screen.getByPlaceholderText("通常入力");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="参照" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
