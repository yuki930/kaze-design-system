"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useId,
  type InputHTMLAttributes,
  type HTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";
import { joinIds } from "../_internal/aria";

/* ── Group context ────────────────────────────────────────── */

interface RadioGroupContextValue {
  /** The group is in an error state: every radio reports aria-invalid */
  invalid?: boolean;
  /** id of the group's error message, appended to each radio's aria-describedby */
  describedBy?: string;
}

const RadioGroupContext = createContext<RadioGroupContextValue>({});

/* ── Radio ────────────────────────────────────────────────── */

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      error,
      className,
      id: idProp,
      "aria-invalid": ariaInvalid,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const group = useContext(RadioGroupContext);

    return (
      <label htmlFor={id} className={cn("radio", className)}>
        <input
          ref={ref}
          id={id}
          type="radio"
          className="radio__input"
          aria-invalid={error || group.invalid ? "true" : ariaInvalid}
          aria-describedby={joinIds(ariaDescribedBy, group.describedBy)}
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
  ({ label, orientation = "vertical", error, errorMessage, className, children, ...rest }, ref) => {
    const baseId = useId();
    const legendId = label ? `${baseId}-legend` : undefined;
    const errorId = error && errorMessage ? `${baseId}-error` : undefined;

    return (
      <fieldset
        ref={ref}
        // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: ARIA in HTML allows role="radiogroup" on <fieldset>; it narrows the implicit "group" so screen readers announce the radio set as one unit.
        role="radiogroup"
        aria-labelledby={legendId}
        className={cn("radio-group", `radio-group--${orientation}`, className)}
        aria-invalid={error || undefined}
        {...rest}
      >
        {label && (
          <legend id={legendId} className="radio-group__legend">
            {label}
          </legend>
        )}
        <RadioGroupContext.Provider value={{ invalid: error, describedBy: errorId }}>
          {children}
        </RadioGroupContext.Provider>
        {error && errorMessage && (
          <p id={errorId} className="radio-group__error">
            {errorMessage}
          </p>
        )}
      </fieldset>
    );
  },
);

RadioGroup.displayName = "RadioGroup";
