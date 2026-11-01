import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface ToolbarProps extends Omit<HTMLAttributes<HTMLDivElement>, "aria-label"> {
  /** Controls placed at the end of the row (e.g. export, settings) */
  end?: ReactNode;
  /** Name of the toolbar for assistive technology (required) */
  "aria-label": string;
}

/**
 * Row of controls above a table or chart: filters and switches at the start, secondary actions at the end.
 * Wraps on narrow screens; the end group drops below the start group.
 */
export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(
  ({ end, className, children, ...rest }, ref) => (
    <div ref={ref} role="toolbar" className={cn("toolbar", className)} {...rest}>
      <div className="toolbar__start">{children}</div>
      {end && <div className="toolbar__end">{end}</div>}
    </div>
  ),
);
Toolbar.displayName = "Toolbar";
