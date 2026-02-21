import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Divider } from "./Divider";

describe("Divider", () => {
  it("renders divider element as hr", () => {
    render(<Divider />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("applies divider class", () => {
    render(<Divider />);
    const divider = screen.getByRole("separator");
    expect(divider).toHaveClass("divider");
  });

  it("applies subtle class", () => {
    render(<Divider subtle />);
    const divider = screen.getByRole("separator");
    expect(divider).toHaveClass("divider", "divider--subtle");
  });

  it("renders text when provided", () => {
    render(<Divider text="または" />);
    expect(screen.getByText("または")).toBeInTheDocument();
  });

  it("renders as div when text is provided", () => {
    render(<Divider text="区切り" />);
    const element = screen.getByText("区切り");
    expect(element).toHaveClass("divider-text");
    expect(element.tagName).toBe("DIV");
  });

  it("renders as hr when no text is provided", () => {
    render(<Divider />);
    const divider = screen.getByRole("separator");
    expect(divider.tagName).toBe("HR");
  });
});
