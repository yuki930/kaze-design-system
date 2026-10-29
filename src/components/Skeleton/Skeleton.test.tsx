import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("renders a hidden placeholder", () => {
    render(<Skeleton data-testid="s" />);
    const el = screen.getByTestId("s");
    expect(el).toHaveClass("skeleton");
    expect(el).not.toHaveClass("skeleton--circle");
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("applies width / height (numbers become px, strings pass through)", () => {
    render(<Skeleton data-testid="s" width={120} height="2rem" />);
    const el = screen.getByTestId("s");
    expect(el.style.width).toBe("120px");
    expect(el.style.height).toBe("2rem");
  });

  it("applies the circle modifier", () => {
    render(<Skeleton data-testid="s" circle />);
    expect(screen.getByTestId("s")).toHaveClass("skeleton--circle");
  });

  it("lets style override width / height and merges other styles", () => {
    render(<Skeleton data-testid="s" width={10} style={{ width: "50%", marginTop: "4px" }} />);
    const el = screen.getByTestId("s");
    expect(el.style.width).toBe("50%");
    expect(el.style.marginTop).toBe("4px");
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} data-testid="s" className="extra" />);
    const el = screen.getByTestId("s");
    expect(ref.current).toBe(el);
    expect(el).toHaveClass("skeleton", "extra");
  });
});
