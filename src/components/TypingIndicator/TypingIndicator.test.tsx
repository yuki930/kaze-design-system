import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TypingIndicator } from "./TypingIndicator";

describe("TypingIndicator", () => {
  it("is a status with the default label and three hidden dots", () => {
    const { container } = render(<TypingIndicator />);
    const el = screen.getByRole("status");
    expect(el).toHaveClass("typing-indicator", "typing-indicator--md");
    expect(el).toHaveTextContent("入力中");
    const dots = container.querySelectorAll(".typing-indicator__dot");
    expect(dots).toHaveLength(3);
    for (const dot of dots) expect(dot).toHaveAttribute("aria-hidden", "true");
  });

  it.each(["sm", "md", "lg"] as const)("applies the %s size", (size) => {
    render(<TypingIndicator size={size} />);
    expect(screen.getByRole("status")).toHaveClass(`typing-indicator--${size}`);
  });

  it("says who is typing through label", () => {
    render(<TypingIndicator label="宮田 千夏さんが入力中" />);
    expect(screen.getByRole("status")).toHaveTextContent("宮田 千夏さんが入力中");
  });

  it("forwards ref and className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<TypingIndicator ref={ref} className="extra" />);
    expect(ref.current).toHaveClass("typing-indicator", "extra");
  });
});
