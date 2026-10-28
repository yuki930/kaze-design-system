import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ColumnChart } from "./ColumnChart";

const data = [
  { month: "1月", a: 10, b: 5 },
  { month: "2月", a: 20, b: -8 },
  { month: "3月", a: 15, b: 7 },
];
const series = [
  { key: "a", label: "売上" },
  { key: "b", label: "費用" },
];

const bars = (c: HTMLElement) => c.querySelectorAll(".column-chart__bar");

describe("ColumnChart", () => {
  it("renders role=img with aria-label", () => {
    render(<ColumnChart aria-label="月次" data={data} index="month" series={series} />);
    expect(screen.getByRole("img", { name: "月次" })).toBeInTheDocument();
  });

  it("renders one bar per category and series", () => {
    const { container } = render(
      <ColumnChart aria-label="x" data={data} index="month" series={series} />,
    );
    expect(bars(container)).toHaveLength(6);
  });

  it("renders x labels and legend", () => {
    render(<ColumnChart aria-label="x" data={data} index="month" series={series} />);
    expect(screen.getByText("2月", { selector: "text" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "売上" })).toHaveAttribute("aria-pressed", "true");
  });

  it("keeps legend buttons reachable outside the img role", () => {
    render(<ColumnChart aria-label="x" data={data} index="month" series={series} />);
    const img = screen.getByRole("img");
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    for (const b of buttons) expect(img).not.toContainElement(b);
  });

  it("hides a series via the legend", () => {
    const { container } = render(
      <ColumnChart aria-label="x" data={data} index="month" series={series} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "費用" }));
    expect(bars(container)).toHaveLength(3);
    expect(screen.getByRole("button", { name: "費用" })).toHaveAttribute("aria-pressed", "false");
  });

  it("hides legend and axes when disabled", () => {
    const { container } = render(
      <ColumnChart
        aria-label="x"
        data={data}
        index="month"
        series={series}
        showLegend={false}
        showXAxis={false}
        showYAxis={false}
        showGrid={false}
      />,
    );
    expect(screen.queryByRole("button")).toBeNull();
    expect(container.querySelector(".chart-grid")).toBeNull();
    expect(container.querySelector(".column-chart__y-axis")).toBeNull();
  });

  it("shows tooltip with total for stacked on keyboard navigation", () => {
    render(
      <ColumnChart aria-label="x" data={data} index="month" series={series} layout="stacked" />,
    );
    const root = screen.getByRole("img");
    fireEvent.keyDown(root, { key: "ArrowRight" });
    fireEvent.keyDown(root, { key: "ArrowRight" });
    const tip = screen.getByRole("status");
    expect(tip).toHaveTextContent("2月");
    expect(tip).toHaveTextContent("合計");
    expect(tip).toHaveTextContent("12");
    fireEvent.keyDown(root, { key: "Escape" });
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("omits total in grouped tooltip and uses formatValue", () => {
    render(
      <ColumnChart
        aria-label="x"
        data={data}
        index="month"
        series={series}
        formatValue={(v) => `${v}円`}
      />,
    );
    fireEvent.keyDown(screen.getByRole("img"), { key: "Home" });
    const tip = screen.getByRole("status");
    expect(tip).toHaveTextContent("10円");
    expect(tip).not.toHaveTextContent("合計");
  });

  it("draws negative bars below the baseline", () => {
    const { container } = render(
      <ColumnChart
        aria-label="x"
        data={[{ m: "1月", v: -10 }]}
        index="m"
        series={[{ key: "v", label: "v" }]}
      />,
    );
    const d = bars(container)[0]?.getAttribute("d") ?? "";
    expect(d).toMatch(/^M/);
    expect(d).not.toContain("NaN");
  });

  it("handles empty data", () => {
    const { container } = render(
      <ColumnChart aria-label="x" data={[]} index="m" series={series} />,
    );
    expect(bars(container)).toHaveLength(0);
  });

  it("uses token colors by default and merges className", () => {
    const { container } = render(
      <ColumnChart aria-label="x" data={data} index="month" series={series} className="extra" />,
    );
    expect(container.firstChild).toHaveClass("chart", "column-chart", "extra");
    expect(bars(container)[0]?.getAttribute("fill")).toMatch(/^var\(--chart-/);
  });
});
