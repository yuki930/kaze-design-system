import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Breadcrumb } from "./Breadcrumb";

describe("Breadcrumb current page", () => {
  it("marks only the last item as the current page", () => {
    render(
      <Breadcrumb
        items={[{ label: "ホーム", href: "/" }, { label: "設定" }, { label: "プロフィール" }]}
      />,
    );
    const current = document.querySelectorAll('[aria-current="page"]');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent("プロフィール");
  });
});

describe("Breadcrumb keys", () => {
  it("keeps one <li> per item when labels repeat across navigations", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const { container, rerender } = render(
      <Breadcrumb items={[{ label: "ホーム" }, { label: "設定" }, { label: "設定" }]} />,
    );
    rerender(<Breadcrumb items={[{ label: "ホーム" }, { label: "設定" }, { label: "通知" }]} />);
    rerender(<Breadcrumb items={[{ label: "ホーム" }, { label: "設定" }, { label: "設定" }]} />);
    rerender(<Breadcrumb items={[{ label: "ホーム" }, { label: "口座" }]} />);
    const items = container.querySelectorAll("li");
    expect([...items].map((li) => li.textContent)).toEqual(["ホーム", "口座"]);
    expect(error.mock.calls.some((c) => String(c[0]).includes("same key"))).toBe(false);
    error.mockRestore();
  });
});
