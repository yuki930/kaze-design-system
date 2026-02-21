import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>新着</Badge>);
    expect(screen.getByText("新着")).toBeInTheDocument();
  });

  it("applies default variant class", () => {
    render(<Badge>デフォルト</Badge>);
    const badge = screen.getByText("デフォルト");
    expect(badge).toHaveClass("badge", "badge--default");
  });

  it("applies positive variant class", () => {
    render(<Badge variant="positive">成功</Badge>);
    const badge = screen.getByText("成功");
    expect(badge).toHaveClass("badge--positive");
  });

  it("applies negative variant class", () => {
    render(<Badge variant="negative">エラー</Badge>);
    const badge = screen.getByText("エラー");
    expect(badge).toHaveClass("badge--negative");
  });

  it("applies warning variant class", () => {
    render(<Badge variant="warning">警告</Badge>);
    const badge = screen.getByText("警告");
    expect(badge).toHaveClass("badge--warning");
  });

  it("applies info variant class", () => {
    render(<Badge variant="info">情報</Badge>);
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
