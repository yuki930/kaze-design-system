import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Grid } from "./Grid";

const prop = (el: HTMLElement, name: string) => el.style.getPropertyValue(name);

describe("Grid", () => {
  it("renders a grid with no custom properties by default", () => {
    render(<Grid data-testid="g">子</Grid>);
    const el = screen.getByTestId("g");
    expect(el).toHaveClass("grid");
    expect(el).toHaveTextContent("子");
    for (const name of [
      "--grid-cols",
      "--grid-cols-md",
      "--grid-cols-sm",
      "--grid-gap",
      "--grid-gap-md",
      "--grid-gap-sm",
    ]) {
      expect(prop(el, name)).toBe("");
    }
  });

  it("sets responsive column variables", () => {
    render(<Grid data-testid="g" columns={4} columnsMd={2} columnsSm={1} />);
    const el = screen.getByTestId("g");
    expect(prop(el, "--grid-cols")).toBe("4");
    expect(prop(el, "--grid-cols-md")).toBe("2");
    expect(prop(el, "--grid-cols-sm")).toBe("1");
  });

  it("resolves semantic gap names", () => {
    render(<Grid data-testid="g" gap="xs" gapMd="lg" gapSm="xl" />);
    const el = screen.getByTestId("g");
    expect(prop(el, "--grid-gap")).toBe("0.25rem");
    expect(prop(el, "--grid-gap-md")).toBe("1.5rem");
    expect(prop(el, "--grid-gap-sm")).toBe("2rem");
  });

  it("resolves numeric space tokens and falls back to px for unknown numbers", () => {
    render(<Grid data-testid="g" gap={4} gapMd={0} gapSm={7} />);
    const el = screen.getByTestId("g");
    expect(prop(el, "--grid-gap")).toBe("var(--space-4)");
    expect(prop(el, "--grid-gap-md")).toBe("var(--space-0)");
    expect(prop(el, "--grid-gap-sm")).toBe("7px");
  });

  it("resolves string space tokens and passes other CSS values through", () => {
    render(<Grid data-testid="g" gap="px" gapMd="2.5" gapSm="3vw" />);
    const el = screen.getByTestId("g");
    expect(prop(el, "--grid-gap")).toBe("var(--space-px)");
    expect(prop(el, "--grid-gap-md")).toBe("var(--space-2-5)");
    expect(prop(el, "--grid-gap-sm")).toBe("3vw");
  });

  it("merges user style with the variables, forwards ref, merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Grid ref={ref} data-testid="g" className="extra" style={{ marginTop: "8px" }} columns={3} />,
    );
    const el = screen.getByTestId("g");
    expect(ref.current).toBe(el);
    expect(el).toHaveClass("grid", "extra");
    expect(el.style.marginTop).toBe("8px");
    expect(prop(el, "--grid-cols")).toBe("3");
  });
});
