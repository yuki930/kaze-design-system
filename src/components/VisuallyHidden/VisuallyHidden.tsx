import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@/lib/Slot";

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLElement> {
  /** 子要素にスタイルを委ねる（スキップリンクの <a> など） */
  asChild?: boolean;
  /** フォーカスされたときだけ画面に表示する（スキップリンク用） */
  focusable?: boolean;
}

export const VisuallyHidden = forwardRef<HTMLElement, VisuallyHiddenProps>(
  ({ asChild, focusable, className, ...rest }, ref) => {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        ref={ref}
        className={cn("sr-only", focusable && "sr-only--focusable", className)}
        {...rest}
      />
    );
  },
);

VisuallyHidden.displayName = "VisuallyHidden";
