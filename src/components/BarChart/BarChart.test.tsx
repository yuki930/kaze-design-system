import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BarChart } from "./BarChart";

const data = [
  { label: "React", value: 85 },
  { label: "Vue", value: 62 },
  { label: "Svelte", value: 40 },
];

describe("BarChart", () => {
  it("exposes a labelled figure whose rows stay readable", () => {
    render(<BarChart aria-label="人気フレームワーク" data={data} max={100} />);
    const figure = screen.getByRole("figure", { name: "人気フレームワーク" });
    expect(figure).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("85")).toBeInTheDocument();
  });

  it("adds a screen-reader summary with the relative share of each bar", () => {
    const { container } = render(
      <BarChart aria-label="人気フレームワーク" data={data} max={100} />,
    );
    const summary = container.querySelector(".sr-only");
    expect(summary).toHaveTextContent("React 85（85%）、Vue 62（62%）、Svelte 40（40%）");
  });

  it("uses formatValue in the summary and scales to the largest value by default", () => {
    const { container } = render(
      <BarChart aria-label="x" data={data} formatValue={(v) => `${v}%`} />,
    );
    expect(container.querySelector(".sr-only")).toHaveTextContent("React 85%（100%）");
    expect(container.querySelector<HTMLElement>(".bar-chart__fill")?.style.width).toBe("100%");
  });

  it("hides the decorative track from assistive tech", () => {
    const { container } = render(<BarChart aria-label="x" data={data} />);
    for (const track of container.querySelectorAll(".bar-chart__track")) {
      expect(track).toHaveAttribute("aria-hidden", "true");
    }
  });
});
