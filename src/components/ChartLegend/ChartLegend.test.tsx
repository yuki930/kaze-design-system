import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChartLegend } from "./ChartLegend";

const items = [
  { key: "web", label: "Web", color: "var(--chart-1)" },
  { key: "ios", label: "iOS", color: "var(--chart-2)" },
];

describe("ChartLegend", () => {
  it("renders static items without buttons", () => {
    render(<ChartLegend items={items} />);
    expect(screen.getByText("Web")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders toggle buttons with aria-pressed when onToggle is given", () => {
    const onToggle = vi.fn();
    render(<ChartLegend items={items} hidden={["ios"]} onToggle={onToggle} />);
    expect(screen.getByRole("button", { name: "Web" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "iOS" })).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(screen.getByRole("button", { name: "iOS" }));
    expect(onToggle).toHaveBeenCalledWith("ios");
  });
});
