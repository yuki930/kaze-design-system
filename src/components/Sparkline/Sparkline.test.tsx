import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sparkline } from "./Sparkline";

const data = [1, 3, 2, 5, 4];

describe("Sparkline", () => {
  it("is decorative (aria-hidden) when no label is given", () => {
    const { container } = render(<Sparkline data={data} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).not.toHaveAttribute("role");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("becomes a labelled image when label is given", () => {
    render(<Sparkline data={data} label="直近5日の推移" />);
    const svg = screen.getByRole("img", { name: "直近5日の推移" });
    expect(svg).not.toHaveAttribute("aria-hidden");
  });

  it("also accepts aria-label directly", () => {
    render(<Sparkline data={data} aria-label="推移" />);
    expect(screen.getByRole("img", { name: "推移" })).toBeInTheDocument();
  });

  it("renders nothing for fewer than two points", () => {
    const { container } = render(<Sparkline data={[1]} />);
    expect(container.querySelector("svg")).toBeNull();
  });
});
