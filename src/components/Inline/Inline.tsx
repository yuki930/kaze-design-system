import { forwardRef, type CSSProperties, type ElementType, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { resolveGap, type LayoutGap } from "../../lib/gap";

export interface InlineProps extends HTMLAttributes<HTMLElement> {
  /** Space between children (default: "sm" = --space-2) */
  gap?: LayoutGap;
  /** Wrap onto the next line when there is no room (default: true) */
  wrap?: boolean;
  /** Cross-axis alignment (default: "center") */
  align?: "start" | "center" | "end" | "baseline" | "stretch";
  /** Main-axis distribution (default: "start") */
  justify?: "start" | "center" | "end" | "between";
  /** Element to render (default: "div") */
  as?: ElementType;
}

/** Horizontal row with even spacing that wraps: a group of buttons, filters next to a period switch. */
export const Inline = forwardRef<HTMLElement, InlineProps>(
  (
    { gap = "sm", wrap = true, align, justify, as: Tag = "div", className, style, ...rest },
    ref,
  ) => {
    const vars = { ...style, "--cluster-gap": resolveGap(gap) } as CSSProperties;
    return (
      <Tag
        ref={ref}
        className={cn(
          "cluster",
          !wrap && "cluster--nowrap",
          align && `cluster--align-${align}`,
          justify && `cluster--justify-${justify}`,
          className,
        )}
        style={vars}
        {...rest}
      />
    );
  },
);
Inline.displayName = "Inline";
