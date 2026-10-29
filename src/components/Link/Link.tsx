import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@/lib/Slot";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";
import { wrapSlotChild } from "../_internal/slotChildren";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 子要素にスタイルを委ねる（Next.js の Link など） */
  asChild?: boolean;
  /** 別サイトへのリンク。新しいタブで開き、末尾に ↗ を付ける */
  external?: boolean;
  /** external のときの読み上げ文言 */
  externalLabel?: string;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    { asChild, external, externalLabel = "（新しいタブで開きます）", className, children, ...rest },
    ref,
  ) => {
    const Comp = asChild ? Slot : "a";
    const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
    const suffix: ReactNode = external ? (
      <>
        <span className="link__external" aria-hidden="true">
          ↗
        </span>
        <VisuallyHidden>{externalLabel}</VisuallyHidden>
      </>
    ) : null;
    return (
      <Comp ref={ref} className={cn("link", className)} {...externalProps} {...rest}>
        {asChild ? (
          wrapSlotChild(children, undefined, suffix)
        ) : (
          <>
            {children}
            {suffix}
          </>
        )}
      </Comp>
    );
  },
);

Link.displayName = "Link";
