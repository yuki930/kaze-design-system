import { forwardRef, createElement, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type TextVariant = "body" | "lead" | "caption" | "overline";
export type TextSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl";
export type TextWeight = "normal" | "medium" | "semibold" | "bold";
export type TextColor =
  | "default"
  | "muted"
  | "subtle"
  | "inherit"
  | "primary"
  | "positive"
  | "warning"
  | "negative";
export type TextAlign = "left" | "center" | "right";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
  align?: TextAlign;
  /** Render as a different element (default: "p") */
  as?: "p" | "span" | "div" | "label" | "small" | "strong" | "em";
}

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      variant = "body",
      size,
      weight,
      color,
      align,
      as = "p",
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    return createElement(
      as,
      {
        ref,
        className: cn(
          "text",
          variant !== "body" && `text--${variant}`,
          size && `text--${size}`,
          weight && `text--${weight}`,
          color && color !== "default" && `text--${color}`,
          align && `text--${align}`,
          className,
        ),
        ...rest,
      },
      children,
    );
  },
);

Text.displayName = "Text";
