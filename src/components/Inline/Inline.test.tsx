import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Inline } from "./Inline";

describe("Inline", () => {
  it("wraps with the sm gap by default", () => {
    render(<Inline data-testid="i">a</Inline>);
    const el = screen.getByTestId("i");
    expect(el).toHaveClass("cluster");
    expect(el).not.toHaveClass("cluster--nowrap");
    expect(el.style.getPropertyValue("--cluster-gap")).toBe("var(--space-2)");
  });
  it("supports nowrap, alignment and justification", () => {
    render(<Inline data-testid="i" wrap={false} align="baseline" justify="between" gap="md" />);
    const el = screen.getByTestId("i");
    expect(el).toHaveClass(
      "cluster--nowrap",
      "cluster--align-baseline",
      "cluster--justify-between",
    );
    expect(el.style.getPropertyValue("--cluster-gap")).toBe("var(--space-4)");
  });
});
