import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo } from "./Logo";

describe("Logo", () => {
  it("renders the decorative mark and the wordmark at md size by default", () => {
    const { container } = render(<Logo />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("logo");
    expect(root.querySelector(".logo__mark")).toHaveClass("logo__mark--md");
    const svg = root.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("width", "22");
    const text = root.querySelector(".logo__text");
    expect(text).toHaveTextContent("kaze風");
    expect(text).not.toHaveClass("logo__text--lg");
    expect(screen.getByText("風")).toHaveClass("logo__kanji");
  });

  it("uses the small mark size", () => {
    const { container } = render(<Logo size="sm" />);
    expect(container.querySelector(".logo__mark")).toHaveClass("logo__mark--sm");
    expect(container.querySelector("svg")).toHaveAttribute("width", "18");
  });

  it("uses the large mark size and large text", () => {
    const { container } = render(<Logo size="lg" />);
    expect(container.querySelector(".logo__mark")).toHaveClass("logo__mark--lg");
    expect(container.querySelector("svg")).toHaveAttribute("height", "32");
    expect(container.querySelector(".logo__text")).toHaveClass("logo__text--lg");
  });

  it("hides the wordmark with showText={false}", () => {
    const { container } = render(<Logo showText={false} />);
    expect(container.querySelector(".logo__text")).toBeNull();
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("forwards ref, merges className and passes rest props", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Logo ref={ref} className="extra" role="img" aria-label="kaze" />);
    const el = screen.getByRole("img", { name: "kaze" });
    expect(ref.current).toBe(el);
    expect(el).toHaveClass("logo", "extra");
  });
});
