import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  siblingCount?: number;
  /** Accessible label for the nav element (default: "ページネーション") */
  label?: string;
  /** Accessible label for the previous button (default: "前のページ") */
  prevLabel?: string;
  /** Accessible label for the next button (default: "次のページ") */
  nextLabel?: string;
}

type PageItem = number | "ellipsis-start" | "ellipsis-end";

function getPages(current: number, total: number, siblings: number): PageItem[] {
  const range: PageItem[] = [];
  const left = Math.max(2, current - siblings);
  const right = Math.min(total - 1, current + siblings);

  range.push(1);
  if (left > 2) range.push("ellipsis-start");
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push("ellipsis-end");
  if (total > 1) range.push(total);
  return range;
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      siblingCount = 1,
      label = "ページネーション",
      prevLabel = "前のページ",
      nextLabel = "次のページ",
      className,
      ...rest
    },
    ref,
  ) => {
    const pages = getPages(currentPage, totalPages, siblingCount);
    return (
      <nav ref={ref} aria-label={label} className={cn("pagination", className)} {...rest}>
        <button
          type="button"
          className="pagination__btn"
          disabled={currentPage <= 1}
          onClick={() => onPageChange?.(currentPage - 1)}
          aria-label={prevLabel}
        >
          ‹
        </button>
        {pages.map((page) =>
          typeof page === "string" ? (
            <span key={page} className="pagination__ellipsis">
              …
            </span>
          ) : (
            <button
              type="button"
              key={page}
              className={cn("pagination__btn", page === currentPage && "pagination__btn--active")}
              onClick={() => onPageChange?.(page)}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          ),
        )}
        <button
          type="button"
          className="pagination__btn"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
          aria-label={nextLabel}
        >
          ›
        </button>
      </nav>
    );
  },
);

Pagination.displayName = "Pagination";
