import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Timeline, TimelineItem } from "./Timeline";

describe("TimelineItem", () => {
  it("applies tone", () => {
    render(<TimelineItem tone="positive" title="done" />);
    const li = screen.getByRole("listitem");
    expect(li).toHaveAttribute("data-tone", "positive");
    expect(li.querySelector(".timeline-item__dot--positive")).not.toBeNull();
  });
});

describe("Timeline", () => {
  it("renders a list, merges className, forwards ref and rest", () => {
    const ref = createRef<HTMLUListElement>();
    render(
      <Timeline ref={ref} className="extra" aria-label="履歴">
        <TimelineItem title="作成" />
        <TimelineItem title="更新" />
      </Timeline>,
    );
    const list = screen.getByRole("list", { name: "履歴" });
    expect(list).toHaveClass("timeline", "extra");
    expect(ref.current).toBe(list);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});

describe("TimelineItem rendering", () => {
  it("defaults to the default tone with a hidden dot and no optional parts", () => {
    const { container } = render(<TimelineItem title="作成しました" />);
    const li = screen.getByRole("listitem");
    expect(li).toHaveAttribute("data-tone", "default");
    const dot = li.querySelector(".timeline-item__dot") as HTMLElement;
    expect(dot.className).toBe("timeline-item__dot");
    expect(dot).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("作成しました")).toHaveClass("timeline-item__title");
    expect(container.querySelector(".timeline-item__time")).toBeNull();
    expect(container.querySelector(".timeline-item__description")).toBeNull();
  });

  it("renders time and description", () => {
    render(<TimelineItem time="10:30" title="t" description="担当: 早瀬 遼平" />);
    expect(screen.getByText("10:30")).toHaveClass("timeline-item__time");
    expect(screen.getByText("担当: 早瀬 遼平")).toHaveClass("timeline-item__description");
  });

  it("merges className, forwards ref and passes rest props", () => {
    const ref = createRef<HTMLLIElement>();
    render(<TimelineItem ref={ref} title="t" className="extra" id="item" />);
    const li = screen.getByRole("listitem");
    expect(ref.current).toBe(li);
    expect(li).toHaveClass("timeline-item", "extra");
    expect(li).toHaveAttribute("id", "item");
  });
});
