import { forwardRef, type ComponentType, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

/** Any icon component accepting `size` / `strokeWidth` (e.g. a lucide-react icon).
 *  Typed structurally so the published types don't require lucide-react. */
export type IconComponent = ComponentType<{
  size?: number | string;
  strokeWidth?: number | string;
}>;

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  /** An icon component such as a lucide-react icon */
  icon: IconComponent;
  /** Size of the icon */
  size?: IconSize;
  /** Accessible label. If omitted, the icon is decorative (aria-hidden) */
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
