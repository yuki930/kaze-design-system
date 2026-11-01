import { createElement, forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  /** One or two sentences under the title */
  description?: ReactNode;
  /** Buttons for the whole page, placed at the end of the title row */
  actions?: ReactNode;
  /** Breadcrumb shown above the title */
  breadcrumb?: ReactNode;
  /** Heading level of the title (default: 1) */
  level?: 1 | 2;
}

/** Top of a page: breadcrumb, title, description and page actions. */
export const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(
  ({ title, description, actions, breadcrumb, level = 1, className, ...rest }, ref) => (
    <header ref={ref} className={cn("page-header", className)} {...rest}>
      {breadcrumb && <div className="page-header__breadcrumb">{breadcrumb}</div>}
      <div className="page-header__row">
        <div className="page-header__main">
          {createElement(`h${level}`, { className: "page-header__title" }, title)}
          {description && <p className="page-header__description">{description}</p>}
        </div>
        {actions && <div className="page-header__actions">{actions}</div>}
      </div>
    </header>
  ),
);
PageHeader.displayName = "PageHeader";
