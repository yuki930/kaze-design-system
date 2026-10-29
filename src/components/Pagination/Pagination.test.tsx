import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("labels each page button and marks the current page", () => {
    render(<Pagination currentPage={3} totalPages={10} />);
    expect(screen.getByRole("navigation", { name: "ページネーション" })).toBeInTheDocument();
    const current = screen.getByRole("button", { name: "3ページ目" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveTextContent("3");
    expect(screen.getByRole("button", { name: "4ページ目" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("button", { name: "前のページ" })).toBeEnabled();
  });

  it("accepts a custom page label formatter", () => {
    render(<Pagination currentPage={1} totalPages={3} pageLabel={(p) => `Page ${p}`} />);
    expect(screen.getByRole("button", { name: "Page 2" })).toBeInTheDocument();
  });

  it("hides the ellipsis from assistive tech and calls onPageChange", () => {
    const onPageChange = vi.fn();
    const { container } = render(
      <Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />,
    );
    for (const el of container.querySelectorAll(".pagination__ellipsis")) {
      expect(el).toHaveAttribute("aria-hidden", "true");
    }
    fireEvent.click(screen.getByRole("button", { name: "次のページ" }));
    expect(onPageChange).toHaveBeenCalledWith(6);
  });
});
