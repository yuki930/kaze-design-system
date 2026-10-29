import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders a textbox without the error state by default", () => {
    render(<Textarea aria-label="メモ" />);
    const ta = screen.getByRole("textbox", { name: "メモ" });
    expect(ta.tagName).toBe("TEXTAREA");
    expect(ta).toHaveClass("textarea");
    expect(ta).not.toHaveClass("textarea--error");
    expect(ta).not.toHaveAttribute("aria-invalid");
  });

  it("marks the error state with error, overriding aria-invalid=false", () => {
    render(<Textarea error aria-invalid={false} />);
    const ta = screen.getByRole("textbox");
    expect(ta).toHaveClass("textarea--error");
    expect(ta).toHaveAttribute("aria-invalid", "true");
  });

  it.each([true, "true", "grammar", "spelling"] as const)(
    "shows the error state from aria-invalid=%s alone",
    (value) => {
      render(<Textarea aria-invalid={value} />);
      const ta = screen.getByRole("textbox");
      expect(ta).toHaveClass("textarea--error");
      expect(ta).toHaveAttribute("aria-invalid", String(value));
    },
  );

  it("does not show the error state for aria-invalid=false", () => {
    render(<Textarea aria-invalid="false" />);
    expect(screen.getByRole("textbox")).not.toHaveClass("textarea--error");
  });

  it("works uncontrolled and calls onChange", () => {
    const onChange = vi.fn();
    render(<Textarea defaultValue="初期" onChange={onChange} />);
    const ta = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(ta.value).toBe("初期");
    fireEvent.change(ta, { target: { value: "更新" } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(ta.value).toBe("更新");
  });

  it("forwards ref, merges className and passes rest props", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} className="extra" rows={5} placeholder="入力" disabled />);
    const ta = screen.getByPlaceholderText("入力");
    expect(ref.current).toBe(ta);
    expect(ta).toHaveClass("textarea", "extra");
    expect(ta).toHaveAttribute("rows", "5");
    expect(ta).toBeDisabled();
  });
});
