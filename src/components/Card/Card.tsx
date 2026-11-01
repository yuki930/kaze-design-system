import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ── Card ──────────────────────────────────────────────────── */

export type CardVariant = "default" | "interactive" | "compact" | "fill";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "card",
          variant === "interactive" && "card--interactive",
          variant === "compact" && "card--compact",
          variant === "fill" && "card--fill",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

/* ── CardHeader ────────────────────────────────────────────── */

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Buttons or links for this card, placed at the end of the header row */
  actions?: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ actions, className, children, ...rest }, ref) => {
    if (!actions) {
      return (
        <div ref={ref} className={cn("card__header", className)} {...rest}>
          {children}
        </div>
      );
    }
    return (
      <div ref={ref} className={cn("card__header", className)} {...rest}>
        <div className="card__header-main">{children}</div>
        <div className="card__actions">{actions}</div>
      </div>
    );
  },
);

CardHeader.displayName = "CardHeader";

/* ── CardTitle ─────────────────────────────────────────────── */

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * Color of a small dot before the title, e.g. "var(--chart-1)". Use it to tie a card to the matching
   * chart series or legend entry; the title text itself stays neutral.
   */
  marker?: string;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ marker, className, children, ...rest }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn("card__title", marker && "card__title--marker", className)}
        {...rest}
      >
        {marker && (
          <span className="card__marker" style={{ background: marker }} aria-hidden="true" />
        )}
        {children}
      </h3>
    );
  },
);

CardTitle.displayName = "CardTitle";

/* ── CardDescription ───────────────────────────────────────── */

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <p ref={ref} className={cn("card__description", className)} {...rest}>
        {children}
      </p>
    );
  },
);

CardDescription.displayName = "CardDescription";

/* ── CardBody ──────────────────────────────────────────────── */

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn("card__body", className)} {...rest}>
        {children}
      </div>
    );
  },
);

CardBody.displayName = "CardBody";

/* ── CardFooter ────────────────────────────────────────────── */

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn("card__footer", className)} {...rest}>
        {children}
      </div>
    );
  },
);

CardFooter.displayName = "CardFooter";
