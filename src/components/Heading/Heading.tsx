import { forwardRef, createElement, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  as?: `h${HeadingLevel}`;
  description?: ReactNode;
  bordered?: boolean;
  children: ReactNode;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 2, as, description, bordered, className, children, ...rest }, ref) => {
    const tag = as ?? (`h${level}` as const);
    return (
      <>
        {createElement(
          tag,
          {
            ref,
            className: cn(
              "heading",
              `heading--${level}`,
              bordered && "heading--bordered",
              className,
            ),
            ...rest,
          },
          children,
        )}
        {description && <p className="heading__description">{description}</p>}
      </>
    );
  },
);
Heading.displayName = "Heading";
