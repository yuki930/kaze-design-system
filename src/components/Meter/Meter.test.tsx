import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { resetDeprecationWarnings } from "@/lib/deprecate";
import { Meter } from "./Meter";

let warn: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  resetDeprecationWarnings();
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => warn.mockRestore());

describe("Meter", () => {
  it("applies tone", () => {
    const { container } = render(<Meter value={10} tone="info" />);
    expect(container.firstElementChild).toHaveAttribute("data-tone", "info");
    expect(container.querySelector(".meter__fill--info")).not.toBeNull();
    expect(warn).not.toHaveBeenCalled();
  });

  it("derives tone from thresholds when unset", () => {
    const { container } = render(<Meter value={95} />);
    expect(container.firstElementChild).toHaveAttribute("data-tone", "negative");
  });

  it("still honors deprecated color and warns once", () => {
    const { container, rerender } = render(<Meter value={10} color="warning" />);
    rerender(<Meter value={20} color="warning" />);
    expect(container.querySelector(".meter__fill--warning")).not.toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
  });
});

describe("Meter rendering", () => {
  const fill = (c: HTMLElement) => c.querySelector(".meter__fill") as HTMLElement;

  it("exposes role=meter with value / min / max and labels it", () => {
    render(<Meter value={30} min={10} max={50} label="ストレージ" />);
    const meter = screen.getByRole("meter", { name: "ストレージ" });
    expect(meter).toHaveAttribute("aria-valuenow", "30");
    expect(meter).toHaveAttribute("aria-valuemin", "10");
    expect(meter).toHaveAttribute("aria-valuemax", "50");
    expect(screen.getByText("ストレージ")).toHaveClass("meter__label");
  });

  it("omits the label row when neither label nor showValue is set", () => {
    const { container } = render(<Meter value={10} />);
    expect(container.querySelector(".meter__label-row")).toBeNull();
    expect(screen.getByRole("meter")).not.toHaveAttribute("aria-label");
  });

  it("shows 'value / max' without a label when showValue is set", () => {
    const { container } = render(<Meter value={42} max={80} showValue />);
    expect(container.querySelector(".meter__value-text")).toHaveTextContent("42 / 80");
    expect(container.querySelector(".meter__label")).toBeNull();
  });

  it("fills relative to min / max", () => {
    const { container } = render(<Meter value={30} min={10} max={50} />);
    expect(fill(container).style.width).toBe("50%");
  });

  it("clamps the fill to 0% and 100%", () => {
    const { container: low } = render(<Meter value={-5} />);
    const { container: high } = render(<Meter value={150} />);
    expect(fill(low).style.width).toBe("0%");
    expect(fill(high).style.width).toBe("100%");
  });

  it("does not divide by zero when min equals max", () => {
    const { container } = render(<Meter value={5} min={5} max={5} />);
    expect(fill(container).style.width).toBe("0%");
  });

  it.each([
    [50, "positive"],
    [70, "warning"],
    [89, "warning"],
    [90, "negative"],
  ])("derives tone for %i%% with default thresholds", (value, tone) => {
    const { container } = render(<Meter value={value} />);
    expect(container.firstElementChild).toHaveAttribute("data-tone", tone);
    expect(fill(container)).toHaveClass(`meter__fill--${tone}`);
  });

  it("honors custom thresholds", () => {
    const { container } = render(<Meter value={40} warningThreshold={0.3} dangerThreshold={0.6} />);
    expect(container.firstElementChild).toHaveAttribute("data-tone", "warning");
  });

  it("does not add a fill modifier for the default tone", () => {
    const { container } = render(<Meter value={95} tone="default" />);
    expect(container.firstElementChild).toHaveAttribute("data-tone", "default");
    expect(fill(container).className).toBe("meter__fill");
  });

  it("renders a marker per threshold below 1 and skips thresholds at 1 or above", () => {
    const { container: both } = render(<Meter value={10} />);
    const markers = both.querySelectorAll<HTMLElement>(".meter__marker");
    expect(Array.from(markers).map((m) => m.style.left)).toEqual(["70%", "90%"]);
    for (const m of markers) expect(m).toHaveAttribute("aria-hidden", "true");

    const { container: none } = render(
      <Meter value={10} warningThreshold={1} dangerThreshold={1} />,
    );
    expect(none.querySelectorAll(".meter__marker")).toHaveLength(0);
  });

  it("uses md track by default and a modifier for other sizes", () => {
    const { container: md } = render(<Meter value={1} />);
    expect(md.querySelector(".meter__track")?.className).toBe("meter__track");
    const { container: sm } = render(<Meter value={1} size="sm" />);
    expect(sm.querySelector(".meter__track")).toHaveClass("meter__track--sm");
  });

  it("merges className, forwards ref and passes rest props", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Meter ref={ref} value={1} className="extra" id="m" />);
    const root = container.firstElementChild;
    expect(ref.current).toBe(root);
    expect(root).toHaveClass("meter", "extra");
    expect(root).toHaveAttribute("id", "m");
  });

  it("prefers tone over the deprecated color without warning", () => {
    const { container } = render(<Meter value={1} tone="info" color="warning" />);
    expect(container.firstElementChild).toHaveAttribute("data-tone", "info");
    expect(warn).not.toHaveBeenCalled();
  });
});
