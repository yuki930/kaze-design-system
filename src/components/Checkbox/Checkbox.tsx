import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Marks the checkbox invalid (sets aria-invalid). `aria-invalid` passed directly is honored too. */
  error?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, id: idProp, "aria-invalid": ariaInvalid, ...rest }, ref) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;

    return (
      <label htmlFor={id} className={cn("checkbox", className)}>
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className="checkbox__input"
          aria-invalid={error ? "true" : ariaInvalid}
          {...rest}
        />
        {label && <span>{label}</span>}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
