import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CTABanner } from "./CTABanner";

describe("CTABanner", () => {
  it("renders the title as an h2 and omits optional parts", () => {
    const { container } = render(<CTABanner title="今すぐ始めよう" />);
    expect(screen.getByRole("heading", { level: 2, name: "今すぐ始めよう" })).toBeInTheDocument();
    expect(container.querySelector(".cta-banner__description")).toBeNull();
    expect(container.querySelector(".cta-banner__actions")).toBeNull();
  });

  it("renders the description and wraps children in the actions slot", () => {
    const { container } = render(
      <CTABanner title="無料で試す" description="14日間すべての機能を使えます">
        <a href="/signup">登録する</a>
      </CTABanner>,
    );
    expect(screen.getByText("14日間すべての機能を使えます")).toHaveClass("cta-banner__description");
    const link = screen.getByRole("link", { name: "登録する" });
    expect(link).toHaveAttribute("href", "/signup");
    expect(link.parentElement).toBe(container.querySelector(".cta-banner__actions"));
  });

  it("merges className, forwards ref and passes rest props", () => {
    const ref = createRef<HTMLDivElement>();
    render(<CTABanner ref={ref} title="t" className="extra" data-testid="cta" id="cta" />);
    const root = screen.getByTestId("cta");
    expect(root).toHaveClass("cta-banner", "extra");
    expect(root).toHaveAttribute("id", "cta");
    expect(ref.current).toBe(root);
  });
});
