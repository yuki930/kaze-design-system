import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Text } from "./Text";

describe("Text", () => {
  it("renders a paragraph with only the base class by default", () => {
    render(<Text>本文</Text>);
    const el = screen.getByText("本文");
    expect(el.tagName).toBe("P");
    expect(el.className).toBe("text");
  });

  it.each(["lead", "caption", "overline"] as const)("applies variant %s", (variant) => {
    render(<Text variant={variant}>v</Text>);
    expect(screen.getByText("v")).toHaveClass("text", `text--${variant}`);
  });

  it("does not add a modifier for the body variant or default color", () => {
    render(
      <Text variant="body" color="default">
        b
      </Text>,
    );
    expect(screen.getByText("b").className).toBe("text");
  });

  it("applies size, weight, color and align modifiers", () => {
    render(
      <Text size="lg" weight="bold" color="muted" align="center">
        m
      </Text>,
    );
    expect(screen.getByText("m")).toHaveClass(
      "text--lg",
      "text--bold",
      "text--muted",
      "text--center",
    );
  });

  it.each(["span", "label", "strong"] as const)("renders as <%s>", (as) => {
    render(<Text as={as}>a</Text>);
    expect(screen.getByText("a").tagName).toBe(as.toUpperCase());
  });

  it("forwards ref, merges className and passes rest props", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Text ref={ref} as="span" className="extra" id="t" data-x="1">
        r
      </Text>,
    );
    const el = screen.getByText("r");
    expect(ref.current).toBe(el);
    expect(el).toHaveClass("text", "extra");
    expect(el).toHaveAttribute("id", "t");
    expect(el).toHaveAttribute("data-x", "1");
  });
});
