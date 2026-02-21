import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface MetricChange {
  value: string;
  trend: "positive" | "negative";
}

export interface MetricProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  large?: boolean;
  change?: MetricChange;
}

export const Metric = forwardRef<HTMLDivElement, MetricProps>(
  ({ label, value, large, change, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn("metric", className)} {...rest}>
        <span className="metric__label">{label}</span>
        <span
          className={cn("metric__value", large && "metric__value--lg")}
        >
          {value}
        </span>
        {change && (
          <span
            className={cn(
              "metric__change",
              `metric__change--${change.trend}`,
            )}
          >
            {change.value}
          </span>
        )}
      </div>
    );
  },
);

Metric.displayName = "Metric";
