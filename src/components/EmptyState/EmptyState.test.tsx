import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders a status region with the title as a heading and md size by default", () => {
    render(<EmptyState title="データがありません" />);
    const status = screen.getByRole("status");
    expect(status).toHaveClass("empty-state", "empty-state--md");
    expect(screen.getByRole("heading", { level: 3, name: "データがありません" })).toHaveClass(
      "empty-state__title",
    );
    expect(status.querySelector(".empty-state__icon")).toBeNull();
    expect(status.querySelector(".empty-state__description")).toBeNull();
    expect(status.querySelector(".empty-state__actions")).toBeNull();
  });

  it("renders icon, description and actions when provided", () => {
    render(
      <EmptyState
        title="空"
        icon={<svg data-testid="icon" />}
        description="条件を変えてください"
        actions={<button type="button">追加</button>}
      />,
    );
    expect(screen.getByTestId("icon").parentElement).toHaveClass("empty-state__icon");
    expect(screen.getByText("条件を変えてください")).toHaveClass("empty-state__description");
    expect(screen.getByRole("button", { name: "追加" }).parentElement).toHaveClass(
      "empty-state__actions",
    );
  });

  it.each(["sm", "lg"] as const)("applies size %s", (size) => {
    render(<EmptyState title="t" size={size} />);
    expect(screen.getByRole("status")).toHaveClass(`empty-state--${size}`);
  });

  it("forwards ref, merges className and passes rest props", () => {
    const ref = createRef<HTMLDivElement>();
    render(<EmptyState ref={ref} title="t" className="extra" id="es" aria-live="polite" />);
    const el = screen.getByRole("status");
    expect(ref.current).toBe(el);
    expect(el).toHaveClass("empty-state", "extra");
    expect(el).toHaveAttribute("id", "es");
    expect(el).toHaveAttribute("aria-live", "polite");
  });
});
