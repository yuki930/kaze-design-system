import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ── Stats ────────────────────────────────────────────────── */

export interface StatsProps extends HTMLAttributes<HTMLDivElement> {}

export const Stats = forwardRef<HTMLDivElement, StatsProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn("stats", className)} {...rest}>
        {children}
      </div>
    );
  },
);

Stats.displayName = "Stats";

/* ── StatItem ─────────────────────────────────────────────── */

export interface StatItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  label: string;
}

export const StatItem = forwardRef<HTMLDivElement, StatItemProps>(
  ({ value, label, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn("stat", className)} {...rest}>
        <span className="stat__value">{value}</span>
        <span className="stat__label">{label}</span>
      </div>
    );
  },
);

StatItem.displayName = "StatItem";
