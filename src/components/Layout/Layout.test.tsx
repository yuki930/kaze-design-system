import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppLayout } from "./Layout";

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
