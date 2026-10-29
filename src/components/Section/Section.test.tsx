import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Section, SectionHeader } from "./Section";

describe("Section", () => {
  it("defaults to md size and the default background", () => {
    const { container } = render(<Section>中身</Section>);
    const section = container.querySelector("section") as HTMLElement;
    expect(section).toHaveClass("lp-section", "lp-section--md");
    expect(section).not.toHaveClass("lp-section--default");
    expect(screen.getByText("中身")).toHaveClass("lp-section__inner");
  });

  it.each(["sm", "lg"] as const)("applies size %s", (size) => {
    const { container } = render(<Section size={size} />);
    expect(container.querySelector("section")).toHaveClass(`lp-section--${size}`);
  });

  it.each(["muted", "dark"] as const)("applies background %s", (background) => {
    const { container } = render(<Section background={background} />);
    expect(container.querySelector("section")).toHaveClass(`lp-section--${background}`);
  });

  it("merges className, forwards ref and passes rest props", () => {
    const ref = createRef<HTMLElement>();
    render(<Section ref={ref} className="extra" aria-label="機能" id="features" />);
    const section = screen.getByRole("region", { name: "機能" });
    expect(section).toHaveClass("lp-section", "extra");
    expect(section).toHaveAttribute("id", "features");
    expect(ref.current).toBe(section);
  });
});

describe("SectionHeader", () => {
  it("renders the title as h2 without a description by default", () => {
    const { container } = render(<SectionHeader title="選ばれる理由" />);
    expect(screen.getByRole("heading", { level: 2, name: "選ばれる理由" })).toHaveClass(
      "section-header__title",
    );
    expect(container.querySelector(".section-header__description")).toBeNull();
  });

  it("renders the description, merges className, forwards ref and rest", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <SectionHeader
        ref={ref}
        data-testid="header"
        className="extra"
        title="t"
        description="説明文"
      />,
    );
    const header = screen.getByTestId("header");
    expect(header).toHaveClass("section-header", "extra");
    expect(ref.current).toBe(header);
    expect(screen.getByText("説明文")).toHaveClass("section-header__description");
  });
});
