"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { composeEventHandlers } from "../../lib/composeEventHandlers";
import { cn } from "../../lib/utils";
import { isAriaInvalid } from "../_internal/aria";
import { useFormattedInput } from "../_internal/useFormattedInput";

export interface PostalCodeFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "type" | "name"> {
  /** Postal code as digits only, e.g. "1500002" (controlled) */
  value?: string;
  /** Initial digits (uncontrolled) */
  defaultValue?: string;
  /** Called with the digits only, whether typed with or without the hyphen */
  onValueChange?: (value: string) => void;
  /** Submitted through a hidden input as digits only. The visible field has no name */
  name?: string;
  /** Error state (FormField's error also sets it through aria-invalid) */
  error?: boolean;
}

/** Typed text to digits: fullwidth to ASCII, "〒", hyphens and spaces removed. */
export function normalizePostalCode(text: string): string {
  return text.normalize("NFKC").replace(/\D/g, "");
}

/** "1500002" / "１５０ー０００２" → "150-0002". Anything that is not 7 digits is left as typed. */
export function formatPostalCode(text: string): string {
  const digits = normalizePostalCode(text);
  return digits.length === 7 ? `${digits.slice(0, 3)}-${digits.slice(3)}` : text;
}

/**
 * Japanese postal code input. Accepts fullwidth digits, any hyphen-like character
 * and "〒", reports 7 digits, and shows "150-0002" on blur. Part of AddressField;
 * usable on its own inside FormField.
 */
export const PostalCodeField = forwardRef<HTMLInputElement, PostalCodeFieldProps>(
  (
    {
      value: valueProp,
      defaultValue = "",
      onValueChange,
      name,
      error,
      className,
      disabled,
      onChange,
      onBlur,
      "aria-invalid": ariaInvalid,
      ...rest
    },
    ref,
  ) => {
    const field = useFormattedInput({
      value: valueProp,
      defaultValue,
      onValueChange,
      normalize: normalizePostalCode,
      display: formatPostalCode,
    });
    const invalid = error || isAriaInvalid(ariaInvalid);
    return (
      <>
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          aria-invalid={error ? "true" : ariaInvalid}
          className={cn("input", "postal-code-field", invalid && "input--error", className)}
          disabled={disabled}
          {...rest}
          value={field.text}
          onChange={composeEventHandlers(onChange, field.onChange)}
          onBlur={composeEventHandlers(onBlur, field.onBlur)}
        />
        {name && <input type="hidden" name={name} value={field.value} disabled={disabled} />}
      </>
    );
  },
);

PostalCodeField.displayName = "PostalCodeField";
