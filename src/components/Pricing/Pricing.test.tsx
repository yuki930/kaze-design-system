import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PricingCard, PricingGrid } from "./Pricing";

describe("PricingGrid", () => {
  it("renders children, merges className, forwards ref and rest", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <PricingGrid ref={ref} className="extra" data-testid="grid">
        <span>子</span>
      </PricingGrid>,
    );
    const grid = screen.getByTestId("grid");
    expect(grid).toHaveClass("pricing-grid", "extra");
    expect(ref.current).toBe(grid);
    expect(screen.getByText("子")).toBeInTheDocument();
  });
});

describe("PricingCard", () => {
  it("renders the plan name as h3, the price and the feature list", () => {
    const { container } = render(
      <PricingCard
        data-testid="card"
        name="スタンダード"
        price="¥1,000"
        features={["5人まで", "10GB"]}
      />,
    );
    expect(screen.getByRole("heading", { level: 3, name: "スタンダード" })).toBeInTheDocument();
    expect(screen.getByText("¥1,000")).toHaveClass("pricing-card__amount");
    const items = screen.getAllByRole("listitem");
    expect(items.map((li) => li.textContent)).toEqual(["5人まで", "10GB"]);
    for (const li of items) {
      expect(li.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    }
    const card = screen.getByTestId("card");
    expect(card).toHaveClass("pricing-card");
    expect(card).not.toHaveClass("pricing-card--featured");
    expect(container.querySelector(".pricing-card__badge")).toBeNull();
    expect(container.querySelector(".pricing-card__description")).toBeNull();
    expect(container.querySelector(".pricing-card__period")).toBeNull();
  });

  it("renders badge, description, period and featured state", () => {
    render(
      <PricingCard
        data-testid="card"
        name="プロ"
        price="¥3,000"
        period="月"
        description="成長中のチーム向け"
        badge="おすすめ"
        featured
        features={[]}
      />,
    );
    expect(screen.getByTestId("card")).toHaveClass("pricing-card--featured");
    expect(screen.getByText("おすすめ")).toHaveClass("pricing-card__badge");
    expect(screen.getByText("成長中のチーム向け")).toHaveClass("pricing-card__description");
    expect(screen.getByText("/月")).toHaveClass("pricing-card__period");
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("renders children after the features, merges className and forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <PricingCard ref={ref} className="extra" name="n" price="0" features={[]}>
        <a href="/signup">申し込む</a>
      </PricingCard>,
    );
    expect(screen.getByRole("link", { name: "申し込む" })).toHaveAttribute("href", "/signup");
    expect(ref.current).toHaveClass("pricing-card", "extra");
  });
});
