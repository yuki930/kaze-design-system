import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type MeterColor = "default" | "positive" | "negative" | "warning" | "info";

export interface MeterProps extends HTMLAttributes<HTMLDivElement> {
  /** Current value */
  value: number;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Threshold for warning zone (optional, expressed as fraction 0-1) */
  warningThreshold?: number;
  /** Threshold for danger zone (optional, expressed as fraction 0-1) */
  dangerThreshold?: number;
  /** Label text */
  label?: string;
  /** Show percentage text */
  showValue?: boolean;
  /** Color variant (overrides threshold-based coloring) */
  color?: MeterColor;
  /** Size */
  size?: "sm" | "md" | "lg";
}

function autoColor(pct: number, warn: number, danger: number): MeterColor {
  if (pct >= danger) return "negative";
  if (pct >= warn) return "warning";
  return "positive";
}

export const Meter = forwardRef<HTMLDivElement, MeterProps>(
  (
    {
      value,
      min = 0,
      max = 100,
      warningThreshold = 0.7,
      dangerThreshold = 0.9,
      label,
      showValue,
      color,
      size = "md",
      className,
      ...rest
    },
    ref,
  ) => {
    const range = max - min || 1;
    const pct = Math.min(1, Math.max(0, (value - min) / range));
    const resolvedColor = color ?? autoColor(pct, warningThreshold, dangerThreshold);

    return (
      <div ref={ref} className={cn("meter", className)} {...rest}>
        {(label || showValue) && (
          <div className="meter__label-row">
            {label && <span className="meter__label">{label}</span>}
            {showValue && (
              <span className="meter__value-text">
                {value} / {max}
              </span>
            )}
          </div>
        )}
        <div
          className={cn(
            "meter__track",
            size !== "md" && `meter__track--${size}`,
          )}
          role="meter"
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-label={label}
        >
          <div
            className={cn(
              "meter__fill",
              resolvedColor !== "default" && `meter__fill--${resolvedColor}`,
            )}
            style={{ width: `${pct * 100}%` }}
          />
          {/* Threshold markers */}
          {warningThreshold < 1 && (
            <div
              className="meter__marker"
              style={{ left: `${warningThreshold * 100}%` }}
              aria-hidden="true"
            />
          )}
          {dangerThreshold < 1 && (
            <div
              className="meter__marker"
              style={{ left: `${dangerThreshold * 100}%` }}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    );
  },
);

Meter.displayName = "Meter";
