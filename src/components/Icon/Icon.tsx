import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  /** A lucide-react icon component */
  icon: LucideIcon;
  /** Size of the icon */
  size?: IconSize;
  /** Accessible label — if omitted, the icon is decorative (aria-hidden) */
  label?: string;
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  ({ icon: LucideComponent, size = "md", label, className, ...rest }, ref) => {
    const sizeMap: Record<IconSize, number> = {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
    };

    return (
      <span
        ref={ref}
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        className={cn("icon", `icon--${size}`, className)}
        {...rest}
      >
        <LucideComponent size={sizeMap[size]} strokeWidth={2} />
      </span>
    );
  },
);

Icon.displayName = "Icon";
