import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ChartLegendItem {
  /** Series key (matches the chart's series key) */
  key: string;
  /** Display label */
  label: string;
  /** Swatch color (any CSS color, e.g. "var(--chart-1)") */
  color: string;
}

export interface ChartLegendProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "hidden" | "onToggle"> {
  items: ChartLegendItem[];
  /** Keys of series that are currently hidden (rendered dimmed) */
  hidden?: readonly string[];
  /** When provided, items become toggle buttons (aria-pressed) */
  onToggle?: (key: string) => void;
}

export const ChartLegend = forwardRef<HTMLDivElement, ChartLegendProps>(
  ({ items, hidden = [], onToggle, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn("chart-legend", className)} {...rest}>
        {items.map((item) => {
          const isHidden = hidden.includes(item.key);
          const content = (
            <>
              <span
                className="chart-legend__swatch"
                style={{ background: item.color }}
                aria-hidden="true"
              />
              <span className="chart-legend__label">{item.label}</span>
            </>
          );
          return onToggle ? (
            <button
              key={item.key}
              type="button"
              className={cn("chart-legend__item", isHidden && "chart-legend__item--hidden")}
              aria-pressed={!isHidden}
              onClick={() => onToggle(item.key)}
            >
              {content}
            </button>
          ) : (
            <span
              key={item.key}
              className={cn("chart-legend__item", isHidden && "chart-legend__item--hidden")}
            >
              {content}
            </span>
          );
        })}
      </div>
    );
  },
);
ChartLegend.displayName = "ChartLegend";
