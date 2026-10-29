import {
  forwardRef,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

/* ── Table ─────────────────────────────────────────────────── */

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  compact?: boolean;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ compact, className, children, ...rest }, ref) => {
    return (
      <div className="table-wrapper">
        <table ref={ref} className={cn("table", compact && "table--compact", className)} {...rest}>
          {children}
        </table>
      </div>
    );
  },
);

Table.displayName = "Table";

/* ── TableHeader ───────────────────────────────────────────── */

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <thead ref={ref} className={className} {...rest}>
        {children}
      </thead>
    );
  },
);

TableHeader.displayName = "TableHeader";

/* ── TableBody ─────────────────────────────────────────────── */

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <tbody ref={ref} className={className} {...rest}>
        {children}
      </tbody>
    );
  },
);

TableBody.displayName = "TableBody";

/* ── TableRow ──────────────────────────────────────────────── */

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <tr ref={ref} className={className} {...rest}>
        {children}
      </tr>
    );
  },
);

TableRow.displayName = "TableRow";

/* ── TableHead ─────────────────────────────────────────────── */

export type SortDirection = "ascending" | "descending" | "none";

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** 並べ替えの状態。none は並べ替えていない列（aria-sort は付かない） */
  sortDirection?: SortDirection;
  /** 指定すると見出しがボタンになる。押したときの並べ替えを呼び出し側で行う */
  onSort?: () => void;
}

const sortIconPaths: Record<SortDirection, string> = {
  none: "M3.5 4.5 6 2l2.5 2.5M3.5 7.5 6 10l2.5-2.5",
  descending: "M3 4.5 6 7.5 9 4.5",
  ascending: "M3 7.5 6 4.5 9 7.5",
};

function SortIcon({ direction }: { direction: SortDirection }) {
  return (
    <svg
      className={cn("table__sort-icon", direction === "none" && "table__sort-icon--idle")}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d={sortIconPaths[direction]} />
    </svg>
  );
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, scope = "col", sortDirection = "none", onSort, ...rest }, ref) => {
    return (
      <th
        ref={ref}
        scope={scope}
        className={className}
        aria-sort={sortDirection === "none" ? undefined : sortDirection}
        {...rest}
      >
        {onSort ? (
          <button type="button" className="table__sort" onClick={onSort}>
            {children}
            <SortIcon direction={sortDirection} />
          </button>
        ) : (
          children
        )}
      </th>
    );
  },
);

TableHead.displayName = "TableHead";

/* ── TableCell ─────────────────────────────────────────────── */

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <td ref={ref} className={className} {...rest}>
        {children}
      </td>
    );
  },
);

TableCell.displayName = "TableCell";
