import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  horizontal?: boolean;
  bordered?: boolean;
  children: ReactNode;
}

export const DescriptionList = forwardRef<
  HTMLDListElement,
  DescriptionListProps
>(({ horizontal, bordered, className, children, ...rest }, ref) => (
  <dl
    ref={ref}
    className={cn(
      "dl",
      horizontal && "dl--horizontal",
      bordered && "dl--bordered",
      className,
    )}
    {...rest}
  >
    {children}
  </dl>
));
DescriptionList.displayName = "DescriptionList";

export interface DescriptionItemProps extends HTMLAttributes<HTMLDivElement> {
  term: ReactNode;
  children: ReactNode;
}

export const DescriptionItem = forwardRef<HTMLDivElement, DescriptionItemProps>(
  ({ term, className, children, ...rest }, ref) => (
    <div ref={ref} className={cn("dl__group", className)} {...rest}>
      <dt className="dl__term">{term}</dt>
      <dd className="dl__detail">{children}</dd>
    </div>
  ),
);
DescriptionItem.displayName = "DescriptionItem";
