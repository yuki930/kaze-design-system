import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatItem, Stats } from "./Stats";

describe("Stats", () => {
  it("renders children, merges className, forwards ref and rest", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Stats ref={ref} className="extra" data-testid="stats">
        <StatItem value="99.9%" label="稼働率" />
      </Stats>,
    );
    const stats = screen.getByTestId("stats");
    expect(stats).toHaveClass("stats", "extra");
    expect(ref.current).toBe(stats);
    expect(screen.getByText("99.9%")).toHaveClass("stat__value");
  });
});

describe("StatItem", () => {
  it("renders value and label without a description by default", () => {
    const { container } = render(<StatItem value="1,200社" label="導入企業" />);
    expect(screen.getByText("1,200社")).toHaveClass("stat__value");
    expect(screen.getByText("導入企業")).toHaveClass("stat__label");
    expect(container.querySelector(".stat__description")).toBeNull();
  });

  it("renders the description, merges className, forwards ref and rest", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <StatItem
        ref={ref}
        data-testid="stat"
        className="extra"
        value="3倍"
        label="処理速度"
        description="従来比"
      />,
    );
    const stat = screen.getByTestId("stat");
    expect(stat).toHaveClass("stat", "extra");
    expect(ref.current).toBe(stat);
    expect(screen.getByText("従来比")).toHaveClass("stat__description");
  });
});
