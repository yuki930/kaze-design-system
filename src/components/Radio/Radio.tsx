import { forwardRef, useId, type InputHTMLAttributes, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ── Radio ────────────────────────────────────────────────── */

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, className, id: idProp, ...rest }, ref) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;

    return (
      <label htmlFor={id} className={cn("radio", className)}>
        <input
          ref={ref}
          id={id}
          type="radio"
          className="radio__input"
          aria-invalid={error || undefined}
          {...rest}
        />
        <span className="radio__circle" />
        {label && <span className="radio__label">{label}</span>}
      </label>
    );
  },
);

Radio.displayName = "Radio";

/* ── RadioGroup ───────────────────────────────────────────── */

export interface RadioGroupProps extends HTMLAttributes<HTMLFieldSetElement> {
  label?: string;
  orientation?: "horizontal" | "vertical";
  error?: boolean;
  errorMessage?: string;
}

export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (
    {
      label,
      orientation = "vertical",
      error,
      errorMessage,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <fieldset
        ref={ref}
        className={cn(
          "radio-group",
          `radio-group--${orientation}`,
          className,
        )}
        aria-invalid={error || undefined}
        {...rest}
      >
        {label && <legend className="radio-group__legend">{label}</legend>}
        {children}
        {error && errorMessage && (
          <p className="radio-group__error">{errorMessage}</p>
        )}
      </fieldset>
    );
  },
);

RadioGroup.displayName = "RadioGroup";
