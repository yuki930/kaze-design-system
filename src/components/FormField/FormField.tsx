import {
  forwardRef,
  useId,
  isValidElement,
  cloneElement,
  type HTMLAttributes,
  type ReactElement,
} from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  /** Label text for the form control */
  label?: string;
  /** Description / helper text shown below the label */
  description?: string;
  /** Error message. When set, the child control receives aria-invalid */
  error?: string;
  /** Whether the field is required (appends * to label) */
  required?: boolean;
  /** Maximum character count – renders a counter below the control */
  maxLength?: number;
  /** Current character count for the counter display */
  currentLength?: number;
  /** The form control element (Input, Select, Textarea, etc.) */
  children?: ReactElement;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      label,
      description,
      error,
      required,
      maxLength,
      currentLength,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = `form-field-${generatedId}`;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

    // Clone the child element to inject accessibility attributes
    const control =
      isValidElement(children)
        ? cloneElement(children as ReactElement<Record<string, unknown>>, {
            id: inputId,
            "aria-invalid": error ? "true" : undefined,
            "aria-describedby": describedBy,
            ...(error ? { error: true } : {}),
          })
        : children;

    return (
      <div ref={ref} className={cn("form-field", className)} {...rest}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "form-field__label",
              required && "form-field__label--required",
            )}
          >
            {label}
          </label>
        )}

        {description && (
          <p id={descriptionId} className="form-field__description">
            {description}
          </p>
        )}

        {control}

        {error && (
          <p id={errorId} className="form-field__error" role="alert">
            {error}
          </p>
        )}

        {maxLength != null && (
          <p className="form-field__counter">
            {currentLength ?? 0} / {maxLength}
          </p>
        )}
      </div>
    );
  },
);

FormField.displayName = "FormField";
