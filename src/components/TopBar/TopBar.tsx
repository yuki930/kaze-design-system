import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TopBarProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  actions?: ReactNode;
}

export const TopBar = forwardRef<HTMLElement, TopBarProps>(
  ({ children, actions, className, ...rest }, ref) => {
    return (
      <header
        ref={ref}
        className={cn("top-bar", className)}
        {...rest}
      >
        <div>{children}</div>
        {actions && <div className="top-bar__actions">{actions}</div>}
      </header>
    );
  },
);

TopBar.displayName = "TopBar";
