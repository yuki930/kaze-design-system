import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { isAriaInvalid } from "../_internal/aria";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className, children, "aria-invalid": ariaInvalid, ...rest }, ref) => {
    // `aria-invalid` alone (e.g. injected by FormField) is enough to show the error state.
    const invalid = error || isAriaInvalid(ariaInvalid);
    return (
      <select
        ref={ref}
        aria-invalid={error ? "true" : ariaInvalid}
        className={cn("select", invalid && "select--error", className)}
        {...rest}
      >
        {children}
      </select>
    );
  },
);

Select.displayName = "Select";
