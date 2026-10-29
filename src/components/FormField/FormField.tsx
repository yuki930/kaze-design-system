import {
  forwardRef,
  useId,
  isValidElement,
  cloneElement,
  type HTMLAttributes,
  type ReactElement,
} from "react";
import { cn } from "@/lib/utils";
import { joinIds } from "../_internal/aria";

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  /** Label text for the form control */
  label?: string;
  /** Description / helper text shown below the label */
  description?: string;
  /** Error message. When set, the child control receives aria-invalid */
  error?: string;
  /** Whether the field is required (appends * to label and passes required / aria-required to the control) */
  required?: boolean;
  /** Maximum character count – renders a counter below the control */
  maxLength?: number;
  /** Current character count for the counter display */
  currentLength?: number;
  /** The form control element (Input, Select, Textarea, etc.) */
  children?: ReactElement;
}

/** Remaining characters at or below which the counter becomes a polite live region. */
const COUNTER_LIVE_THRESHOLD = 10;

type ControlProps = Record<string, unknown>;

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  (
    { label, description, error, required, maxLength, currentLength, children, className, ...rest },
    ref,
  ) => {
    const generatedId = useId();
    const control = isValidElement<ControlProps>(children) ? children : null;
    const controlProps: ControlProps = control?.props ?? {};

    // Respect an id the control already carries so external labels / tests keep working.
    const inputId =
      typeof controlProps.id === "string" && controlProps.id
        ? controlProps.id
        : `form-field-${generatedId}`;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const counterId = maxLength != null ? `${inputId}-counter` : undefined;

    const ownDescribedBy =
      typeof controlProps["aria-describedby"] === "string"
        ? controlProps["aria-describedby"]
        : undefined;
    const describedBy = joinIds(descriptionId, errorId, counterId, ownDescribedBy);

    const remaining = maxLength != null ? maxLength - (currentLength ?? 0) : null;
    const counterLive = remaining !== null && remaining <= COUNTER_LIVE_THRESHOLD;

    // Inject accessibility attributes without clobbering what the control already set.
    const injected: ControlProps = { id: inputId };
    if (describedBy) injected["aria-describedby"] = describedBy;
    if (error) injected["aria-invalid"] = "true";
    if (required) {
      injected.required = true;
      injected["aria-required"] = true;
    }
    const renderedControl = control ? cloneElement(control, injected) : children;

    return (
      <div ref={ref} className={cn("form-field", className)} {...rest}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn("form-field__label", required && "form-field__label--required")}
          >
            {label}
          </label>
        )}

        {description && (
          <p id={descriptionId} className="form-field__description">
            {description}
          </p>
        )}

        {renderedControl}

        {error && (
          <p id={errorId} className="form-field__error" role="alert">
            {error}
          </p>
        )}

        {maxLength != null && (
          <p
            id={counterId}
            className="form-field__counter"
            aria-live={counterLive ? "polite" : undefined}
          >
            {currentLength ?? 0} / {maxLength}
          </p>
        )}
      </div>
    );
  },
);

FormField.displayName = "FormField";
