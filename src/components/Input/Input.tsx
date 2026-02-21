import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  /** ID of the element that describes this input (e.g. error or helper text) */
  "aria-describedby"?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={error ? "true" : undefined}
        className={cn("input", error && "input--error", className)}
        {...rest}
      />
    );
  },
);

Input.displayName = "Input";
