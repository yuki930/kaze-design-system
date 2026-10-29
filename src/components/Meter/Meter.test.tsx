import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
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
