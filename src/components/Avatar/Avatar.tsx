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

    return (
      <span
        ref={ref}
        role={showFallback ? "img" : undefined}
        aria-label={showFallback ? fallback : undefined}
        className={cn("avatar", `avatar--${size}`, className)}
        {...rest}
      >
        {src ? (
          <img src={src} alt={alt ?? ""} />
        ) : (
          <span aria-hidden="true">{fallback}</span>
        )}
      </span>
    );
  },
);

Avatar.displayName = "Avatar";
