import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/Avatar/Avatar";

/* ── TestimonialGrid ──────────────────────────────────────── */

export interface TestimonialGridProps
  extends HTMLAttributes<HTMLDivElement> {}

export const TestimonialGrid = forwardRef<
  HTMLDivElement,
  TestimonialGridProps
>(({ className, children, ...rest }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("testimonial-grid", className)}
      {...rest}
    >
      {children}
    </div>
  );
});

TestimonialGrid.displayName = "TestimonialGrid";

/* ── TestimonialCard ──────────────────────────────────────── */

export interface TestimonialCardProps
  extends HTMLAttributes<HTMLDivElement> {
  quote: string;
  authorName: string;
  authorRole?: string;
  authorImage?: string;
  /** Show avatar or initials icon */
  showIcon?: boolean;
}

export const TestimonialCard = forwardRef<
  HTMLDivElement,
  TestimonialCardProps
>(({ quote, authorName, authorRole, authorImage, showIcon, className, ...rest }, ref) => {
  const initials = authorName
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <div ref={ref} className={cn("testimonial", className)} {...rest}>
      <blockquote className="testimonial__quote">{quote}</blockquote>
      <div className="testimonial__author">
        {showIcon &&
          (authorImage ? (
            <Avatar size="sm" src={authorImage} alt={authorName} />
          ) : (
            <span className="testimonial__icon">{initials}</span>
          ))}
        <div>
          <span className="testimonial__name">{authorName}</span>
          {authorRole && (
            <span className="testimonial__role">{authorRole}</span>
          )}
        </div>
      </div>
    </div>
  );
});

TestimonialCard.displayName = "TestimonialCard";
