import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, actions, className, ...rest }, ref) => (
    <div ref={ref} className={cn("empty-state", className)} {...rest}>
      {icon && <span className="empty-state__icon">{icon}</span>}
      <h3 className="empty-state__title">{title}</h3>
      {description && (
        <p className="empty-state__description">{description}</p>
      )}
      {actions && <div className="empty-state__actions">{actions}</div>}
    </div>
  ),
);

EmptyState.displayName = "EmptyState";
