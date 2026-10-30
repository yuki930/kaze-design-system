import { forwardRef, useContext, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AppLayoutMenuButton, AppLayoutNavContext } from "../Layout/Layout";

export interface TopBarProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  actions?: ReactNode;
}

export const TopBar = forwardRef<HTMLElement, TopBarProps>(
  ({ children, actions, className, ...rest }, ref) => {
    const nav = useContext(AppLayoutNavContext);
    return (
      <header ref={ref} className={cn("top-bar", className)} {...rest}>
        <div className={nav ? "top-bar__lead" : undefined}>
          <AppLayoutMenuButton />
          {children}
        </div>
        {actions && <div className="top-bar__actions">{actions}</div>}
      </header>
    );
  },
);

TopBar.displayName = "TopBar";
