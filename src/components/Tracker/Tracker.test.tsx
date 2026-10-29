import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tracker } from "./Tracker";

const data = [
  { status: "positive" as const, tooltip: "Day 1" },
  { status: "negative" as const, tooltip: "Day 2" },
  { status: "warning" as const },
  { status: "positive" as const, tooltip: "正常" },
];

describe("Tracker", () => {
  it("exposes a figure with a Japanese default label", () => {
    render(<Tracker data={data} />);
    expect(screen.getByRole("figure", { name: "4区間" })).toBeInTheDocument();
  });

  it("uses the label prop as the figure name", () => {
    render(<Tracker data={data} label="稼働状況" />);
    expect(screen.getByRole("figure", { name: "稼働状況" })).toBeInTheDocument();
  });

  it("renders segments as an ordered list with spoken status text", () => {
    render(<Tracker data={data} />);
    expect(screen.getByRole("list").tagName).toBe("OL");
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent("Day 1（正常）");
    expect(items[0]).toHaveAttribute("title", "Day 1");
    expect(items[1]).toHaveTextContent("Day 2（異常）");
    expect(items[2]).toHaveTextContent("警告");
    expect(items[2]).not.toHaveAttribute("title");
    // A tooltip identical to the status is not repeated
    expect(items[3]).toHaveTextContent(/^正常$/);
  });

  it("keeps the status modifier classes", () => {
    render(<Tracker data={data} />);
    expect(screen.getAllByRole("listitem")[1]).toHaveClass(
      "tracker__segment",
      "tracker__segment--negative",
    );
  });
});
