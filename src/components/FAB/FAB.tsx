import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type FABVariant = "primary" | "secondary";
export type FABSize = "sm" | "md" | "lg";
export type FABPosition =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left";

export interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label for the button (required for icon-only FABs) */
  label: string;
  variant?: FABVariant;
  size?: FABSize;
  position?: FABPosition;
  /** When true, shows icon + label side by side */
  extended?: boolean;
}

export const FAB = forwardRef<HTMLButtonElement, FABProps>(
  (
    {
      label,
      variant = "primary",
      size = "md",
      position = "bottom-right",
      extended,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        aria-label={extended ? undefined : label}
        className={cn(
          "fab",
          `fab--${variant}`,
          `fab--${size}`,
          `fab--${position}`,
          extended && "fab--extended",
          className,
        )}
        {...rest}
      >
        {children}
        {extended && <span className="fab__label">{label}</span>}
      </button>
    );
  },
);

FAB.displayName = "FAB";
