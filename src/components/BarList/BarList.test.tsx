import { createRef, forwardRef, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BarList, type BarListItem } from "./BarList";

const data: BarListItem[] = [
  { label: "ノルン株式会社", value: 50 },
  { label: "株式会社ノーツ", value: 200 },
  { label: "八十八株式会社", value: 100 },
];

const labels = (container: HTMLElement) =>
  Array.from(container.querySelectorAll(".barlist__label")).map((el) => el.textContent);

const barWidth = (label: string) =>
  (screen.getByText(label).previousElementSibling as HTMLElement).style.width;

const CustomLink = forwardRef<
  HTMLAnchorElement,
  { href: string; className?: string; children: ReactNode }
>(({ children, ...props }, ref) => (
  <a ref={ref} data-custom="yes" {...props}>
    {children}
  </a>
));

describe("BarList", () => {
  it("sorts descending by default and scales bars to the max value", () => {
    const { container } = render(<BarList data={data} />);
    expect(container.firstChild).toHaveClass("barlist");
    expect(labels(container)).toEqual(["株式会社ノーツ", "八十八株式会社", "ノルン株式会社"]);
    expect(barWidth("株式会社ノーツ")).toBe("100%");
    expect(barWidth("八十八株式会社")).toBe("50%");
    expect(barWidth("ノルン株式会社")).toBe("25%");
  });

  it("sorts ascending", () => {
    const { container } = render(<BarList data={data} sortOrder="ascending" />);
    expect(labels(container)).toEqual(["ノルン株式会社", "八十八株式会社", "株式会社ノーツ"]);
  });

  it("keeps the given order with sortOrder none and does not mutate data", () => {
    const input = [...data];
    const { container } = render(<BarList data={input} sortOrder="none" />);
    expect(labels(container)).toEqual(["ノルン株式会社", "株式会社ノーツ", "八十八株式会社"]);
    render(<BarList data={input} />);
    expect(input.map((d) => d.label)).toEqual(data.map((d) => d.label));
  });

  it("shows the raw value, the formatter output, or displayValue (which wins)", () => {
    const formatter = vi.fn((v: number) => `${v}件`);
    render(
      <BarList
        data={[
          { label: "A", value: 3 },
          { label: "B", value: 2, displayValue: "二" },
        ]}
        valueFormatter={formatter}
      />,
    );
    expect(screen.getByText("3件")).toHaveClass("barlist__value");
    expect(screen.getByText("二")).toBeInTheDocument();
    expect(formatter).toHaveBeenCalledWith(3);
    expect(formatter).not.toHaveBeenCalledWith(2);
  });

  it("falls back to String(value) without a formatter", () => {
    render(<BarList data={[{ label: "A", value: 7 }]} />);
    expect(screen.getByText("7")).toHaveClass("barlist__value");
  });

  it("applies a custom bar color only when given", () => {
    render(
      <BarList
        data={[
          { label: "A", value: 1, color: "rgb(255, 0, 0)" },
          { label: "B", value: 1 },
        ]}
      />,
    );
    const a = screen.getByText("A").previousElementSibling as HTMLElement;
    const b = screen.getByText("B").previousElementSibling as HTMLElement;
    expect(a.style.backgroundColor).toBe("rgb(255, 0, 0)");
    expect(b.style.backgroundColor).toBe("");
  });

  it("renders rows with href as links, others as plain rows", () => {
    render(
      <BarList
        data={[
          { label: "リンク", value: 2, href: "/a" },
          { label: "なし", value: 1 },
        ]}
      />,
    );
    const link = screen.getByRole("link", { name: /リンク/ });
    expect(link).toHaveAttribute("href", "/a");
    expect(link).toHaveClass("barlist__row", "barlist__row--link");
    const row = screen.getByText("なし").closest(".barlist__row");
    expect(row?.tagName).toBe("DIV");
    expect(row).not.toHaveClass("barlist__row--link");
  });

  it("renders links through a custom `as` component", () => {
    render(<BarList data={[{ label: "A", value: 1, href: "/x", as: CustomLink }]} />);
    expect(screen.getByRole("link")).toHaveAttribute("data-custom", "yes");
  });

  it("handles empty data and all-zero values without dividing by zero", () => {
    const { container, rerender } = render(<BarList data={[]} />);
    expect(container.querySelectorAll(".barlist__row")).toHaveLength(0);
    rerender(<BarList data={[{ label: "ゼロ", value: 0 }]} />);
    expect(barWidth("ゼロ")).toBe("0%");
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("forwards ref, merges className and passes rest props", () => {
    const ref = createRef<HTMLDivElement>();
    render(<BarList ref={ref} data={data} className="extra" data-testid="bl" aria-label="売上" />);
    const el = screen.getByTestId("bl");
    expect(ref.current).toBe(el);
    expect(el).toHaveClass("barlist", "extra");
    expect(el).toHaveAttribute("aria-label", "売上");
  });
});

describe("BarList edge cases", () => {
  it("renders duplicate labels without key warnings and clamps negative values", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const { container } = render(
      <BarList
        data={[
          { label: "同じ", value: 10 },
          { label: "同じ", value: -5 },
        ]}
      />,
    );
    expect(error).not.toHaveBeenCalled();
    const widths = [...container.querySelectorAll<HTMLElement>("[style*='width']")].map(
      (el) => el.style.width,
    );
    expect(widths.every((w) => !w.startsWith("-"))).toBe(true);
    error.mockRestore();
  });
});
