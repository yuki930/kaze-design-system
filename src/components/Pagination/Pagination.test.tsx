import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("labels each page button and marks the current page", () => {
    render(<Pagination page={3} totalPages={10} />);
    expect(screen.getByRole("navigation", { name: "ページネーション" })).toBeInTheDocument();
    const current = screen.getByRole("button", { name: "3ページ目" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveTextContent("3");
    expect(screen.getByRole("button", { name: "4ページ目" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("button", { name: "前のページ" })).toBeEnabled();
  });

  it("accepts a custom page label formatter", () => {
    render(<Pagination page={1} totalPages={3} pageLabel={(p) => `Page ${p}`} />);
    expect(screen.getByRole("button", { name: "Page 2" })).toBeInTheDocument();
  });

  it("hides the ellipsis from assistive tech and calls onPageChange", () => {
    const onPageChange = vi.fn();
    const { container } = render(
      <Pagination page={5} totalPages={10} onPageChange={onPageChange} />,
    );
    for (const el of container.querySelectorAll(".pagination__ellipsis")) {
      expect(el).toHaveAttribute("aria-hidden", "true");
    }
    fireEvent.click(screen.getByRole("button", { name: "次のページ" }));
    expect(onPageChange).toHaveBeenCalledWith(6);
  });
});

describe("Pagination API", () => {
  it("works uncontrolled with defaultPage", () => {
    const onPageChange = vi.fn();
    render(<Pagination defaultPage={2} totalPages={5} onPageChange={onPageChange} />);
    expect(screen.getByRole("button", { name: "2ページ目" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    fireEvent.click(screen.getByRole("button", { name: "3ページ目" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole("button", { name: "3ページ目" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("does not move on its own when page is controlled", () => {
    render(<Pagination page={1} totalPages={5} />);
    fireEvent.click(screen.getByRole("button", { name: "5ページ目" }));
    expect(screen.getByRole("button", { name: "1ページ目" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
