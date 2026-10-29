import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("maps status to tone without warning", () => {
    render(<StatusBadge status="stale" />);
    const el = screen.getByText("要更新");
    expect(el).toHaveAttribute("data-tone", "warning");
    expect(el).toHaveClass("badge--warning");
  });
});
