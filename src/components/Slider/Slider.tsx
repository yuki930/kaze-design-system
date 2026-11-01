"use client";

import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type InputHTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";

export interface SliderProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "defaultValue" | "onChange" | "min" | "max" | "step"
  > {
  /** Visible label (required unless aria-label is given) */
  label?: string;
  /** Current value (controlled) */
  value?: number;
  /** Initial value (uncontrolled) */
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Formats the value shown next to the label and read out by screen readers */
  formatValue?: (value: number) => string;
  /** Show the formatted value next to the label (default: true) */
  showValue?: boolean;
  /** Values to mark under the track, e.g. [0, 50, 100] */
  marks?: number[];
  /** Help text under the slider */
  description?: string;
}

/** Pick a number from a range by dragging or with the arrow keys. Use for values people tune while watching a result. */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      label,
      value: valueProp,
      defaultValue,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      formatValue = (v) => String(v),
      showValue = true,
      marks,
      description,
      className,
      id: idProp,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const id = idProp ?? autoId;
    const [internal, setInternal] = useState(defaultValue ?? min);
    const controlled = valueProp !== undefined;
    const value = controlled ? valueProp : internal;
    const clamped = Math.min(max, Math.max(min, value));
    const progress = max === min ? 0 : ((clamped - min) / (max - min)) * 100;

    const handle = (e: ChangeEvent<HTMLInputElement>) => {
      const next = Number(e.target.value);
      if (!controlled) setInternal(next);
      onValueChange?.(next);
    };

    return (
      <div className={cn("slider", disabled && "slider--disabled", className)}>
        {(label || showValue) && (
          <div className="slider__header">
            {label && (
              <label className="slider__label" htmlFor={id}>
                {label}
              </label>
            )}
            {showValue && (
              <output className="slider__value" htmlFor={id}>
                {formatValue(clamped)}
              </output>
            )}
          </div>
        )}
        <input
          {...rest}
          ref={ref}
          id={id}
          type="range"
          className="slider__input"
          min={min}
          max={max}
          step={step}
          value={clamped}
          onChange={handle}
          disabled={disabled}
          aria-valuetext={formatValue(clamped)}
          aria-describedby={
            [rest["aria-describedby"], description ? `${id}-description` : undefined]
              .filter(Boolean)
              .join(" ") || undefined
          }
          style={{ ...rest.style, "--slider-progress": `${progress}%` } as CSSProperties}
        />
        {marks && marks.length > 0 && (
          <div className="slider__marks" aria-hidden="true">
            {marks.map((m) => (
              <span
                key={m}
                className="slider__mark"
                style={{ left: `${max === min ? 0 : ((m - min) / (max - min)) * 100}%` }}
              >
                {formatValue(m)}
              </span>
            ))}
          </div>
        )}
        {description && (
          <p className="slider__description" id={`${id}-description`}>
            {description}
          </p>
        )}
      </div>
    );
  },
);
Slider.displayName = "Slider";
