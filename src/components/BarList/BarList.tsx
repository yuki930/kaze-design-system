import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BarListItem {
  /** Label text */
  label: string;
  /** Numeric value */
  value: number;
  /** Optional trailing text (e.g. formatted value) */
  displayValue?: string;
  /** Optional bar color */
  color?: string;
  /** Optional link href */
  href?: string;
  /** Render as a different element (default: "a"). Accepts Next.js Link etc. */
  as?: React.ElementType;
}

export interface BarListProps extends HTMLAttributes<HTMLDivElement> {
  /** Array of items to display */
  data: BarListItem[];
  /** Sort order */
  sortOrder?: "ascending" | "descending" | "none";
  /** Value formatter function */
  valueFormatter?: (value: number) => string;
}

export const BarList = forwardRef<HTMLDivElement, BarListProps>(
  ({ data, sortOrder = "descending", valueFormatter, className, ...rest }, ref) => {
    const sorted =
      sortOrder === "none"
        ? data
        : [...data].sort((a, b) =>
            sortOrder === "ascending" ? a.value - b.value : b.value - a.value,
          );

    const maxValue = Math.max(...sorted.map((d) => d.value), 1);

    return (
      <div ref={ref} className={cn("barlist", className)} {...rest}>
        {sorted.map((item, i) => {
          // Negative values draw an empty bar rather than a negative width
          const pct = (Math.max(item.value, 0) / maxValue) * 100;
          // Labels may repeat, so the index keeps keys unique
          const key = `${item.label}-${i}`;
          const display =
            item.displayValue ?? (valueFormatter ? valueFormatter(item.value) : String(item.value));

          const content = (
            <>
              <div className="barlist__bar-wrapper">
                <div
                  className="barlist__bar"
                  style={{
                    width: `${pct}%`,
                    ...(item.color ? { backgroundColor: item.color } : {}),
                  }}
                />
                <span className="barlist__label">{item.label}</span>
              </div>
              <span className="barlist__value">{display}</span>
            </>
          );

          const LinkComponent = item.as ?? "a";

          return item.href ? (
            <LinkComponent key={key} href={item.href} className="barlist__row barlist__row--link">
              {content}
            </LinkComponent>
          ) : (
            <div key={key} className="barlist__row">
              {content}
            </div>
          );
        })}
      </div>
    );
  },
);

BarList.displayName = "BarList";
