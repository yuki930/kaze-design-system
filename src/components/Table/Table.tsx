import { forwardRef, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ── Table ─────────────────────────────────────────────────── */

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  compact?: boolean;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ compact, className, children, ...rest }, ref) => {
    return (
      <div className="table-wrapper">
        <table
          ref={ref}
          role="table"
          className={cn("table", compact && "table--compact", className)}
          {...rest}
        >
          {children}
        </table>
      </div>
    );
  },
);

Table.displayName = "Table";

/* ── TableHeader ───────────────────────────────────────────── */

export interface TableHeaderProps
  extends HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(({ className, children, ...rest }, ref) => {
  return (
    <thead ref={ref} className={className} {...rest}>
      {children}
    </thead>
  );
});

TableHeader.displayName = "TableHeader";

/* ── TableBody ─────────────────────────────────────────────── */

export interface TableBodyProps
  extends HTMLAttributes<HTMLTableSectionElement> {}

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

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, scope = "col", ...rest }, ref) => {
    return (
      <th ref={ref} scope={scope} className={className} {...rest}>
        {children}
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
