import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { isAriaInvalid } from "../_internal/aria";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, "aria-invalid": ariaInvalid, ...rest }, ref) => {
    // `aria-invalid` alone (e.g. injected by FormField) is enough to show the error state.
    const invalid = error || isAriaInvalid(ariaInvalid);
    return (
      <textarea
        ref={ref}
        aria-invalid={error ? "true" : ariaInvalid}
        className={cn("textarea", invalid && "textarea--error", className)}
        {...rest}
      />
    );
  },
);

Textarea.displayName = "Textarea";
