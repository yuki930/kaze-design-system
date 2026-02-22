import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6;
export type GridGap = "xs" | "sm" | "md" | "lg" | "xl" | (string & {});

const GAP_MAP: Record<string, string> = {
  xs: "var(--space-1)",
  sm: "var(--space-2)",
  md: "var(--space-4)",
  lg: "var(--space-6)",
  xl: "var(--space-8)",
};

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Column count at desktop (default) */
  columns?: GridColumns;
  /** Column count at ≤1024px */
  columnsMd?: GridColumns;
  /** Column count at ≤640px */
  columnsSm?: GridColumns;
  /** Gap between items — semantic token ("sm", "md", etc.) or any CSS value */
  gap?: GridGap;
  /** Gap at ≤1024px — falls back to gap */
  gapMd?: GridGap;
  /** Gap at ≤640px — falls back to gapMd, then gap */
  gapSm?: GridGap;
}

const resolveGap = (v: string) => GAP_MAP[v] ?? v;

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ columns, columnsMd, columnsSm, gap, gapMd, gapSm, className, style, ...rest }, ref) => {
    const vars: CSSProperties = {
      ...style,
      ...(columns != null ? { "--grid-cols": columns } : {}),
      ...(columnsMd != null ? { "--grid-cols-md": columnsMd } : {}),
      ...(columnsSm != null ? { "--grid-cols-sm": columnsSm } : {}),
      ...(gap != null ? { "--grid-gap": resolveGap(gap) } : {}),
      ...(gapMd != null ? { "--grid-gap-md": resolveGap(gapMd) } : {}),
      ...(gapSm != null ? { "--grid-gap-sm": resolveGap(gapSm) } : {}),
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
