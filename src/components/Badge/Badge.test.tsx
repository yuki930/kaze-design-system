import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { resetDeprecationWarnings } from "@/lib/deprecate";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

let warn: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  resetDeprecationWarnings();
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => warn.mockRestore());

describe("Badge", () => {
  it("exposes data-tone and ignores no-warn for tone", () => {
    render(<Badge tone="positive">ok</Badge>);
    expect(screen.getByText("ok")).toHaveAttribute("data-tone", "positive");
    expect(warn).not.toHaveBeenCalled();
  });

  it("still honors deprecated variant and warns once", () => {
    const { rerender } = render(<Badge variant="negative">ng</Badge>);
    rerender(<Badge variant="negative">ng2</Badge>);
    expect(screen.getByText("ng2")).toHaveClass("badge--negative");
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("renders children", () => {
    render(<Badge>新着</Badge>);
    expect(screen.getByText("新着")).toBeInTheDocument();
  });

  it("applies default tone class", () => {
    render(<Badge>デフォルト</Badge>);
    const badge = screen.getByText("デフォルト");
    expect(badge).toHaveClass("badge", "badge--default");
  });

  it("applies positive tone class", () => {
    render(<Badge tone="positive">成功</Badge>);
    const badge = screen.getByText("成功");
    expect(badge).toHaveClass("badge--positive");
  });

  it("applies negative tone class", () => {
    render(<Badge tone="negative">エラー</Badge>);
    const badge = screen.getByText("エラー");
    expect(badge).toHaveClass("badge--negative");
  });

  it("applies warning tone class", () => {
    render(<Badge tone="warning">警告</Badge>);
    const badge = screen.getByText("警告");
    expect(badge).toHaveClass("badge--warning");
  });

  it("applies info tone class", () => {
    render(<Badge tone="info">情報</Badge>);
    const badge = screen.getByText("情報");
    expect(badge).toHaveClass("badge--info");
  });

  it("renders dot indicator when dot prop is true", () => {
    const { container } = render(<Badge dot>通知</Badge>);
    const dot = container.querySelector(".badge__dot");
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveAttribute("aria-hidden", "true");
  });

  it("does not render dot indicator by default", () => {
    const { container } = render(<Badge>通知</Badge>);
    const dot = container.querySelector(".badge__dot");
    expect(dot).not.toBeInTheDocument();
  });
});
