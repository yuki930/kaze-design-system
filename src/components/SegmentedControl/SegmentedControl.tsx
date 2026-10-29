"use client";

import {
  forwardRef,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";
import type { Size } from "../../lib/types";

export interface SegmentedControlOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue" | "children"> {
  options: SegmentedControlOption[];
  /** Controlled value */
  value?: string;
  /** Initial value when uncontrolled */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: Extract<Size, "sm" | "md">;
  /** Stretch to the container width with equal-width segments */
  fullWidth?: boolean;
  /** Group name, emitted on a hidden input for native form submission */
  name?: string;
  "aria-label": string;
}

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    {
      options,
      value: valueProp,
      defaultValue,
      onValueChange,
      size = "md",
      fullWidth = false,
      name,
      className,
      onKeyDown,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) => {
    const [inner, setInner] = useState(defaultValue);
    const isControlled = valueProp !== undefined;
    const current = isControlled ? valueProp : inner;
    const buttons = useRef<Record<string, HTMLButtonElement | null>>({});

    const enabled = options.filter((o) => !o.disabled);
    const selected = options.find((o) => o.value === current && !o.disabled);
    // roving tabindex: selected one, else the first enabled one
    const tabStop = selected?.value ?? enabled[0]?.value;
    const selectedIndex = selected ? options.indexOf(selected) : -1;

    const select = (v: string) => {
      if (!isControlled) setInner(v);
      if (v !== current) onValueChange?.(v);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || enabled.length === 0) return;
      const focused = (e.target as HTMLElement).closest("[data-value]")?.getAttribute("data-value");
      const from = enabled.findIndex((o) => o.value === focused);
      let next: number;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          next = (from + 1) % enabled.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          next = (from - 1 + enabled.length) % enabled.length;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = enabled.length - 1;
          break;
        default:
          return;
      }
      e.preventDefault();
      const target = enabled[next];
      if (!target) return;
      buttons.current[target.value]?.focus();
      select(target.value);
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={ariaLabel}
        className={cn(
          "segmented-control",
          size !== "md" && `segmented-control--${size}`,
          fullWidth && "segmented-control--full",
          className,
        )}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {selectedIndex >= 0 && (
          <span
            className="segmented-control__indicator"
            aria-hidden="true"
            style={{
              width: `calc((100% - 4px) / ${options.length})`,
              transform: `translateX(${selectedIndex * 100}%)`,
            }}
          />
        )}
        {options.map((o) => {
          const checked = o.value === selected?.value;
          return (
            // biome-ignore lint/a11y/useSemanticElements: custom radiogroup (roving tabindex + sliding pill); native radios cannot render the segment layout
            <button
              key={o.value}
              ref={(el) => {
                buttons.current[o.value] = el;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              data-value={o.value}
              data-state={checked ? "on" : "off"}
              disabled={o.disabled}
              tabIndex={o.value === tabStop ? 0 : -1}
              className="segmented-control__option"
              onClick={() => select(o.value)}
            >
              {o.label}
            </button>
          );
        })}
        {name && <input type="hidden" name={name} value={selected?.value ?? ""} />}
      </div>
    );
  },
);

SegmentedControl.displayName = "SegmentedControl";
