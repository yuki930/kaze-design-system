import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Metric } from "./Metric";

describe("Metric", () => {
  it("renders label and value", () => {
    render(<Metric label="売上" value="1,234,567" />);
    expect(screen.getByText("売上")).toBeInTheDocument();
    expect(screen.getByText("1,234,567")).toBeInTheDocument();
  });

  it("renders numeric value", () => {
    render(<Metric label="件数" value={42} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("shows change with positive styling", () => {
    render(
      <Metric
        label="売上"
        value="1,000"
        change={{ value: "+12%", trend: "positive" }}
      />,
    );
    const change = screen.getByText("+12%");
    expect(change).toBeInTheDocument();
    expect(change).toHaveClass("metric__change", "metric__change--positive");
  });

  it("shows change with negative styling", () => {
    render(
      <Metric
        label="売上"
        value="800"
        change={{ value: "-5%", trend: "negative" }}
      />,
    );
    const change = screen.getByText("-5%");
    expect(change).toBeInTheDocument();
    expect(change).toHaveClass("metric__change", "metric__change--negative");
  });

  it("does not render change when not provided", () => {
    const { container } = render(<Metric label="売上" value="1,000" />);
    const change = container.querySelector(".metric__change");
    expect(change).not.toBeInTheDocument();
  });

  it("applies large class when large prop is true", () => {
    render(<Metric label="総売上" value="10,000,000" large />);
    const value = screen.getByText("10,000,000");
    expect(value).toHaveClass("metric__value", "metric__value--lg");
  });

  it("does not apply large class by default", () => {
    render(<Metric label="売上" value="1,000" />);
    const value = screen.getByText("1,000");
    expect(value).toHaveClass("metric__value");
    expect(value).not.toHaveClass("metric__value--lg");
  });
});
