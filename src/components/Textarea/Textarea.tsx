import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, ...rest }, ref) => {
    return (
      <textarea
        ref={ref}
        aria-invalid={error ? "true" : undefined}
        className={cn("textarea", error && "textarea--error", className)}
        {...rest}
      />
    );
  },
);

Textarea.displayName = "Textarea";
