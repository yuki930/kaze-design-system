import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type AvatarSize = "xs" | "sm" | "md" | "lg";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  size?: AvatarSize;
  src?: string;
  alt?: string;
  fallback?: string;
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ size = "md", src, alt, fallback, className, ...rest }, ref) => {
    const showFallback = !src && fallback;
    // Only expose role="img" + aria-label together when the text fallback is shown.
    const a11yProps = showFallback ? { role: "img", "aria-label": fallback } : {};

    return (
      <span
        ref={ref}
        {...a11yProps}
        className={cn("avatar", `avatar--${size}`, className)}
        {...rest}
      >
        {src ? <img src={src} alt={alt ?? ""} /> : <span aria-hidden="true">{fallback}</span>}
      </span>
    );
  },
);

Avatar.displayName = "Avatar";
