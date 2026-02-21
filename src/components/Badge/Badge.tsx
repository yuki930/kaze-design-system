import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "positive"
  | "negative"
  | "warning"
  | "info";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
  /** Solid (inverted) style — filled background with white text */
  solid?: boolean;
  /** When true, adds role="status" for live-region announcements */
  live?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { variant = "default", dot, solid, live, className, children, ...rest },
    ref,
  ) => {
    return (
      <span
        ref={ref}
        {...(live ? { role: "status" as const } : {})}
        className={cn(
          "badge",
          `badge--${variant}`,
          solid && "badge--solid",
          className,
        )}
        {...rest}
      >
        {dot && <span className="badge__dot" aria-hidden="true" />}
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
