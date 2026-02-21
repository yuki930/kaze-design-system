import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ── Types ────────────────────────────────────────────────── */

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

/* ── LPFooter ─────────────────────────────────────────────── */

export interface LPFooterProps extends HTMLAttributes<HTMLElement> {
  logo?: ReactNode;
  description?: string;
  columns: FooterColumn[];
  bottomLeft?: ReactNode;
  bottomRight?: ReactNode;
}

export const LPFooter = forwardRef<HTMLElement, LPFooterProps>(
  (
    {
      logo,
      description,
      columns,
      bottomLeft,
      bottomRight,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <footer ref={ref} className={cn("lp-footer", className)} {...rest}>
        <div className="lp-footer__inner">
          <div className="lp-footer__grid">
            <div className="lp-footer__brand">
              {logo}
              {description && (
                <p className="lp-footer__brand-description">{description}</p>
              )}
            </div>
            <div className="lp-footer__nav">
              {columns.map((col) => (
                <div key={col.title}>
                  <h4 className="lp-footer__column-title">{col.title}</h4>
                  <ul className="lp-footer__links">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <a className="lp-footer__link" href={link.href}>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="lp-footer__bottom">
            {bottomLeft && <div>{bottomLeft}</div>}
            {bottomRight && <div>{bottomRight}</div>}
          </div>
        </div>
      </footer>
    );
  },
);

LPFooter.displayName = "LPFooter";
