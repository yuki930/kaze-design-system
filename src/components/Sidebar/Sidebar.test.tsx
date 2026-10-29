import { createRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NavItem, Sidebar, SidebarDivider, SidebarGroupLabel } from "./Sidebar";

describe("Sidebar", () => {
  it("labels the nav landmark with a Japanese default", () => {
    render(
      <Sidebar>
        <NavItem>ホーム</NavItem>
      </Sidebar>,
    );
    expect(screen.getByRole("navigation", { name: "メインナビゲーション" })).toBeInTheDocument();
  });

  it("accepts a custom nav label", () => {
    render(
      <Sidebar navLabel="管理メニュー">
        <NavItem>ホーム</NavItem>
      </Sidebar>,
    );
    expect(screen.getByRole("navigation", { name: "管理メニュー" })).toBeInTheDocument();
  });
});

describe("NavItem", () => {
  it("renders a button by default", () => {
    render(<NavItem>ホーム</NavItem>);
    const item = screen.getByRole("button", { name: "ホーム" });
    expect(item).toHaveAttribute("type", "button");
  });

  it("renders an anchor when href is given", () => {
    render(<NavItem href="/home">ホーム</NavItem>);
    expect(screen.getByRole("link", { name: "ホーム" })).toHaveAttribute("href", "/home");
  });

  it("respects an explicit `as` even with href", () => {
    render(
      <NavItem as="span" href="/home">
        ホーム
      </NavItem>,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("ホーム").tagName).toBe("SPAN");
  });

  it("sets aria-current=page when active", () => {
    render(
      <>
        <NavItem href="/a" active>
          A
        </NavItem>
        <NavItem href="/b">B</NavItem>
      </>,
    );
    expect(screen.getByRole("link", { name: "A" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "A" })).toHaveClass("nav-item--active");
    expect(screen.getByRole("link", { name: "B" })).not.toHaveAttribute("aria-current");
  });

  it("lends its class and aria-current to the child when asChild", () => {
    render(
      <NavItem asChild active icon={<i />}>
        <a href="/home">ホーム</a>
      </NavItem>,
    );
    const link = screen.getByRole("link", { name: "ホーム" });
    expect(link).toHaveClass("nav-item", "nav-item--active");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("prefers asChild over `as`", () => {
    render(
      <NavItem asChild as="span">
        <a href="/home">ホーム</a>
      </NavItem>,
    );
    expect(screen.getByRole("link", { name: "ホーム" })).toHaveClass("nav-item");
  });
});

describe("Sidebar slots", () => {
  it("omits logo and footer by default", () => {
    const { container } = render(
      <Sidebar>
        <NavItem>ホーム</NavItem>
      </Sidebar>,
    );
    expect(container.querySelector(".sidebar__logo")).toBeNull();
    expect(container.querySelector(".sidebar__footer")).toBeNull();
    expect(screen.getByRole("complementary")).toHaveClass("sidebar");
  });

  it("renders logo and footer, merges className, forwards ref and rest", () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <Sidebar
        ref={ref}
        className="extra"
        id="side"
        logo={<img src="/logo.svg" alt="ノルン" />}
        footer={<span>相楽 実咲</span>}
      >
        <NavItem>ホーム</NavItem>
      </Sidebar>,
    );
    const aside = screen.getByRole("complementary");
    expect(ref.current).toBe(aside);
    expect(aside).toHaveClass("sidebar", "extra");
    expect(aside).toHaveAttribute("id", "side");
    expect(container.querySelector(".sidebar__logo")).toContainElement(
      screen.getByRole("img", { name: "ノルン" }),
    );
    expect(container.querySelector(".sidebar__footer")).toHaveTextContent("相楽 実咲");
  });
});

describe("NavItem extras", () => {
  it("renders the icon before the label and forwards ref", () => {
    const ref = createRef<HTMLElement>();
    render(
      <NavItem ref={ref} icon={<svg data-testid="icon" />} className="extra">
        ホーム
      </NavItem>,
    );
    const button = screen.getByRole("button", { name: "ホーム" });
    expect(ref.current).toBe(button);
    expect(button).toHaveClass("nav-item", "extra");
    expect(screen.getByTestId("icon").parentElement).toHaveClass("nav-item__icon");
    expect(button.firstElementChild).toHaveClass("nav-item__icon");
  });

  it("does not set type on a non-button element", () => {
    render(<NavItem href="/a">A</NavItem>);
    expect(screen.getByRole("link", { name: "A" })).not.toHaveAttribute("type");
  });
});

describe("SidebarGroupLabel", () => {
  it("renders children, merges className, forwards ref and rest", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <SidebarGroupLabel ref={ref} className="extra" id="g">
        設定
      </SidebarGroupLabel>,
    );
    const label = screen.getByText("設定");
    expect(ref.current).toBe(label);
    expect(label).toHaveClass("sidebar__group-label", "extra");
    expect(label).toHaveAttribute("id", "g");
  });
});

describe("SidebarDivider", () => {
  it("renders a separator, merges className and forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<SidebarDivider ref={ref} className="extra" />);
    const sep = screen.getByRole("separator");
    expect(ref.current).toBe(sep);
    expect(sep).toHaveClass("sidebar__divider", "extra");
  });
});
