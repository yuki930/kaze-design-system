import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FilterPill } from "./FilterPill";

describe("FilterPill", () => {
  it("renders children", () => {
    render(<FilterPill>カテゴリ</FilterPill>);
    expect(screen.getByText("カテゴリ")).toBeInTheDocument();
  });

  it("renders as a button with type=button", () => {
    render(<FilterPill>テスト</FilterPill>);
    const btn = screen.getByRole("button", { name: "テスト" });
    expect(btn).toHaveAttribute("type", "button");
  });

  it("applies active class and aria-pressed when active", () => {
    render(<FilterPill active>選択中</FilterPill>);
    const btn = screen.getByRole("button", { name: "選択中" });
    expect(btn).toHaveClass("filter-pill", "filter-pill--active");
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  it("sets aria-pressed=false when not active", () => {
    render(<FilterPill>未選択</FilterPill>);
    const btn = screen.getByRole("button", { name: "未選択" });
    expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  it("renders dot when dot prop is true", () => {
    const { container } = render(<FilterPill dot>ドット</FilterPill>);
    const dot = container.querySelector(".filter-pill__dot");
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveAttribute("aria-hidden", "true");
  });

  it("does not render dot by default", () => {
    const { container } = render(<FilterPill>ドットなし</FilterPill>);
    expect(container.querySelector(".filter-pill__dot")).not.toBeInTheDocument();
  });

  it("applies color as CSS custom property", () => {
    render(<FilterPill color="#10b981">カラー</FilterPill>);
    const btn = screen.getByRole("button", { name: "カラー" });
    expect(btn.style.getPropertyValue("--filter-pill-color")).toBe("#10b981");
  });

  it("merges custom className", () => {
    render(<FilterPill className="custom">カスタム</FilterPill>);
    const btn = screen.getByRole("button", { name: "カスタム" });
    expect(btn).toHaveClass("filter-pill", "custom");
  });
});
