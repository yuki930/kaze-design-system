import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Heading } from "./Heading";

describe("Heading", () => {
  it("renders an h2 by default", () => {
    render(<Heading>見出し</Heading>);
    const h = screen.getByRole("heading", { level: 2, name: "見出し" });
    expect(h).toHaveClass("heading", "heading--2");
    expect(h).not.toHaveClass("heading--bordered");
  });

  it.each([1, 3, 6] as const)("renders level %i as the matching tag", (level) => {
    render(<Heading level={level}>L</Heading>);
    const h = screen.getByRole("heading", { level });
    expect(h.tagName).toBe(`H${level}`);
    expect(h).toHaveClass(`heading--${level}`);
  });

  it("decouples the tag (as) from the visual level", () => {
    render(
      <Heading level={1} as="h3">
        見た目は1
      </Heading>,
    );
    const h = screen.getByRole("heading", { level: 3 });
    expect(h).toHaveClass("heading--1");
  });

  it("applies the bordered modifier", () => {
    render(<Heading bordered>B</Heading>);
    expect(screen.getByRole("heading")).toHaveClass("heading--bordered");
  });

  it("renders a description paragraph only when provided", () => {
    const { container, rerender } = render(<Heading>T</Heading>);
    expect(container.querySelector(".heading__description")).toBeNull();
    rerender(<Heading description="補足の説明">T</Heading>);
    const p = screen.getByText("補足の説明");
    expect(p.tagName).toBe("P");
    expect(p).toHaveClass("heading__description");
    expect(p.previousElementSibling).toBe(screen.getByRole("heading"));
  });

  it("forwards ref, merges className and passes rest props", () => {
    const ref = createRef<HTMLHeadingElement>();
    render(
      <Heading ref={ref} className="extra" id="h" data-x="1">
        R
      </Heading>,
    );
    const h = screen.getByRole("heading");
    expect(ref.current).toBe(h);
    expect(h).toHaveClass("heading", "extra");
    expect(h).toHaveAttribute("id", "h");
    expect(h).toHaveAttribute("data-x", "1");
  });
});
