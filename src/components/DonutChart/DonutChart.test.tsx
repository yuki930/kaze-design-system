import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DonutChart } from "./DonutChart";

const data = [
  { label: "Organic", value: 60 },
  { label: "Direct", value: 30 },
  { label: "Social", value: 10 },
];

describe("DonutChart", () => {
  it("exposes a labelled figure with a readable legend and a decorative svg", () => {
    const { container } = render(<DonutChart aria-label="流入経路" data={data} />);
    expect(screen.getByRole("figure", { name: "流入経路" })).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Organic")).toBeInTheDocument();
    expect(screen.getByText("60")).toBeInTheDocument();
  });

  it("adds a screen-reader summary with each segment's share", () => {
    const { container } = render(<DonutChart aria-label="流入経路" data={data} />);
    expect(container.querySelector(".sr-only")).toHaveTextContent(
      "Organic 60（60%）、Direct 30（30%）、Social 10（10%）",
    );
  });

  it("prefixes the summary with the center label", () => {
    const { container } = render(
      <DonutChart aria-label="流入経路" data={data} centerLabel="合計 100" showLegend={false} />,
    );
    expect(container.querySelector(".sr-only")).toHaveTextContent("合計 100、Organic 60（60%）");
    expect(container.querySelector(".donut-chart__legend")).toBeNull();
  });
});
