import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface DividerProps extends HTMLAttributes<HTMLElement> {
  text?: string;
  subtle?: boolean;
}

export const Divider = forwardRef<HTMLElement, DividerProps>(
  ({ text, subtle, className, ...rest }, ref) => {
    if (text) {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={cn("divider-text", className)}
          {...rest}
        >
          {text}
        </div>
      );
    }

    return (
      <hr
        ref={ref as React.Ref<HTMLHRElement>}
        className={cn("divider", subtle && "divider--subtle", className)}
        {...rest}
      />
    );
  },
);

Divider.displayName = "Divider";
