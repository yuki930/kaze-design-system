import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ── CTABanner ────────────────────────────────────────────── */

export interface CTABannerProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

export const CTABanner = forwardRef<HTMLDivElement, CTABannerProps>(
  ({ title, description, className, children, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn("cta-banner", className)} {...rest}>
        <h2 className="cta-banner__title">{title}</h2>
        {description && (
          <p className="cta-banner__description">{description}</p>
        )}
        {children && <div className="cta-banner__actions">{children}</div>}
      </div>
    );
  },
);

CTABanner.displayName = "CTABanner";
