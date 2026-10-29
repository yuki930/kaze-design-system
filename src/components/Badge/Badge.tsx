import { forwardRef, type HTMLAttributes } from "react";
import type { Tone } from "../../lib/types";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  dot?: boolean;
  /** Solid (inverted) style: filled background with white text */
  solid?: boolean;
  /** When true, adds role="status" for live-region announcements */
  live?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ tone = "default", dot, solid, live, className, children, ...rest }, ref) => {
    return (
      <span
        ref={ref}
        {...(live ? { role: "status" as const } : {})}
        data-tone={tone}
        className={cn("badge", `badge--${tone}`, solid && "badge--solid", className)}
        {...rest}
      >
        {dot && <span className="badge__dot" aria-hidden="true" />}
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
