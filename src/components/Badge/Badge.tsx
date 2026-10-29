import { forwardRef, type HTMLAttributes } from "react";
import { renamedProp } from "@/lib/deprecate";
import type { Tone } from "../../lib/types";
import { cn } from "@/lib/utils";

/** @deprecated `Tone` を使う */
export type BadgeVariant = Tone;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  /** @deprecated `tone` に改名。次のマイナーで削除 */
  variant?: Tone;
  dot?: boolean;
  /** Solid (inverted) style: filled background with white text */
  solid?: boolean;
  /** When true, adds role="status" for live-region announcements */
  live?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ tone: toneProp, variant, dot, solid, live, className, children, ...rest }, ref) => {
    const tone = renamedProp("Badge", "variant", "tone", variant, toneProp) ?? "default";
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
