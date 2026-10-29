import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("applies tone class and data-tone", () => {
    render(<Alert tone="negative">x</Alert>);
    const el = screen.getByRole("alert");
    expect(el).toHaveClass("alert--negative");
    expect(el).toHaveAttribute("data-tone", "negative");
  });

  it("defaults to info", () => {
    render(<Alert>x</Alert>);
    expect(screen.getByRole("alert")).toHaveAttribute("data-tone", "info");
  });
});
