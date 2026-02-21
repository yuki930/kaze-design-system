import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* -- FeatureGrid --------------------------------------------------- */

export type FeatureGridColumns = 2 | 3 | 4;

export interface FeatureGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: FeatureGridColumns;
}

export const FeatureGrid = forwardRef<HTMLDivElement, FeatureGridProps>(
  ({ columns = 3, className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "feature-grid",
          columns !== 3 && `feature-grid--cols-${columns}`,
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

FeatureGrid.displayName = "FeatureGrid";

/* -- FeatureCard --------------------------------------------------- */

export interface FeatureCardProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description: string;
}

export const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ icon, title, description, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn("feature-card", className)} {...rest}>
        {icon && <div className="feature-card__icon">{icon}</div>}
        <h3 className="feature-card__title">{title}</h3>
        <p className="feature-card__description">{description}</p>
      </div>
    );
  },
);

FeatureCard.displayName = "FeatureCard";
