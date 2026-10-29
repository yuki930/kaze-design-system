import { afterEach, describe, it, expect, vi } from "vitest";
import { createRef } from "react";
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

  describe("keyboard navigation", () => {
    const tipTitle = (c: HTMLElement) => c.querySelector(".chart-tooltip__title")?.textContent;

    it("ArrowLeft from nothing selects the last point and stops at the first", () => {
      const { container } = render(
        <LineChart aria-label="x" data={data} index="month" series={series} />,
      );
      const svg = screen.getByRole("img");
      fireEvent.keyDown(svg, { key: "ArrowLeft" });
      expect(tipTitle(container)).toBe("5月");
      for (let i = 0; i < 6; i++) fireEvent.keyDown(svg, { key: "ArrowLeft" });
      expect(tipTitle(container)).toBe("1月");
    });

    it("ArrowRight stops at the last point", () => {
      const { container } = render(
        <LineChart aria-label="x" data={data} index="month" series={series} />,
      );
      const svg = screen.getByRole("img");
      for (let i = 0; i < 8; i++) fireEvent.keyDown(svg, { key: "ArrowRight" });
      expect(tipTitle(container)).toBe("5月");
    });

    it("Home and End jump to the ends and Escape clears", () => {
      const { container } = render(
        <LineChart aria-label="x" data={data} index="month" series={series} />,
      );
      const svg = screen.getByRole("img");
      fireEvent.keyDown(svg, { key: "End" });
      expect(tipTitle(container)).toBe("5月");
      fireEvent.keyDown(svg, { key: "Home" });
      expect(tipTitle(container)).toBe("1月");
      fireEvent.keyDown(svg, { key: "Escape" });
      expect(container.querySelector(".chart-tooltip")).toBeNull();
      expect(container.querySelector(".chart-crosshair")).toBeNull();
    });

    it("prevents default scrolling for navigation keys only", () => {
      render(<LineChart aria-label="x" data={data} index="month" series={series} />);
      const svg = screen.getByRole("img");
      expect(fireEvent.keyDown(svg, { key: "ArrowRight" })).toBe(false);
      expect(fireEvent.keyDown(svg, { key: "Home" })).toBe(false);
      expect(fireEvent.keyDown(svg, { key: "Escape" })).toBe(true);
      expect(fireEvent.keyDown(svg, { key: "a" })).toBe(true);
    });

    it("ignores keys when there is no data", () => {
      const { container } = render(
        <LineChart aria-label="x" data={[]} index="month" series={series} />,
      );
      fireEvent.keyDown(screen.getByRole("img"), { key: "ArrowRight" });
      expect(container.querySelector(".chart-tooltip")).toBeNull();
    });

    it("shows a dash for a missing value and highlights only present points", () => {
      const { container } = render(
        <LineChart aria-label="x" data={data} index="month" series={series} />,
      );
      const svg = screen.getByRole("img");
      for (let i = 0; i < 3; i++) fireEvent.keyDown(svg, { key: "ArrowRight" });
      const rows = container.querySelectorAll(".chart-tooltip__row");
      expect(rows[0]).toHaveTextContent("売上-");
      expect(rows[1]).toHaveTextContent("利用者25");
      expect(container.querySelectorAll(".line-chart__dot--active")).toHaveLength(1);
    });

    it("flips the tooltip to the left of the crosshair past the midpoint", () => {
      const { container } = render(
        <LineChart aria-label="x" data={data} index="month" series={series} />,
      );
      const svg = screen.getByRole("img");
      fireEvent.keyDown(svg, { key: "Home" });
      const tip = () => container.querySelector(".chart-tooltip") as HTMLElement;
      expect(tip().style.transform).toBe("translateX(12px)");
      fireEvent.keyDown(svg, { key: "End" });
      expect(tip().style.transform).toBe("translateX(calc(-100% - 12px))");
    });
  });

  describe("pointer", () => {
    afterEach(() => vi.restoreAllMocks());

    const mockSvgRect = (svg: Element, width: number) =>
      vi.spyOn(svg, "getBoundingClientRect").mockReturnValue({
        left: 0,
        top: 0,
        width,
        height: 240,
        right: width,
        bottom: 240,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect);

    it("tracks the nearest point and clears on leave", () => {
      const { container } = render(
        <LineChart aria-label="x" data={data} index="month" series={series} />,
      );
      const svg = screen.getByRole("img");
      // width fallback 600, rect width 300 -> scaleX 2
      mockSvgRect(svg, 300);
      fireEvent.pointerMove(svg, { clientX: 299 });
      expect(container.querySelector(".chart-tooltip__title")).toHaveTextContent("5月");
      fireEvent.pointerMove(svg, { clientX: 0 });
      expect(container.querySelector(".chart-tooltip__title")).toHaveTextContent("1月");
      fireEvent.pointerLeave(svg);
      expect(container.querySelector(".chart-tooltip")).toBeNull();
    });

    it("treats a zero-width rect as unscaled", () => {
      const { container } = render(
        <LineChart aria-label="x" data={data} index="month" series={series} />,
      );
      const svg = screen.getByRole("img");
      mockSvgRect(svg, 0);
      fireEvent.pointerMove(svg, { clientX: 48 });
      expect(container.querySelector(".chart-tooltip__title")).toHaveTextContent("1月");
    });

    it("always selects the only point of a single-row chart", () => {
      const { container } = render(
        <LineChart
          aria-label="x"
          data={[{ month: "1月", a: 3 }]}
          index="month"
          series={[seriesA]}
        />,
      );
      const svg = screen.getByRole("img");
      mockSvgRect(svg, 600);
      fireEvent.pointerMove(svg, { clientX: 500 });
      expect(container.querySelector(".chart-tooltip__title")).toHaveTextContent("1月");
      // a single point has no line, only a dot
      expect(paths(container, "line-chart__line")).toHaveLength(0);
    });

    it("does nothing with no data", () => {
      const { container } = render(
        <LineChart aria-label="x" data={[]} index="month" series={series} />,
      );
      const svg = screen.getByRole("img");
      mockSvgRect(svg, 600);
      fireEvent.pointerMove(svg, { clientX: 100 });
      expect(container.querySelector(".chart-crosshair")).toBeNull();
    });
  });

  it("draws an isolated point between gaps as a dot", () => {
    const gappy = [
      { m: "a", v: 1 },
      { m: "b", v: null },
      { m: "c", v: 2 },
      { m: "d", v: undefined },
      { m: "e", v: 3 },
      { m: "f", v: 4 },
    ];
    const { container } = render(
      <LineChart aria-label="x" data={gappy} index="m" series={[{ key: "v", label: "V" }]} area />,
    );
    expect(paths(container, "line-chart__line")).toHaveLength(1);
    expect(paths(container, "line-chart__area")).toHaveLength(1);
    expect(container.querySelectorAll("circle.line-chart__dot")).toHaveLength(2);
  });

  it("shows markers for every point with showDots", () => {
    const { container } = render(
      <LineChart aria-label="x" data={data} index="month" series={[seriesB]} showDots />,
    );
    expect(container.querySelectorAll("circle.line-chart__dot")).toHaveLength(5);
  });

  it("starts the y axis at zero by default and fits the range when startAtZero is false", () => {
    const prices = [
      { d: "1", p: 1000 },
      { d: "2", p: 1040 },
      { d: "3", p: 1020 },
    ];
    const s = [{ key: "p", label: "価格" }];
    const { container, rerender } = render(
      <LineChart aria-label="x" data={prices} index="d" series={s} />,
    );
    const labels = () =>
      Array.from(container.querySelectorAll(".chart-axis text[text-anchor='end']")).map(
        (t) => t.textContent,
      );
    expect(labels()).toContain("0");
    rerender(<LineChart aria-label="x" data={prices} index="d" series={s} startAtZero={false} />);
    expect(labels()).not.toContain("0");
  });

  it("uses formatValue for axis and tooltip", () => {
    const { container } = render(
      <LineChart
        aria-label="x"
        data={data}
        index="month"
        series={[seriesB]}
        formatValue={(v) => `${v}件`}
      />,
    );
    expect(screen.getAllByText("0件").length).toBeGreaterThan(0);
    fireEvent.keyDown(screen.getByRole("img"), { key: "Home" });
    expect(container.querySelector(".chart-tooltip__value")).toHaveTextContent("5件");
  });

  it("can hide grid and axes", () => {
    const { container } = render(
      <LineChart
        aria-label="x"
        data={data}
        index="month"
        series={series}
        showGrid={false}
        showXAxis={false}
        showYAxis={false}
      />,
    );
    expect(container.querySelector(".chart-grid")).toBeNull();
    expect(container.querySelector(".chart-axis")).toBeNull();
  });

  it("falls back to a 0-1 axis when every series is hidden", () => {
    const { container } = render(
      <LineChart aria-label="x" data={data} index="month" series={series} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "売上" }));
    fireEvent.click(screen.getByRole("button", { name: "利用者" }));
    expect(paths(container, "line-chart__line")).toHaveLength(0);
    expect(container.querySelector(".chart-grid line")).toBeInTheDocument();
    // toggling back restores the series
    fireEvent.click(screen.getByRole("button", { name: "売上" }));
    expect(paths(container, "line-chart__line")).toHaveLength(2);
  });

  it("applies a custom series color", () => {
    const { container } = render(
      <LineChart
        aria-label="x"
        data={data}
        index="month"
        series={[{ ...seriesB, color: "red" }]}
      />,
    );
    expect(container.querySelector(".line-chart__series")?.getAttribute("style")).toContain("red");
  });

  it("renders an empty label when the index value is missing", () => {
    const { container } = render(
      <LineChart
        aria-label="x"
        data={[{ v: 1 }, { v: 2 }]}
        index="m"
        series={[{ key: "v", label: "V" }]}
      />,
    );
    const xLabels = container.querySelectorAll(".chart-axis text[text-anchor='middle']");
    expect(xLabels[0]?.textContent).toBe("");
  });

  it("thins x labels when points are dense", () => {
    const dense = Array.from({ length: 40 }, (_, i) => ({ d: `d${i}`, v: i }));
    const { container } = render(
      <LineChart aria-label="x" data={dense} index="d" series={[{ key: "v", label: "V" }]} />,
    );
    const xLabels = container.querySelectorAll(".chart-axis text[text-anchor='middle']");
    expect(xLabels.length).toBeLessThan(40);
    expect(xLabels[0]).toHaveTextContent("d0");
  });

  it("monotone curves handle flat and steep segments without overshoot", () => {
    const shaped = [
      { d: "1", v: 0 },
      { d: "2", v: 0 },
      { d: "3", v: 100 },
      { d: "4", v: 101 },
      { d: "5", v: 50 },
    ];
    const { container } = render(
      <LineChart
        aria-label="x"
        data={shaped}
        index="d"
        series={[{ key: "v", label: "V" }]}
        curve="monotone"
        area
      />,
    );
    const d = paths(container, "line-chart__line")[0]?.getAttribute("d") ?? "";
    expect(d.match(/C/g)).toHaveLength(4);
    expect(d).not.toContain("NaN");
    expect(paths(container, "line-chart__area")[0]?.getAttribute("d")).toMatch(/Z$/);
  });

  it("uses straight segments for a monotone run of two points", () => {
    const { container } = render(
      <LineChart
        aria-label="x"
        data={[
          { d: "1", v: 1 },
          { d: "2", v: 2 },
        ]}
        index="d"
        series={[{ key: "v", label: "V" }]}
        curve="monotone"
      />,
    );
    const d = paths(container, "line-chart__line")[0]?.getAttribute("d") ?? "";
    expect(d).toContain("L");
    expect(d).not.toContain("C");
  });

  it("forwards ref to the root element and stretches the svg before measuring", () => {
    const ref = createRef<HTMLDivElement>();
    render(<LineChart ref={ref} aria-label="x" data={data} index="month" series={series} />);
    expect(ref.current).toHaveClass("line-chart");
    const svg = screen.getByRole("img");
    expect(svg).toHaveAttribute("width", "100%");
    expect(svg).toHaveAttribute("preserveAspectRatio", "none");
    expect(svg).toHaveAttribute("tabindex", "0");
  });
});
