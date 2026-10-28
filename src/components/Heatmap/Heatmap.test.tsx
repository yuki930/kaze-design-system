import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Heatmap } from "./Heatmap";

const cellsOf = (c: HTMLElement) => [...c.querySelectorAll<HTMLElement>(".heatmap__cell")];
function at<T>(arr: T[], i: number): T {
  const v = arr[i];
  if (v === undefined) throw new Error(`index ${i} out of range`);
  return v;
}
const nth = (c: HTMLElement, i: number) => at(cellsOf(c), i);

describe("Heatmap matrix", () => {
  const props = {
    "aria-label": "曜日別アクセス",
    rows: ["月", "火"],
    columns: ["0", "1", "2"],
    values: [
      [0, 5, 10],
      [null, 2, 10],
    ],
  };

  it("exposes role=img with the label and renders row/column labels", () => {
    render(<Heatmap {...props} />);
    expect(screen.getByRole("img", { name: "曜日別アクセス" })).toBeInTheDocument();
    expect(screen.getByText("火")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("maps values to levels against the max; 0 and null are empty", () => {
    const { container } = render(<Heatmap {...props} />);
    expect(cellsOf(container).map((c) => c.dataset.level)).toEqual(["0", "3", "5", "0", "1", "5"]);
  });

  it("respects an explicit max and level count", () => {
    const { container } = render(<Heatmap {...props} max={20} levels={2} />);
    expect(cellsOf(container).map((c) => c.dataset.level)).toEqual(["0", "1", "1", "0", "1", "1"]);
    expect(container.querySelectorAll(".heatmap__swatch")).toHaveLength(2);
  });

  it("shows a tooltip on hover and hides it on leave", () => {
    const { container } = render(<Heatmap {...props} />);
    fireEvent.mouseEnter(nth(container, 1));
    expect(container.querySelector(".chart-tooltip")).toHaveTextContent("月 1");
    expect(container.querySelector(".chart-tooltip")).toHaveTextContent("5");
    fireEvent.mouseLeave(container.querySelector(".heatmap__grid") as HTMLElement);
    expect(container.querySelector(".chart-tooltip")).toBeNull();
  });

  it("shows データなし for null and supports formatTooltip", () => {
    const { container, rerender } = render(<Heatmap {...props} />);
    fireEvent.mouseEnter(nth(container, 3));
    expect(container.querySelector(".chart-tooltip")).toHaveTextContent("データなし");
    rerender(<Heatmap {...props} formatTooltip={(c) => `${c.row}/${c.column}=${c.value}`} />);
    fireEvent.mouseEnter(nth(container, 2));
    expect(container.querySelector(".chart-tooltip")).toHaveTextContent("月/2=10");
  });

  it("hides the legend when showLegend is false", () => {
    const { container } = render(<Heatmap {...props} showLegend={false} />);
    expect(container.querySelector(".heatmap__legend")).toBeNull();
  });
});

describe("Heatmap calendar", () => {
  // 2026-03-02 is a Monday
  const data = [
    { date: "2026-03-02", value: 4 },
    { date: "2026-03-08", value: 8 },
    { date: "2026-03-16", value: 1 },
  ];

  it("renders one cell per day of the data range and puts Monday in the first row", () => {
    const { container } = render(<Heatmap aria-label="c" variant="calendar" data={data} />);
    const cells = cellsOf(container);
    expect(cells).toHaveLength(15);
    expect(at(cells, 0).style.gridRow).toBe("2");
    expect(at(cells, 0).style.gridColumn).toBe("2");
    // Sunday 03-08 is the last row of the first week
    expect(at(cells, 6).style.gridRow).toBe("8");
    expect(at(cells, 6).style.gridColumn).toBe("2");
    expect(at(cells, 14).style.gridColumn).toBe("4");
  });

  it("starts weeks on Sunday when weekStartsOn is 0", () => {
    const { container } = render(
      <Heatmap aria-label="c" variant="calendar" data={data} weekStartsOn={0} />,
    );
    // Monday is the second row; Sunday 03-08 opens the second week
    expect(nth(container, 0).style.gridRow).toBe("3");
    expect(nth(container, 6).style.gridRow).toBe("2");
    expect(nth(container, 6).style.gridColumn).toBe("3");
  });

  it("labels Mon/Wed/Fri and the month", () => {
    render(<Heatmap aria-label="c" variant="calendar" data={data} />);
    for (const t of ["月", "水", "金", "3月"]) expect(screen.getByText(t)).toBeInTheDocument();
    expect(screen.queryByText("火")).toBeNull();
  });

  it("does not shift dates across time zones and shows the date in the tooltip", () => {
    const { container } = render(
      <Heatmap aria-label="c" variant="calendar" startDate="2026-01-01" endDate="2026-01-03" />,
    );
    fireEvent.mouseEnter(nth(container, 0));
    expect(container.querySelector(".chart-tooltip")).toHaveTextContent("2026-01-01");
    expect(container.querySelector(".chart-tooltip")).toHaveTextContent("データなし");
  });

  it("sums duplicate dates and ignores invalid ones", () => {
    const { container } = render(
      <Heatmap
        aria-label="c"
        variant="calendar"
        data={[
          { date: "2026-03-02", value: 2 },
          { date: "2026-03-02", value: 2 },
          { date: "2026-02-31", value: 99 },
        ]}
      />,
    );
    expect(cellsOf(container)).toHaveLength(1);
    expect(nth(container, 0).dataset.level).toBe("5");
  });

  it("renders no cells for empty data", () => {
    const { container } = render(<Heatmap aria-label="c" variant="calendar" />);
    expect(cellsOf(container)).toHaveLength(0);
  });
});
