import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ListMarker = "disc" | "decimal" | "none";

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  divided?: boolean;
  /** List marker style */
  marker?: ListMarker;
  children: ReactNode;
}

export const List = forwardRef<HTMLUListElement, ListProps>(
  ({ divided, marker, className, children, ...rest }, ref) => {
    const Tag = marker === "decimal" ? "ol" : "ul";
    return (
      <Tag
        ref={ref as never}
        className={cn(
          "list",
          divided && "list--divided",
          marker && marker !== "none" && `list--${marker}`,
          className,
        )}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);
List.displayName = "List";

export interface ListItemProps extends Omit<HTMLAttributes<HTMLLIElement>, "title"> {
  leading?: ReactNode;
  trailing?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  interactive?: boolean;
  children?: ReactNode;
}

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  (
    {
      leading,
      trailing,
      title,
      description,
      interactive,
      className,
      children,
      ...rest
    },
    ref,
  ) => (
    <li
      ref={ref}
      className={cn(
        "list-item",
        interactive && "list-item--interactive",
        className,
      )}
      {...rest}
    >
      {leading && <span className="list-item__leading">{leading}</span>}
      <span className="list-item__content">
        {title && <span className="list-item__title">{title}</span>}
        {description && (
          <span className="list-item__description">{description}</span>
        )}
        {children}
      </span>
      {trailing && <span className="list-item__trailing">{trailing}</span>}
    </li>
  ),
);
ListItem.displayName = "ListItem";
