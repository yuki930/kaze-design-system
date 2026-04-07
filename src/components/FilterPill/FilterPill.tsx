import { forwardRef, type ButtonHTMLAttributes, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface FilterPillProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether the pill is in an active/selected state */
  active?: boolean;
  /** Dynamic accent color (CSS color value). Applied via --filter-pill-color custom property */
  color?: string;
  /** Show a colored dot indicator before the label */
  dot?: boolean;
}

export const FilterPill = forwardRef<HTMLButtonElement, FilterPillProps>(
  ({ active, color, dot, className, style, children, ...rest }, ref) => {
    const pillStyle: CSSProperties | undefined = color
      ? { ...style, "--filter-pill-color": color } as CSSProperties
      : style;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "filter-pill",
          active && "filter-pill--active",
          className,
        )}
        style={pillStyle}
        aria-pressed={active}
        {...rest}
      >
        {dot && <span className="filter-pill__dot" aria-hidden="true" />}
        {children}
      </button>
    );
  },
);

FilterPill.displayName = "FilterPill";
