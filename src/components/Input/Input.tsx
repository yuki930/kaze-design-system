import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { isAriaInvalid } from "../_internal/aria";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  /** ID of the element that describes this input (e.g. error or helper text) */
  "aria-describedby"?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, "aria-invalid": ariaInvalid, ...rest }, ref) => {
    // `aria-invalid` alone (e.g. injected by FormField) is enough to show the error state.
    const invalid = error || isAriaInvalid(ariaInvalid);
    return (
      <input
        ref={ref}
        aria-invalid={error ? "true" : ariaInvalid}
        className={cn("input", invalid && "input--error", className)}
        {...rest}
      />
    );
  },
);

Input.displayName = "Input";
