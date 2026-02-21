import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* -- PricingGrid --------------------------------------------------- */

export interface PricingGridProps extends HTMLAttributes<HTMLDivElement> {}

export const PricingGrid = forwardRef<HTMLDivElement, PricingGridProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn("pricing-grid", className)} {...rest}>
        {children}
      </div>
    );
  },
);

PricingGrid.displayName = "PricingGrid";

/* -- PricingCard --------------------------------------------------- */

export interface PricingCardProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  description?: string;
  price: string;
  period?: string;
  features: string[];
  featured?: boolean;
  badge?: string;
}

export const PricingCard = forwardRef<HTMLDivElement, PricingCardProps>(
  (
    {
      name,
      description,
      price,
      period,
      features,
      featured,
      badge,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "pricing-card",
          featured && "pricing-card--featured",
          className,
        )}
        {...rest}
      >
        {badge && <span className="pricing-card__badge">{badge}</span>}
        <h3 className="pricing-card__name">{name}</h3>
        {description && (
          <p className="pricing-card__description">{description}</p>
        )}
        <div className="pricing-card__price">
          <span className="pricing-card__amount">{price}</span>
          {period && <span className="pricing-card__period">/{period}</span>}
        </div>
        <ul className="pricing-card__features">
          {features.map((feature) => (
            <li key={feature} className="pricing-card__feature">
              <svg
                className="pricing-card__check"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M13.5 4.5L6.5 11.5L2.5 7.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        {children}
      </div>
    );
  },
);

PricingCard.displayName = "PricingCard";
