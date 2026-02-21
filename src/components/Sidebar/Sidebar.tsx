import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  logo?: ReactNode;
  footer?: ReactNode;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ children, logo, footer, className, ...rest }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn("sidebar", className)}
        {...rest}
      >
        {logo && <div className="sidebar__logo">{logo}</div>}
        <nav className="sidebar__nav">{children}</nav>
        {footer && <div className="sidebar__footer">{footer}</div>}
      </aside>
    );
  },
);

Sidebar.displayName = "Sidebar";

/* ── NavItem ────────────────────────────────────────────── */

export interface NavItemProps extends HTMLAttributes<HTMLElement> {
  icon?: ReactNode;
  active?: boolean;
  children: ReactNode;
  /** Render as a different element (default: "button"). Accepts "a", "button", or a component like Next.js Link. */
  as?: React.ElementType;
  /** Allow href for anchor/link usage */
  href?: string;
}

export const NavItem = forwardRef<HTMLElement, NavItemProps>(
  ({ icon, active, as: Component = "button", className, children, ...rest }, ref) => {
    const typeAttr = Component === "button" ? { type: "button" as const } : {};

    return (
      <Component
        ref={ref}
        className={cn("nav-item", active && "nav-item--active", className)}
        {...typeAttr}
        {...rest}
      >
        {icon && <span className="nav-item__icon">{icon}</span>}
        {children}
      </Component>
    );
  },
);

NavItem.displayName = "NavItem";
