import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Slider } from "./Slider";

describe("Slider", () => {
  it("is a labelled range input that shows the formatted value", () => {
    render(
      <Slider
        label="年利"
        min={0}
        max={10}
        step={0.1}
        defaultValue={5}
        formatValue={(v) => `${v.toFixed(1)}%`}
      />,
    );
    const input = screen.getByRole("slider", { name: "年利" });
    expect(input).toHaveAttribute("aria-valuetext", "5.0%");
    expect(screen.getByText("5.0%").tagName).toBe("OUTPUT");
  });
  it("updates uncontrolled and reports changes", () => {
    const onValueChange = vi.fn();
    render(<Slider label="量" defaultValue={10} onValueChange={onValueChange} />);
    const input = screen.getByRole("slider");
    fireEvent.change(input, { target: { value: "40" } });
    expect(onValueChange).toHaveBeenCalledWith(40);
    expect(input).toHaveValue("40");
    expect(input.style.getPropertyValue("--slider-progress")).toBe("40%");
  });
  it("stays at the controlled value and clamps it", () => {
    render(<Slider label="量" value={150} max={100} onValueChange={() => {}} />);
    expect(screen.getByRole("slider")).toHaveValue("100");
  });
  it("renders marks and links the description", () => {
    const { container } = render(<Slider label="量" marks={[0, 50, 100]} description="0〜100" />);
    expect(container.querySelectorAll(".slider__mark")).toHaveLength(3);
    const input = screen.getByRole("slider");
    expect(input.getAttribute("aria-describedby")).toContain("-description");
  });
});
