import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { Size } from "../../lib/types";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";

export type TypingIndicatorSize = Extract<Size, "sm" | "md" | "lg">;

export interface TypingIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  /** 14 / 18 / 24px */
  size?: TypingIndicatorSize;
  /** 読み上げ用の文言。誰が入力中かは「宮田 千夏さんが入力中」のように渡す */
  label?: string;
}

export const TypingIndicator = forwardRef<HTMLSpanElement, TypingIndicatorProps>(
  ({ size = "md", label = "入力中", className, ...rest }, ref) => (
    <span
      ref={ref}
      role="status"
      className={cn("typing-indicator", `typing-indicator--${size}`, className)}
      {...rest}
    >
      <span className="typing-indicator__dot" aria-hidden="true" />
      <span className="typing-indicator__dot" aria-hidden="true" />
      <span className="typing-indicator__dot" aria-hidden="true" />
      <VisuallyHidden>{label}</VisuallyHidden>
    </span>
  ),
);

TypingIndicator.displayName = "TypingIndicator";
