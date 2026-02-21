import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type AlertVariant = "info" | "positive" | "warning" | "negative";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  icon?: ReactNode;
  title?: string;
  children: ReactNode;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = "info", icon, title, className, children, ...rest }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn("alert", `alert--${variant}`, className)}
      {...rest}
    >
      {icon && <span className="alert__icon">{icon}</span>}
      <div className="alert__content">
        {title && <p className="alert__title">{title}</p>}
        <div className="alert__description">{children}</div>
      </div>
    </div>
  ),
);

Alert.displayName = "Alert";
