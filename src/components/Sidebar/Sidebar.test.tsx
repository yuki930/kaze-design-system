import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NavItem, Sidebar } from "./Sidebar";

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
