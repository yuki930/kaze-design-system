import { forwardRef, type HTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* -- Navbar -------------------------------------------------------- */

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  logo?: ReactNode;
  actions?: ReactNode;
  transparent?: boolean;
}

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  ({ logo, actions, transparent, className, children, ...rest }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn(
          "navbar",
          transparent && "navbar--transparent",
          className,
        )}
        {...rest}
      >
        <div className="navbar__left">
          {logo}
          {children}
        </div>
        {actions && <div className="navbar__actions">{actions}</div>}
      </nav>
    );
  },
);

Navbar.displayName = "Navbar";

/* -- NavbarLinks --------------------------------------------------- */

export interface NavbarLinksProps extends HTMLAttributes<HTMLUListElement> {}

export const NavbarLinks = forwardRef<HTMLUListElement, NavbarLinksProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <ul ref={ref} className={cn("navbar__links", className)} {...rest}>
        {children}
      </ul>
    );
  },
);

NavbarLinks.displayName = "NavbarLinks";

/* -- NavbarLink ---------------------------------------------------- */

export interface NavbarLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  /** Render as a different element (default: "a"). Accepts Next.js Link etc. */
  as?: React.ElementType;
}

export const NavbarLink = forwardRef<HTMLElement, NavbarLinkProps>(
  ({ active, as: Component = "a", className, children, ...rest }, ref) => {
    return (
      <li>
        <Component
          ref={ref}
          className={cn(
            "navbar__link",
            active && "navbar__link--active",
            className,
          )}
          {...rest}
        >
          {children}
        </Component>
      </li>
    );
  },
);

NavbarLink.displayName = "NavbarLink";
