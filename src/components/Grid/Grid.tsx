import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6;

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Column count at desktop (default) */
  columns?: GridColumns;
  /** Column count at ≤1024px */
  columnsMd?: GridColumns;
  /** Column count at ≤640px */
  columnsSm?: GridColumns;
  /** Gap between items — any CSS value */
  gap?: string;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ columns, columnsMd, columnsSm, gap, className, style, ...rest }, ref) => {
    const vars: CSSProperties = {
      ...style,
      ...(columns != null ? { "--grid-cols": columns } : {}),
      ...(columnsMd != null ? { "--grid-cols-md": columnsMd } : {}),
      ...(columnsSm != null ? { "--grid-cols-sm": columnsSm } : {}),
      ...(gap != null ? { "--grid-gap": gap } : {}),
    } as CSSProperties;

    return (
      <div
        ref={ref}
        className={cn("grid", className)}
        style={vars}
        {...rest}
      />
    );
  },
);

Grid.displayName = "Grid";
