import { createElement, forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface PanelHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  /** Controls for this section, placed at the end of the title row */
  actions?: ReactNode;
  /** Heading level of the title (default: 2) */
  level?: 2 | 3 | 4;
}

/**
 * Heading row for a block inside an application page: title, description and actions for that block.
 * For landing pages use the Marketing `Section` / `SectionHeader` instead.
 */
export const PanelHeader = forwardRef<HTMLDivElement, PanelHeaderProps>(
  ({ title, description, actions, level = 2, className, ...rest }, ref) => (
    <div ref={ref} className={cn("panel-header", className)} {...rest}>
      <div className="panel-header__main">
        {createElement(
          `h${level}`,
          { className: cn("panel-header__title", `panel-header__title--${level}`) },
          title,
        )}
        {description && <p className="panel-header__description">{description}</p>}
      </div>
      {actions && <div className="panel-header__actions">{actions}</div>}
    </div>
  ),
);
PanelHeader.displayName = "PanelHeader";
