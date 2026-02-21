import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/chartColors";

export interface BarChartItem {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "aria-label"> {
  data: BarChartItem[];
  max?: number;
  formatValue?: (value: number) => string;
  /** Accessible label for the chart (required for accessibility) */
  "aria-label": string;
}

export const BarChart = forwardRef<HTMLDivElement, BarChartProps>(
  ({ data, max, formatValue, "aria-label": ariaLabel, className, ...rest }, ref) => {
    const maxVal = max ?? Math.max(...data.map((d) => d.value));
    const fmt = formatValue ?? ((v: number) => String(v));

    return (
      <div ref={ref} role="img" aria-label={ariaLabel} className={cn("bar-chart", className)} {...rest}>
        {data.map((item, i) => {
          const pct = maxVal > 0 ? (item.value / maxVal) * 100 : 0;
          const color = item.color ?? CHART_COLORS[i % CHART_COLORS.length];
          return (
            <div key={item.label} className="bar-chart__item">
              <span className="bar-chart__label">{item.label}</span>
              <span className="bar-chart__track">
                <span
                  className="bar-chart__fill"
                  style={{ width: `${pct}%`, background: color }}
                />
              </span>
              <span className="bar-chart__value">{fmt(item.value)}</span>
            </div>
          );
        })}
      </div>
    );
  },
);
BarChart.displayName = "BarChart";
