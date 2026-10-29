import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeatureCard, FeatureGrid } from "./FeatureGrid";

describe("FeatureGrid", () => {
  it("uses 3 columns by default without a modifier class", () => {
    render(<FeatureGrid data-testid="grid" />);
    const grid = screen.getByTestId("grid");
    expect(grid).toHaveClass("feature-grid");
    expect(grid.className).not.toMatch(/feature-grid--cols-/);
  });

  it.each([2, 4] as const)("adds a modifier for %i columns", (columns) => {
    render(<FeatureGrid data-testid="grid" columns={columns} />);
    expect(screen.getByTestId("grid")).toHaveClass(`feature-grid--cols-${columns}`);
  });

  it("merges className, forwards ref and renders children", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <FeatureGrid ref={ref} className="extra" aria-label="機能一覧">
        <FeatureCard title="高速" description="すぐ動く" />
      </FeatureGrid>,
    );
    const grid = screen.getByLabelText("機能一覧");
    expect(grid).toHaveClass("feature-grid", "extra");
    expect(ref.current).toBe(grid);
    expect(screen.getByRole("heading", { level: 3, name: "高速" })).toBeInTheDocument();
  });
});

describe("FeatureCard", () => {
  it("renders title as h3 and the description, without an icon by default", () => {
    const { container } = render(<FeatureCard title="安全" description="暗号化して保存" />);
    expect(screen.getByRole("heading", { level: 3, name: "安全" })).toHaveClass(
      "feature-card__title",
    );
    expect(screen.getByText("暗号化して保存")).toHaveClass("feature-card__description");
    expect(container.querySelector(".feature-card__icon")).toBeNull();
  });

  it("renders the icon slot, merges className, forwards ref and rest", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <FeatureCard
        ref={ref}
        data-testid="card"
        className="extra"
        icon={<svg data-testid="icon" />}
        title="t"
        description="d"
      />,
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveClass("feature-card", "extra");
    expect(ref.current).toBe(card);
    expect(screen.getByTestId("icon").parentElement).toHaveClass("feature-card__icon");
  });
});
