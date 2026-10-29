import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Link } from "./Link";

describe("Link", () => {
  it("renders an anchor with the link class", () => {
    render(<Link href="/settings">請求書の設定</Link>);
    const a = screen.getByRole("link", { name: "請求書の設定" });
    expect(a).toHaveAttribute("href", "/settings");
    expect(a).toHaveClass("link");
    expect(a).not.toHaveAttribute("target");
  });

  it("opens external links in a new tab with an arrow and a spoken note", () => {
    const { container } = render(
      <Link href="https://example.com" external>
        ヘルプセンター
      </Link>,
    );
    const a = screen.getByRole("link", { name: "ヘルプセンター（新しいタブで開きます）" });
    expect(a).toHaveAttribute("target", "_blank");
    expect(a).toHaveAttribute("rel", "noopener noreferrer");
    expect(container.querySelector(".link__external")).toHaveAttribute("aria-hidden", "true");
  });

  it("lets externalLabel replace the spoken note", () => {
    render(
      <Link href="https://example.com" external externalLabel="(opens in a new tab)">
        Help
      </Link>,
    );
    expect(screen.getByRole("link", { name: /opens in a new tab/ })).toBeInTheDocument();
  });

  it("renders the child element with asChild and keeps the external extras inside it", () => {
    render(
      <Link asChild external>
        <a href="/help" data-x="1">
          ヘルプ
        </a>
      </Link>,
    );
    const a = screen.getByRole("link");
    expect(a).toHaveClass("link");
    expect(a).toHaveAttribute("data-x", "1");
    expect(a).toHaveAttribute("target", "_blank");
    expect(a.querySelector(".link__external")).not.toBeNull();
    expect(a.textContent).toContain("ヘルプ");
  });

  it("asChild without external leaves the child alone", () => {
    render(
      <Link asChild>
        <a href="/help">ヘルプ</a>
      </Link>,
    );
    expect(screen.getByRole("link")).toHaveTextContent(/^ヘルプ$/);
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Link ref={ref} href="/">
        x
      </Link>,
    );
    expect(ref.current?.tagName).toBe("A");
  });
});
