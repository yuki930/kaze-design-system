import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { resetDeprecationWarnings } from "@/lib/deprecate";
import { Progress } from "./Progress";

let warn: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  resetDeprecationWarnings();
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => warn.mockRestore());

describe("Progress", () => {
  it("applies tone", () => {
    const { container } = render(<Progress value={30} tone="positive" />);
    expect(container.firstElementChild).toHaveAttribute("data-tone", "positive");
    expect(container.querySelector(".progress__fill--positive")).not.toBeNull();
    expect(warn).not.toHaveBeenCalled();
  });

  it("still honors deprecated color and warns once", () => {
    const { container, rerender } = render(<Progress value={30} color="warning" />);
    rerender(<Progress value={40} color="warning" />);
    expect(container.querySelector(".progress__fill--warning")).not.toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
  });
});
