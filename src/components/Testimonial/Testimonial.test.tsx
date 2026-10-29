import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TestimonialCard, TestimonialGrid } from "./Testimonial";

describe("TestimonialGrid", () => {
  it("renders children, merges className, forwards ref and rest", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <TestimonialGrid ref={ref} className="extra" data-testid="grid">
        <span>子</span>
      </TestimonialGrid>,
    );
    const grid = screen.getByTestId("grid");
    expect(grid).toHaveClass("testimonial-grid", "extra");
    expect(ref.current).toBe(grid);
    expect(screen.getByText("子")).toBeInTheDocument();
  });
});

describe("TestimonialCard", () => {
  it("renders the quote in a blockquote and the author without an icon by default", () => {
    const { container } = render(
      <TestimonialCard quote="導入して作業時間が半分になりました" authorName="相楽 実咲" />,
    );
    const quote = screen.getByText("導入して作業時間が半分になりました");
    expect(quote.tagName).toBe("BLOCKQUOTE");
    expect(screen.getByText("相楽 実咲")).toHaveClass("testimonial__name");
    expect(container.querySelector(".testimonial__role")).toBeNull();
    expect(container.querySelector(".testimonial__icon")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
  });

  it("renders the author role", () => {
    render(<TestimonialCard quote="q" authorName="堀内 昌平" authorRole="SRE" />);
    expect(screen.getByText("SRE")).toHaveClass("testimonial__role");
  });

  it("shows initials (up to two) when showIcon is set without an image", () => {
    const { container } = render(
      <TestimonialCard quote="q" authorName="Misaki Sagara Extra" showIcon />,
    );
    expect(container.querySelector(".testimonial__icon")).toHaveTextContent(/^MS$/);
    expect(container.querySelector("img")).toBeNull();
  });

  it("shows the author image with the author name as alt when showIcon and authorImage are set", () => {
    const { container } = render(
      <TestimonialCard quote="q" authorName="宮田 千夏" authorImage="/miyata.jpg" showIcon />,
    );
    expect(screen.getByRole("img", { name: "宮田 千夏" })).toHaveAttribute("src", "/miyata.jpg");
    expect(container.querySelector(".testimonial__icon")).toBeNull();
  });

  it("ignores authorImage when showIcon is off", () => {
    const { container } = render(
      <TestimonialCard quote="q" authorName="呉羽 直樹" authorImage="/kureha.jpg" />,
    );
    expect(container.querySelector("img")).toBeNull();
  });

  it("merges className, forwards ref and passes rest props", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <TestimonialCard ref={ref} data-testid="card" className="extra" quote="q" authorName="a" />,
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveClass("testimonial", "extra");
    expect(ref.current).toBe(card);
  });
});
