import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { resetDeprecationWarnings } from "@/lib/deprecate";
import { Alert } from "./Alert";

let warn: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  resetDeprecationWarnings();
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => warn.mockRestore());

describe("Alert", () => {
  it("applies tone class and data-tone", () => {
    render(<Alert tone="negative">x</Alert>);
    const el = screen.getByRole("alert");
    expect(el).toHaveClass("alert--negative");
    expect(el).toHaveAttribute("data-tone", "negative");
    expect(warn).not.toHaveBeenCalled();
  });

  it("defaults to info", () => {
    render(<Alert>x</Alert>);
    expect(screen.getByRole("alert")).toHaveAttribute("data-tone", "info");
  });

  it("still honors deprecated variant and warns once", () => {
    const { rerender } = render(<Alert variant="warning">x</Alert>);
    rerender(<Alert variant="warning">y</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("alert--warning");
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("prefers tone over variant", () => {
    render(
      <Alert tone="positive" variant="warning">
        x
      </Alert>,
    );
    expect(screen.getByRole("alert")).toHaveAttribute("data-tone", "positive");
  });
});
