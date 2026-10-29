import { forwardRef, type ButtonHTMLAttributes, type ElementType, type MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@/lib/Slot";
import type { Size } from "../../lib/types";

export type FABVariant = "primary" | "secondary";
export type FABSize = Extract<Size, "sm" | "md" | "lg">;
export type FABPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";

export interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label for the button (required for icon-only FABs) */
  label: string;
  variant?: FABVariant;
  size?: FABSize;
  position?: FABPosition;
  /** When true, shows icon + label side by side */
  extended?: boolean;
  /** 子要素にスタイルと振る舞いを委ねる（Next.js の Link など） */
  asChild?: boolean;
}

export const FAB = forwardRef<HTMLButtonElement, FABProps>(
  (
    {
      label,
      variant = "primary",
      size = "md",
      position = "bottom-right",
      extended,
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
        {asChild ? (
          children
        ) : (
          <>
            {children}
            {extended && <span className="fab__label">{label}</span>}
          </>
        )}
      </Comp>
    );
  },
);

FAB.displayName = "FAB";
