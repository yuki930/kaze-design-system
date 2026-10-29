import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TopBar } from "./TopBar";

describe("TopBar", () => {
  it("renders a header landmark with children and no actions slot by default", () => {
    render(<TopBar>ダッシュボード</TopBar>);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("top-bar");
    expect(header).toHaveTextContent("ダッシュボード");
    expect(header.querySelector(".top-bar__actions")).toBeNull();
  });

  it("renders actions in their own slot after the content", () => {
    render(<TopBar actions={<button type="button">設定</button>}>タイトル</TopBar>);
    const actions = screen.getByRole("button", { name: "設定" }).parentElement as HTMLElement;
    expect(actions).toHaveClass("top-bar__actions");
    expect(actions.previousElementSibling).toHaveTextContent("タイトル");
  });

  it("forwards ref, merges className and passes rest props", () => {
    const ref = createRef<HTMLElement>();
    render(<TopBar ref={ref} className="extra" aria-label="上部バー" />);
    const header = screen.getByRole("banner", { name: "上部バー" });
    expect(ref.current).toBe(header);
    expect(header).toHaveClass("top-bar", "extra");
  });
});
