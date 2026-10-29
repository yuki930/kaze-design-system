import { createRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar, NavbarLink, NavbarLinks } from "./Navbar";

describe("NavbarLink", () => {
  it("renders an anchor by default", () => {
    render(
      <NavbarLinks>
        <NavbarLink href="/a">A</NavbarLink>
      </NavbarLinks>,
    );
    expect(screen.getByRole("link", { name: "A" })).toHaveClass("navbar__link");
  });

  it("lends class and aria-current to the child when asChild", () => {
    render(
      <NavbarLinks>
        <NavbarLink asChild active>
          <a href="/a">A</a>
        </NavbarLink>
      </NavbarLinks>,
    );
    const link = screen.getByRole("link", { name: "A" });
    expect(link).toHaveClass("navbar__link", "navbar__link--active");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveAttribute("href", "/a");
  });
});

describe("Navbar", () => {
  it("renders a navigation landmark with logo and children on the left", () => {
    const { container } = render(
      <Navbar logo={<img src="/logo.svg" alt="ノルン" />} aria-label="グローバル">
        <NavbarLinks>
          <NavbarLink href="/features">機能</NavbarLink>
        </NavbarLinks>
      </Navbar>,
    );
    const nav = screen.getByRole("navigation", { name: "グローバル" });
    expect(nav).toHaveClass("navbar");
    expect(nav).not.toHaveClass("navbar--transparent");
    const left = container.querySelector(".navbar__left") as HTMLElement;
    expect(left).toContainElement(screen.getByRole("img", { name: "ノルン" }));
    expect(left).toContainElement(screen.getByRole("link", { name: "機能" }));
    expect(container.querySelector(".navbar__actions")).toBeNull();
  });

  it("renders the actions slot and the transparent modifier", () => {
    const { container } = render(<Navbar transparent actions={<a href="/login">ログイン</a>} />);
    expect(screen.getByRole("navigation")).toHaveClass("navbar--transparent");
    expect(container.querySelector(".navbar__actions")).toContainElement(
      screen.getByRole("link", { name: "ログイン" }),
    );
  });

  it("merges className, forwards ref and passes rest props", () => {
    const ref = createRef<HTMLElement>();
    render(<Navbar ref={ref} className="extra" id="nav" />);
    const nav = screen.getByRole("navigation");
    expect(ref.current).toBe(nav);
    expect(nav).toHaveClass("navbar", "extra");
    expect(nav).toHaveAttribute("id", "nav");
  });
});

describe("NavbarLinks", () => {
  it("renders a list, merges className and forwards ref", () => {
    const ref = createRef<HTMLUListElement>();
    render(<NavbarLinks ref={ref} className="extra" />);
    const list = screen.getByRole("list");
    expect(ref.current).toBe(list);
    expect(list).toHaveClass("navbar__links", "extra");
  });
});

describe("NavbarLink options", () => {
  it("wraps the link in a list item and is not current by default", () => {
    render(
      <NavbarLinks>
        <NavbarLink href="/a">A</NavbarLink>
      </NavbarLinks>,
    );
    const link = screen.getByRole("link", { name: "A" });
    expect(link.parentElement?.tagName).toBe("LI");
    expect(link).not.toHaveAttribute("aria-current");
    expect(link).not.toHaveClass("navbar__link--active");
    expect(link).toHaveAttribute("href", "/a");
  });

  it("marks the active link with aria-current=page", () => {
    render(
      <NavbarLinks>
        <NavbarLink href="/a" active className="extra">
          A
        </NavbarLink>
      </NavbarLinks>,
    );
    const link = screen.getByRole("link", { name: "A" });
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveClass("navbar__link", "navbar__link--active", "extra");
  });

  it("renders the element given by `as` and forwards ref", () => {
    const ref = createRef<HTMLElement>();
    render(
      <NavbarLinks>
        <NavbarLink as="button" ref={ref}>
          メニュー
        </NavbarLink>
      </NavbarLinks>,
    );
    const button = screen.getByRole("button", { name: "メニュー" });
    expect(button).toHaveClass("navbar__link");
    expect(ref.current).toBe(button);
  });
});
