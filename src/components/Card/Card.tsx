import { forwardRef, type HTMLAttributes } from "react";
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

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn("card__header", className)} {...rest}>
        {children}
      </div>
    );
  },
);

CardHeader.displayName = "CardHeader";

/* ── CardTitle ─────────────────────────────────────────────── */

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <h3 ref={ref} className={cn("card__title", className)} {...rest}>
        {children}
      </h3>
    );
  },
);

CardTitle.displayName = "CardTitle";

/* ── CardDescription ───────────────────────────────────────── */

export interface CardDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, children, ...rest }, ref) => {
  return (
    <p ref={ref} className={cn("card__description", className)} {...rest}>
      {children}
    </p>
  );
});

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
