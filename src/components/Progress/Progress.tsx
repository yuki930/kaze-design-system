import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ProgressColor =
  | "default"
  | "positive"
  | "negative"
  | "warning"
  | "info";

export type ProgressSize = "sm" | "md" | "lg";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: ProgressColor;
  size?: ProgressSize;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value,
      max = 100,
      label,
      showValue,
      color = "default",
      size = "md",
      className,
      ...rest
    },
    ref,
  ) => {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    return (
      <div ref={ref} className={cn("progress", className)} {...rest}>
        {(label || showValue) && (
          <div className="progress__label-row">
            {label && <span className="progress__label">{label}</span>}
            {showValue && (
              <span className="progress__value-text">{Math.round(pct)}%</span>
            )}
          </div>
        )}
        <div
          className={cn(
            "progress__track",
            size !== "md" && `progress__track--${size}`,
          )}
          role="progressbar"
          aria-label={label}
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          <div
            className={cn(
              "progress__fill",
              color !== "default" && `progress__fill--${color}`,
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  },
);

Progress.displayName = "Progress";
