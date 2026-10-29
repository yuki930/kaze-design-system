import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { Size } from "../../lib/types";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";

export type SpinnerSize = Extract<Size, "sm" | "md" | "lg">;

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** 14 / 18 / 24px */
  size?: SpinnerSize;
  /** 読み上げ用の文言 */
  label?: string;
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ size = "md", label = "読み込み中", className, ...rest }, ref) => (
    <span
      ref={ref}
      role="status"
      className={cn("spinner", `spinner--${size}`, className)}
      {...rest}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
    </span>
  ),
);

Spinner.displayName = "Spinner";
