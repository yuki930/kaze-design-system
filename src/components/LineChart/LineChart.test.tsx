import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { LineChart } from "./LineChart";

const data = [
  { month: "1月", a: 10, b: 5 },
  { month: "2月", a: 20, b: 15 },
  { month: "3月", a: null, b: 25 },
  { month: "4月", a: 30, b: 20 },
  { month: "5月", a: 40, b: 30 },
];
const seriesA = { key: "a", label: "売上" };
const seriesB = { key: "b", label: "利用者" };
const series = [seriesA, seriesB];

const paths = (c: HTMLElement, cls: string) => c.querySelectorAll(`path.${cls}`);

describe("LineChart", () => {
  it("renders role img with aria-label", () => {
    render(<LineChart aria-label="月別推移" data={data} index="month" series={series} />);
    expect(screen.getByRole("img", { name: "月別推移" })).toBeInTheDocument();
  });

  it("draws one path per series run and breaks at null", () => {
    const { container } = render(
      <LineChart aria-label="x" data={data} index="month" series={series} />,
    );
    // a: runs [0,1] and [3,4] = 2, b: 1
    expect(paths(container, "line-chart__line")).toHaveLength(3);
  });

  it("draws one path per series without gaps", () => {
    const { container } = render(
      <LineChart aria-label="x" data={data} index="month" series={[seriesB]} />,
    );
    expect(paths(container, "line-chart__line")).toHaveLength(1);
  });

  it("renders area paths only when area is set", () => {
    const { container, rerender } = render(
      <LineChart aria-label="x" data={data} index="month" series={[seriesB]} />,
    );
    expect(paths(container, "line-chart__area")).toHaveLength(0);
    rerender(<LineChart aria-label="x" data={data} index="month" series={[seriesB]} area />);
    expect(paths(container, "line-chart__area")).toHaveLength(1);
  });

  it("supports monotone curves", () => {
    const { container } = render(
      <LineChart aria-label="x" data={data} index="month" series={[seriesB]} curve="monotone" />,
    );
    expect(paths(container, "line-chart__line")[0]?.getAttribute("d")).toContain("C");
  });

  it("toggles a series from the legend", () => {
    const { container } = render(
      <LineChart aria-label="x" data={data} index="month" series={[seriesB]} />,
    );
    const btn = screen.getByRole("button", { name: "利用者" });
    expect(btn).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "false");
    expect(paths(container, "line-chart__line")).toHaveLength(0);
  });

  it("hides the legend when showLegend is false", () => {
    render(
      <LineChart aria-label="x" data={data} index="month" series={series} showLegend={false} />,
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("shows a tooltip with all series on keyboard navigation", () => {
    const { container } = render(
      <LineChart aria-label="x" data={data} index="month" series={series} />,
    );
    const svg = screen.getByRole("img");
    fireEvent.keyDown(svg, { key: "ArrowRight" });
    fireEvent.keyDown(svg, { key: "ArrowRight" });
    const tip = container.querySelector(".chart-tooltip") as HTMLElement;
    expect(tip).toHaveAttribute("role", "status");
    expect(tip).toHaveTextContent("2月");
    expect(tip).toHaveTextContent("売上");
    expect(tip).toHaveTextContent("利用者");
    expect(container.querySelector(".chart-crosshair")).toBeInTheDocument();
    fireEvent.blur(svg);
    expect(container.querySelector(".chart-tooltip")).toBeNull();
  });

  it("does not crash with empty data", () => {
    render(<LineChart aria-label="x" data={[]} index="month" series={series} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("forwards ref and className", () => {
    render(
      <LineChart
        aria-label="x"
        data={data}
        index="month"
        series={series}
        className="custom"
        data-testid="r"
      />,
    );
    expect(screen.getByTestId("r")).toHaveClass("line-chart", "custom");
  });
});
