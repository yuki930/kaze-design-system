import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { VisuallyHidden } from "./VisuallyHidden";

describe("VisuallyHidden", () => {
  it("renders a span with sr-only and keeps the text readable", () => {
    render(<VisuallyHidden>検索</VisuallyHidden>);
    const el = screen.getByText("検索");
    expect(el.tagName).toBe("SPAN");
    expect(el).toHaveClass("sr-only");
    expect(el).not.toHaveClass("sr-only--focusable");
  });

  it("adds the focusable modifier", () => {
    render(<VisuallyHidden focusable>本文へ移動</VisuallyHidden>);
    expect(screen.getByText("本文へ移動")).toHaveClass("sr-only", "sr-only--focusable");
  });

  it("lends its class to the child with asChild", () => {
    render(
      <VisuallyHidden asChild focusable>
        <a href="#main">本文へ移動</a>
      </VisuallyHidden>,
    );
    const link = screen.getByRole("link", { name: "本文へ移動" });
    expect(link).toHaveAttribute("href", "#main");
    expect(link).toHaveClass("sr-only", "sr-only--focusable");
  });

  it("forwards ref and className", () => {
    const ref = createRef<HTMLElement>();
    render(
      <VisuallyHidden ref={ref} className="extra">
        x
      </VisuallyHidden>,
    );
    expect(ref.current).toHaveClass("sr-only", "extra");
  });
});
