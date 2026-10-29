import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@/lib/Slot";

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
  /** 子要素にスタイルと振る舞いを委ねる（行全体をリンクにするとき）。`<ListItem interactive asChild><a href>…</a></ListItem>` */
  asChild?: boolean;
  children?: ReactNode;
}

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  (
    { leading, trailing, title, description, interactive, asChild, className, children, ...rest },
    ref,
  ) => {
    const classes = cn("list-item", interactive && "list-item--interactive", className);
    const row = (content: ReactNode) => (
      <>
        {leading && <span className="list-item__leading">{leading}</span>}
        <span className="list-item__content">
          {title && <span className="list-item__title">{title}</span>}
          {description && <span className="list-item__description">{description}</span>}
          {content}
        </span>
        {trailing && <span className="list-item__trailing">{trailing}</span>}
      </>
    );

    if (asChild) {
      // <ul> の直下に <a> を置けないので <li> は素のまま残し、行のスタイルと振る舞いは子要素に載せる
      const child = Children.only(children);
      if (!isValidElement<{ children?: ReactNode }>(child)) {
        throw new Error("[kaze] ListItem (asChild) には React 要素を 1 つだけ渡してください");
      }
      return (
        <li>
          <Slot ref={ref as never} className={classes} {...rest}>
            {cloneElement(child, undefined, row(child.props.children))}
          </Slot>
        </li>
      );
    }

    return (
      <li ref={ref} className={classes} {...rest}>
        {row(children)}
      </li>
    );
  },
);
ListItem.displayName = "ListItem";
