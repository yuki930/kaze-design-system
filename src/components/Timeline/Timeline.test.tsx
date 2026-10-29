import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { resetDeprecationWarnings } from "@/lib/deprecate";
import { TimelineItem } from "./Timeline";

let warn: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  resetDeprecationWarnings();
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => warn.mockRestore());

describe("TimelineItem", () => {
  it("applies tone", () => {
    render(<TimelineItem tone="positive" title="done" />);
    const li = screen.getByRole("listitem");
    expect(li).toHaveAttribute("data-tone", "positive");
    expect(li.querySelector(".timeline-item__dot--positive")).not.toBeNull();
    expect(warn).not.toHaveBeenCalled();
  });

  it("still honors deprecated status and warns once", () => {
    const { container, rerender } = render(<TimelineItem status="info" title="a" />);
    rerender(<TimelineItem status="info" title="b" />);
    expect(container.querySelector(".timeline-item__dot--info")).not.toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
  });
});
