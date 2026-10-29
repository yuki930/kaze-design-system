import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Pagination } from "./Pagination";
import { resetDeprecationWarnings } from "@/lib/deprecate";

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

let warn: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  resetDeprecationWarnings();
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  warn.mockRestore();
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

  it("keeps the deprecated currentPage working and warns once", () => {
    const { rerender } = render(<Pagination currentPage={3} totalPages={5} />);
    rerender(<Pagination currentPage={4} totalPages={5} />);
    expect(screen.getByRole("button", { name: "4ページ目" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("prefers page over currentPage", () => {
    render(<Pagination page={2} currentPage={4} totalPages={5} />);
    expect(screen.getByRole("button", { name: "2ページ目" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
