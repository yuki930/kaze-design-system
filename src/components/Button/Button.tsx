import { forwardRef, type ButtonHTMLAttributes, type ElementType, type MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@/lib/Slot";
import type { Size } from "../../lib/types";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";

export type ButtonSize = Extract<Size, "xs" | "sm" | "md" | "lg">;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  iconOnly?: boolean;
  /** 子要素にスタイルと振る舞いを委ねる（Next.js の Link など） */
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth,
      iconOnly,
      disabled,
      asChild,
      className,
      children,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const Comp: ElementType = asChild ? Slot : "button";
    // <a> に disabled は効かないので、属性ではなく aria-disabled とクリック抑止で表す
    const disabledProps = asChild
      ? {
          "aria-disabled": true,
          "data-disabled": "",
          onClick: (e: MouseEvent<HTMLElement>) => e.preventDefault(),
        }
      : { disabled, "aria-disabled": true };
    return (
      <Comp
        ref={ref}
        onClick={onClick}
        {...(disabled ? disabledProps : {})}
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
      </Comp>
    );
  },
);

Button.displayName = "Button";
