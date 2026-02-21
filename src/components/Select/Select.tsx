import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className, children, ...rest }, ref) => {
    return (
      <select
        ref={ref}
        aria-invalid={error ? "true" : undefined}
        className={cn("select", error && "select--error", className)}
        {...rest}
      >
        {children}
      </select>
    );
  },
);

Select.displayName = "Select";
