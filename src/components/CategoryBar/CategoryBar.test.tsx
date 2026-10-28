import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CategoryBar } from "./CategoryBar";

const data = [
  { label: "広告", value: 50 },
  { label: "人件費", value: 30 },
  { label: "外注", value: 20 },
];

describe("CategoryBar", () => {
  it("is an img with aria-label and a readable breakdown", () => {
    render(<CategoryBar aria-label="予算の内訳" data={data} showPercent />);
    const el = screen.getByRole("img", { name: "予算の内訳" });
    expect(el.querySelector(".sr-only")?.textContent).toBe(
      "広告 50 (50%)、人件費 30 (30%)、外注 20 (20%)",
    );
  });

  it("sizes segments by value and skips zero values", () => {
    const { container } = render(
      <CategoryBar aria-label="x" data={[...data, { label: "なし", value: 0 }]} />,
    );
    const segs = container.querySelectorAll<HTMLElement>(".category-bar__segment");
    expect(segs).toHaveLength(3);
    expect(segs[0]?.style.flexGrow).toBe("50");
    expect(segs[0]?.title).toBe("広告 50");
  });

  it("hides legend when showLabels is false", () => {
    const { container } = render(<CategoryBar aria-label="x" data={data} showLabels={false} />);
    expect(container.querySelector(".category-bar__legend")).toBeNull();
  });

  it("positions marker against total and applies height / formatValue", () => {
    const { container } = render(
      <CategoryBar
        aria-label="x"
        data={data}
        height={12}
        marker={{ value: 75, label: "目標" }}
        formatValue={(v) => `${v}万円`}
      />,
    );
    expect(container.querySelector<HTMLElement>(".category-bar__marker")?.style.left).toBe("75%");
    expect(container.querySelector<HTMLElement>(".category-bar__track")?.style.height).toBe("12px");
    expect(screen.getAllByText("50万円").length).toBeGreaterThan(0);
  });

  it("handles an all-zero total without NaN", () => {
    const { container } = render(
      <CategoryBar aria-label="x" data={[{ label: "a", value: 0 }]} marker={{ value: 1 }} />,
    );
    expect(container.querySelector(".category-bar__marker")).toBeNull();
  });
});
