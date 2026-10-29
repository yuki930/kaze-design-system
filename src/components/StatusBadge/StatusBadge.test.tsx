import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { resetDeprecationWarnings } from "@/lib/deprecate";
import { StatusBadge } from "./StatusBadge";

let warn: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  resetDeprecationWarnings();
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => warn.mockRestore());

describe("StatusBadge", () => {
  it("maps status to tone without warning", () => {
    render(<StatusBadge status="stale" />);
    const el = screen.getByText("要更新");
    expect(el).toHaveAttribute("data-tone", "warning");
    expect(el).toHaveClass("badge--warning");
    expect(warn).not.toHaveBeenCalled();
  });
});
