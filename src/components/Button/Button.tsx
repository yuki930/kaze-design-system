import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  iconOnly?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth,
      iconOnly,
      disabled,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        {...(disabled ? { "aria-disabled": true } : {})}
        className={cn(
          "btn",
          `btn--${variant}`,
          `btn--${size}`,
          fullWidth && "btn--full",
          iconOnly && "btn--icon",
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
