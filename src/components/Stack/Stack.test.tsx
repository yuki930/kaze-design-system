import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Stack } from "./Stack";

describe("Stack", () => {
  it("stacks children with the md gap by default", () => {
    render(<Stack data-testid="s">a</Stack>);
    const el = screen.getByTestId("s");
    expect(el).toHaveClass("stack");
    expect(el.style.getPropertyValue("--stack-gap")).toBe("var(--space-4)");
  });
  it("accepts semantic and space-token gaps, alignment and element", () => {
    render(
      <Stack data-testid="s" gap="lg" align="center" as="ul">
        <li>a</li>
      </Stack>,
    );
    const el = screen.getByTestId("s");
    expect(el.tagName).toBe("UL");
    expect(el).toHaveClass("stack--align-center");
    expect(el.style.getPropertyValue("--stack-gap")).toBe("var(--space-6)");
  });
});
