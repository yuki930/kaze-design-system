import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { LPFooter, type FooterColumn } from "./LPFooter";

const columns: FooterColumn[] = [
  {
    title: "プロダクト",
    links: [
      { label: "機能", href: "/features" },
      { label: "料金", href: "/pricing" },
    ],
  },
  { title: "会社", links: [{ label: "採用", href: "/careers" }] },
];

describe("LPFooter", () => {
  it("renders a contentinfo landmark with column headings and links", () => {
    render(<LPFooter columns={columns} />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("lp-footer");
    expect(
      within(footer)
        .getAllByRole("heading", { level: 4 })
        .map((h) => h.textContent),
    ).toEqual(["プロダクト", "会社"]);
    expect(screen.getByRole("link", { name: "機能" })).toHaveAttribute("href", "/features");
    expect(screen.getByRole("link", { name: "料金" })).toHaveAttribute("href", "/pricing");
    expect(screen.getByRole("link", { name: "採用" })).toHaveAttribute("href", "/careers");
    expect(screen.getAllByRole("list")).toHaveLength(2);
  });

  it("omits description and bottom slots when not provided", () => {
    const { container } = render(<LPFooter columns={[]} />);
    expect(container.querySelector(".lp-footer__brand-description")).toBeNull();
    expect(container.querySelector(".lp-footer__bottom")?.childElementCount).toBe(0);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("renders logo, description and bottom slots", () => {
    const { container } = render(
      <LPFooter
        columns={[]}
        logo={<img src="/logo.svg" alt="ノルン" />}
        description="チームのための業務基盤"
        bottomLeft={<small>© 2026 ノルン株式会社</small>}
        bottomRight={<a href="/privacy">プライバシー</a>}
      />,
    );
    expect(screen.getByRole("img", { name: "ノルン" })).toHaveAttribute("src", "/logo.svg");
    expect(screen.getByText("チームのための業務基盤")).toHaveClass("lp-footer__brand-description");
    const bottom = container.querySelector(".lp-footer__bottom") as HTMLElement;
    expect(bottom.childElementCount).toBe(2);
    expect(within(bottom).getByText("© 2026 ノルン株式会社")).toBeInTheDocument();
    expect(within(bottom).getByRole("link", { name: "プライバシー" })).toHaveAttribute(
      "href",
      "/privacy",
    );
  });

  it("merges className, forwards ref and passes rest props", () => {
    const ref = createRef<HTMLElement>();
    render(<LPFooter ref={ref} columns={[]} className="extra" id="footer" />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("lp-footer", "extra");
    expect(footer).toHaveAttribute("id", "footer");
    expect(ref.current).toBe(footer);
  });
});
