import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SplitSection } from "./SplitSection";

describe("SplitSection", () => {
  it("renders media first and the body second", () => {
    const { container } = render(
      <SplitSection media={<img src="/shot.png" alt="管理画面のスクリーンショット" />}>
        <h2>見出し</h2>
      </SplitSection>,
    );
    const section = container.querySelector("section") as HTMLElement;
    expect(section).toHaveClass("split-section");
    expect(section).not.toHaveClass("split-section--reverse");
    const [media, body] = Array.from(section.children) as HTMLElement[];
    expect(media).toHaveClass("split-section__media");
    expect(body).toHaveClass("split-section__body");
    expect(screen.getByRole("img", { name: "管理画面のスクリーンショット" }).parentElement).toBe(
      media,
    );
    expect(screen.getByRole("heading", { level: 2, name: "見出し" }).parentElement).toBe(body);
    expect(media).not.toHaveAttribute("style");
  });

  it("applies mediaBg as the media background", () => {
    const { container } = render(<SplitSection mediaBg="rgb(10, 20, 30)" />);
    const media = container.querySelector(".split-section__media") as HTMLElement;
    expect(media.style.background).toContain("rgb(10, 20, 30)");
  });

  it("adds the reverse modifier", () => {
    const { container } = render(<SplitSection reverse />);
    expect(container.querySelector("section")).toHaveClass("split-section--reverse");
  });

  it("merges className, forwards ref and passes rest props", () => {
    const ref = createRef<HTMLElement>();
    render(<SplitSection ref={ref} className="extra" aria-label="紹介" />);
    const section = screen.getByRole("region", { name: "紹介" });
    expect(section).toHaveClass("split-section", "extra");
    expect(ref.current).toBe(section);
  });
});
