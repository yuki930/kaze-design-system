import { forwardRef, type HTMLAttributes } from "react";
import { renamedProp } from "@/lib/deprecate";
import type { Size, Tone } from "../../lib/types";
import { cn } from "@/lib/utils";

/** @deprecated `Tone` を使う */
export type ProgressColor = Tone;

export type ProgressSize = Extract<Size, "sm" | "md" | "lg">;

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  tone?: Tone;
  /** @deprecated `tone` に改名。次のマイナーで削除 */
  color?: Tone;
  size?: ProgressSize;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    { value, max = 100, label, showValue, tone: toneProp, color, size = "md", className, ...rest },
    ref,
  ) => {
    const tone = renamedProp("Progress", "color", "tone", color, toneProp) ?? "default";
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    return (
      <div ref={ref} data-tone={tone} className={cn("progress", className)} {...rest}>
        {(label || showValue) && (
          <div className="progress__label-row">
            {label && <span className="progress__label">{label}</span>}
            {showValue && <span className="progress__value-text">{Math.round(pct)}%</span>}
          </div>
        )}
        <div
          className={cn("progress__track", size !== "md" && `progress__track--${size}`)}
          role="progressbar"
          aria-label={label}
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          <div
            className={cn("progress__fill", tone !== "default" && `progress__fill--${tone}`)}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  },
);

Progress.displayName = "Progress";
