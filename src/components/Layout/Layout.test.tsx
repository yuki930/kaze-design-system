import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { TopBar } from "../TopBar/TopBar";
import { AppLayout } from "./Layout";

const settle = () => act(async () => new Promise((r) => setTimeout(r, 300)));
const sidebar = (
  <aside>
    <a href="/a">ホーム</a>
    <button type="button">操作</button>
  </aside>
);
const drawer = () => document.querySelector<HTMLElement>('[role="dialog"]');
const withTopBar = (props: Record<string, unknown> = {}) => (
  <AppLayout sidebar={sidebar} topbar={<TopBar>T</TopBar>} {...props}>
    C
  </AppLayout>
);

describe("AppLayout nav drawer (below 768px)", () => {
  const menuButton = (name = "メニュー") => screen.getByRole("button", { name });

  it("keeps the sidebar out of the drawer until it is opened", () => {
    render(withTopBar());
    expect(drawer()).toBeNull();
    expect(screen.getAllByRole("link", { name: "ホーム" })).toHaveLength(1);
  });

  it("draws the menu button inside TopBar with the dialog aria contract", () => {
    render(withTopBar());
    const btn = menuButton();
    expect(screen.getByRole("banner")).toContainElement(btn);
    expect(btn).toHaveAttribute("aria-haspopup", "dialog");
    expect(btn).toHaveAttribute("aria-expanded", "false");
    expect(btn).not.toHaveAttribute("aria-controls");
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    expect(btn).toHaveAttribute("data-state", "open");
    expect(drawer()).toHaveAttribute("id", btn.getAttribute("aria-controls"));
    expect(drawer()).toHaveAttribute("aria-label", "メニュー");
    expect(drawer()).toHaveAttribute("data-side", "left");
  });

  it("does not draw the button in a TopBar outside AppLayout", () => {
    render(<TopBar>T</TopBar>);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("closes on Escape and returns focus to the menu button", async () => {
    render(withTopBar());
    const btn = menuButton();
    btn.focus();
    fireEvent.click(btn);
    await settle();
    expect(drawer()).toContainElement(document.activeElement as HTMLElement);
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    await settle();
    expect(drawer()).toBeNull();
    expect(btn).toHaveAttribute("aria-expanded", "false");
    expect(btn).toHaveFocus();
  });

  it("closes when a link inside the drawer is clicked, not for other controls", async () => {
    render(withTopBar());
    fireEvent.click(menuButton());
    const inDrawer = within(drawer() as HTMLElement);
    fireEvent.click(inDrawer.getByRole("button", { name: "操作" }));
    expect(drawer()).not.toBeNull();
    fireEvent.click(inDrawer.getByRole("link", { name: "ホーム" }));
    await settle();
    expect(drawer()).toBeNull();
  });

  it("works uncontrolled with defaultNavOpen and reports changes", async () => {
    const onNavOpenChange = vi.fn();
    render(withTopBar({ defaultNavOpen: true, onNavOpenChange }));
    expect(drawer()).not.toBeNull();
    fireEvent.click(menuButton());
    expect(onNavOpenChange).toHaveBeenCalledWith(false);
    await settle();
    expect(drawer()).toBeNull();
  });

  it("stays put when controlled until the caller updates navOpen", () => {
    const onNavOpenChange = vi.fn();
    const { rerender } = render(withTopBar({ navOpen: false, onNavOpenChange }));
    fireEvent.click(menuButton());
    expect(onNavOpenChange).toHaveBeenCalledWith(true);
    expect(drawer()).toBeNull();
    rerender(withTopBar({ navOpen: true, onNavOpenChange }));
    expect(drawer()).not.toBeNull();
  });

  it("renders a minimal bar with only the button when there is no topbar", () => {
    render(<AppLayout sidebar={sidebar}>C</AppLayout>);
    const btn = menuButton();
    expect(btn.parentElement).toHaveClass("app-layout__bar");
    expect(btn.parentElement?.nextElementSibling).toBe(screen.getByRole("main"));
  });

  it("uses navLabel for the button and the drawer", () => {
    render(withTopBar({ navLabel: "ナビゲーション" }));
    fireEvent.click(menuButton("ナビゲーション"));
    expect(drawer()).toHaveAttribute("aria-label", "ナビゲーション");
  });

  it("draws neither button nor drawer without a sidebar", () => {
    render(<AppLayout topbar={<TopBar>T</TopBar>}>C</AppLayout>);
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("AppLayout", () => {
  it("renders children inside the main landmark", () => {
    render(<AppLayout>本文</AppLayout>);
    const main = screen.getByRole("main");
    expect(main).toHaveClass("app-layout__content");
    expect(main).toHaveTextContent("本文");
    expect(main.parentElement).toHaveClass("app-layout__main");
  });

  it("places the sidebar before the main column and the topbar above the content", () => {
    render(
      <AppLayout sidebar={<nav aria-label="サイド">S</nav>} topbar={<header>T</header>}>
        C
      </AppLayout>,
    );
    const nav = screen.getByRole("navigation", { name: "サイド" });
    const mainCol = screen.getByRole("main").parentElement as HTMLElement;
    expect(nav.nextElementSibling).toBe(mainCol);
    expect(screen.getByRole("banner").nextElementSibling).toBe(screen.getByRole("main"));
  });

  it("forwards ref, merges className and passes rest props", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <AppLayout ref={ref} className="extra" data-testid="l">
        C
      </AppLayout>,
    );
    const el = screen.getByTestId("l");
    expect(ref.current).toBe(el);
    expect(el).toHaveClass("app-layout", "extra");
  });
});
