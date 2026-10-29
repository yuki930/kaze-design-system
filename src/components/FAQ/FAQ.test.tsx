import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { FAQ, FAQItem } from "./FAQ";

describe("FAQItem", () => {
  it("wraps the question in an h3 by default and allows other levels", () => {
    const { rerender } = render(<FAQItem question="無料ですか？" answer="はい" />);
    expect(screen.getByRole("heading", { level: 3, name: "無料ですか？" })).toBeInTheDocument();
    rerender(<FAQItem question="無料ですか？" answer="はい" headingLevel={2} />);
    expect(screen.getByRole("heading", { level: 2, name: "無料ですか？" })).toBeInTheDocument();
  });

  it("links the trigger to the answer panel with aria-controls", () => {
    render(<FAQItem question="無料ですか？" answer="はい" />);
    const trigger = screen.getByRole("button", { name: "無料ですか？" });
    const panelId = trigger.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();
    const panel = document.getElementById(panelId ?? "");
    expect(panel).toHaveClass("faq__answer");
    expect(panel).toHaveTextContent("はい");
  });

  it("is collapsed, inert and aria-hidden until clicked", () => {
    render(<FAQItem question="無料ですか？" answer="はい" />);
    const trigger = screen.getByRole("button", { name: "無料ですか？" });
    const panel = document.getElementById(trigger.getAttribute("aria-controls") ?? "");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(panel).toHaveAttribute("inert");
    expect(panel).toHaveAttribute("aria-hidden", "true");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(panel).not.toHaveAttribute("inert");
    expect(panel).toHaveAttribute("aria-hidden", "false");
    expect(panel?.parentElement).toHaveClass("faq__item--open");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(panel).toHaveAttribute("inert");
  });

  it("renders children when answer is omitted", () => {
    render(
      <FAQ>
        <FAQItem question="Q">
          <strong>太字の回答</strong>
        </FAQItem>
      </FAQ>,
    );
    expect(screen.getByText("太字の回答").tagName).toBe("STRONG");
  });
});
