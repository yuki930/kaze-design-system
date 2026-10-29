import { forwardRef, type HTMLAttributes } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  /** Render as a different element (default: "a"). Accepts Next.js Link etc. */
  as?: React.ElementType;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  /** Accessible label for the nav element (default: "パンくず") */
  label?: string;
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, label = "パンくず", className, ...rest }, ref) => (
    <nav ref={ref} aria-label={label} className={className} {...rest}>
      <ol className="breadcrumb">
        {items.map((item, i) => {
          const LinkComponent = item.as ?? "a";
          const isLast = i === items.length - 1;
          return (
            <li key={item.href ?? item.label} className="breadcrumb__item">
              {!isLast && item.href ? (
                <LinkComponent href={item.href} className="breadcrumb__link">
                  {item.label}
                </LinkComponent>
              ) : isLast ? (
                <span className="breadcrumb__current" aria-current="page">
                  {item.label}
                </span>
              ) : (
                // A middle item without href is plain text, not the current page
                <span className="breadcrumb__text">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  ),
);

Breadcrumb.displayName = "Breadcrumb";
