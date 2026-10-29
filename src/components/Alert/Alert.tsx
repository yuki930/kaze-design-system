import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import type { Tone } from "../../lib/types";
import { cn } from "@/lib/utils";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  icon?: ReactNode;
  title?: string;
  children: ReactNode;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ tone = "info", icon, title, className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        data-tone={tone}
        className={cn("alert", `alert--${tone}`, className)}
        {...rest}
      >
        {icon && <span className="alert__icon">{icon}</span>}
        <div className="alert__content">
          {title && <p className="alert__title">{title}</p>}
          <div className="alert__description">{children}</div>
        </div>
      </div>
    );
  },
);

Alert.displayName = "Alert";
