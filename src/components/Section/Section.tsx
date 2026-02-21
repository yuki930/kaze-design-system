import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* -- Section ------------------------------------------------------- */

export type SectionSize = "sm" | "md" | "lg";
export type SectionBackground = "default" | "muted" | "dark";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  size?: SectionSize;
  background?: SectionBackground;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ size = "md", background = "default", className, children, ...rest }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          "lp-section",
          `lp-section--${size}`,
          background !== "default" && `lp-section--${background}`,
          className,
        )}
        {...rest}
      >
        <div className="lp-section__inner">{children}</div>
      </section>
    );
  },
);

Section.displayName = "Section";

/* -- SectionHeader ------------------------------------------------- */

export interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

export const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ title, description, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("section-header", className)}
        {...rest}
      >
        <h2 className="section-header__title">{title}</h2>
        {description && (
          <p className="section-header__description">{description}</p>
        )}
      </div>
    );
  },
);

SectionHeader.displayName = "SectionHeader";
