"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { composeEventHandlers } from "../../lib/composeEventHandlers";
import { cn } from "../../lib/utils";
import { isAriaInvalid } from "../_internal/aria";
import { useFormattedInput } from "../_internal/useFormattedInput";

export interface PhoneFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "type" | "name"> {
  /** Phone number as digits only, e.g. "09012345678" (controlled) */
  value?: string;
  /** Initial digits (uncontrolled) */
  defaultValue?: string;
  /** Called with the digits only, whether typed with or without hyphens */
  onValueChange?: (value: string) => void;
  /** Submitted through a hidden input as digits only. The visible field has no name */
  name?: string;
  /** Error state (FormField's error also sets it through aria-invalid) */
  error?: boolean;
}

const SEPARATORS = /[\s\-−－ー\u2010-\u2015()（）]+/g;

/** Typed text to national digits: fullwidth to ASCII, "+81" to a leading 0, separators removed. */
export function normalizePhoneNumber(text: string): string {
  const ascii = text.normalize("NFKC").trim();
  const digits = ascii.replace(/\D/g, "");
  if (/^\+\s*81/.test(ascii)) return `0${digits.slice(2).replace(/^0/, "")}`;
  return digits;
}

/**
 * Number ranges where the split is fixed, so hyphens can be added to digits typed
 * without them. Other fixed lines have area codes of 2 to 5 digits that cannot be
 * told apart without a table; for those the separators the user typed are kept.
 * Order matters: 0800 (toll free) is 11 digits like 080 (mobile), so it goes first.
 */
const FIXED_SPLITS: { pattern: RegExp; groups: [number, number, number] }[] = [
  { pattern: /^0800\d{7}$/, groups: [4, 3, 4] }, // toll free
  { pattern: /^0[5789]0\d{8}$/, groups: [3, 4, 4] }, // mobile 070 / 080 / 090, IP 050
  { pattern: /^020\d{8}$/, groups: [3, 4, 4] },
  { pattern: /^0120\d{6}$/, groups: [4, 3, 3] }, // toll free
  { pattern: /^0570\d{6}$/, groups: [4, 3, 3] }, // navi dial
  { pattern: /^0[36]\d{8}$/, groups: [2, 4, 4] }, // Tokyo 03, Osaka 06
];

/** What the field shows after blur: a known split, else the typed separators as "-". */
export function formatPhoneNumber(text: string): string {
  const digits = normalizePhoneNumber(text);
  const split = FIXED_SPLITS.find((s) => s.pattern.test(digits));
  if (split) {
    const [a, b] = split.groups;
    return `${digits.slice(0, a)}-${digits.slice(a, a + b)}-${digits.slice(a + b)}`;
  }
  let ascii = text.normalize("NFKC").trim();
  // "+81 45 123 4567" / "+81 (0)45 123 4567" → "045 123 4567"
  if (/^\+\s*81/.test(ascii)) {
    ascii = `0${ascii.replace(/^\+\s*81[\s\-()]*(?:0[\s\-)]*)?/, "")}`;
  }
  // Only digits and separators are reformatted; anything else is left for the user to see
  if (/[^\d\s\-−－ー\u2010-\u2015()（）]/.test(ascii)) return text;
  return ascii.replace(SEPARATORS, "-").replace(/^-|-$/g, "");
}

/**
 * Phone number input. Accepts fullwidth digits, any hyphen-like character, spaces,
 * brackets and "+81", and reports digits only. Hyphens are added on blur where the
 * split is fixed (mobile, 050, 0120, 0800, 0570, 03, 06).
 */
export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(
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
      normalize: normalizePhoneNumber,
      display: formatPhoneNumber,
    });
    const invalid = error || isAriaInvalid(ariaInvalid);
    return (
      <>
        <input
          ref={ref}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          aria-invalid={error ? "true" : ariaInvalid}
          className={cn("input", "phone-field", invalid && "input--error", className)}
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

PhoneField.displayName = "PhoneField";
