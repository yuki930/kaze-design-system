import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ width, height, circle, className, style, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn("skeleton", circle && "skeleton--circle", className)}
      style={{ width, height, ...style }}
      aria-hidden="true"
      {...rest}
    />
  ),
);

Skeleton.displayName = "Skeleton";
