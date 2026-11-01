import { forwardRef, type CSSProperties, type ElementType, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { resolveGap, type LayoutGap } from "../../lib/gap";

export interface StackProps extends HTMLAttributes<HTMLElement> {
  /** Space between children (default: "md" = --space-4) */
  gap?: LayoutGap;
  /** Cross-axis alignment (default: "stretch") */
  align?: "start" | "center" | "end" | "stretch";
  /** Element to render (default: "div"). Use "ul" / "ol" / "section" when the content calls for it */
  as?: ElementType;
}

/** Vertical stack with even spacing: card bodies, form paragraphs, a run of notes. */
export const Stack = forwardRef<HTMLElement, StackProps>(
  ({ gap = "md", align, as: Tag = "div", className, style, ...rest }, ref) => {
    const vars = { ...style, "--stack-gap": resolveGap(gap) } as CSSProperties;
    return (
      <Tag
        ref={ref}
        className={cn("stack", align && `stack--align-${align}`, className)}
        style={vars}
        {...rest}
      />
    );
  },
);
Stack.displayName = "Stack";
