"use client";

import {
  forwardRef,
  useState,
  useCallback,
  useRef,
  useEffect,
  useId,
  type InputHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";
import { composeEventHandlers } from "@/lib/composeEventHandlers";
import { renamedProp } from "@/lib/deprecate";
import { isComposingEvent, normalizeNumericInput } from "@/lib/jaText";

export type NumberFieldCurrency = "JPY" | "USD" | "EUR" | "GBP" | "CNY" | "KRW";

export interface NumberFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "type"
  > {
  /** Current numeric value (controlled) */
  value?: number | null;
  /** Initial numeric value (uncontrolled) */
  defaultValue?: number | null;
  /** Called with the parsed value (null when empty) */
  onValueChange?: (value: number | null) => void;
  /** @deprecated `onValueChange` に改名。次のマイナーで削除 */
  onChange?: (value: number | null) => void;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Increment step */
  step?: number;
  /** Currency code for formatting */
  currency?: NumberFieldCurrency;
  /** Locale for formatting (default: "ja-JP") */
  locale?: string;
  /** Whether to show increment/decrement buttons */
  showStepper?: boolean;
  /** Label */
  label?: string;
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Prefix text (e.g. "¥"): auto-set by currency */
  prefix?: string;
  /** Suffix text (e.g. "%", "件") */
  suffix?: string;
  /** Accessible label for decrement button (default: "減少") */
  decrementLabel?: string;
  /** Accessible label for increment button (default: "増加") */
  incrementLabel?: string;
}

const currencyConfig: Record<
  NumberFieldCurrency,
  { locale: string; symbol: string; decimals: number }
> = {
  JPY: { locale: "ja-JP", symbol: "¥", decimals: 0 },
  USD: { locale: "en-US", symbol: "$", decimals: 2 },
  EUR: { locale: "de-DE", symbol: "€", decimals: 2 },
  GBP: { locale: "en-GB", symbol: "£", decimals: 2 },
  CNY: { locale: "zh-CN", symbol: "¥", decimals: 2 },
  KRW: { locale: "ko-KR", symbol: "₩", decimals: 0 },
};

function resolveLocale(locale: string, currency?: NumberFieldCurrency): string {
  return currency ? currencyConfig[currency].locale : locale;
}

function formatNumber(value: number, locale: string, currency?: NumberFieldCurrency): string {
  if (currency) {
    const cfg = currencyConfig[currency];
    return new Intl.NumberFormat(cfg.locale, {
      minimumFractionDigits: cfg.decimals,
      maximumFractionDigits: cfg.decimals,
    }).format(value);
  }
  return new Intl.NumberFormat(locale).format(value);
}

/** Editable text for a value: locale decimal symbol, no grouping, so it round-trips through parseLocaleNumber. */
function formatForEditing(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 20 }).format(
    value,
  );
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Parse user-typed text using the locale's group / decimal symbols.
 * Fullwidth digits, minus signs and punctuation are normalized first; empty or unparsable input is null.
 */
export function parseLocaleNumber(input: string, locale = "ja-JP"): number | null {
  // Whitespace is stripped by normalizeNumericInput, which also covers space group separators (fr-FR).
  const text = normalizeNumericInput(input);
  if (text === "") return null;
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  const group = normalizeNumericInput(parts.find((p) => p.type === "group")?.value ?? "");
  const decimal = normalizeNumericInput(parts.find((p) => p.type === "decimal")?.value ?? ".");
  let cleaned = text;
  if (group) cleaned = cleaned.replace(new RegExp(escapeRegExp(group), "g"), "");
  if (decimal !== ".") cleaned = cleaned.replace(decimal, ".");
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(cleaned)) return null;
  return Number(cleaned);
}

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onValueChange,
      onChange,
      min,
      max,
      step = 1,
      currency,
      locale = "ja-JP",
      showStepper = true,
      label,
      error,
      errorMessage,
      prefix: prefixProp,
      suffix,
      decrementLabel = "減少",
      incrementLabel = "増加",
      className,
      disabled,
      id: idProp,
      name,
      onFocus,
      onBlur,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const id = idProp ?? autoId;
    const [editing, setEditing] = useState(false);
    const [editValue, setEditValue] = useState("");
    const innerRef = useRef<HTMLInputElement | null>(null);
    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = useState<number | null>(defaultValue ?? null);
    const value = isControlled ? valueProp : internalValue;
    const numberLocale = resolveLocale(locale, currency);

    const handleValueChange = renamedProp(
      "NumberField",
      "onChange",
      "onValueChange",
      onChange,
      onValueChange,
    );

    const emit = useCallback(
      (next: number | null) => {
        if (!isControlled) setInternalValue(next);
        handleValueChange?.(next);
      },
      [isControlled, handleValueChange],
    );

    const resolvedPrefix = prefixProp ?? (currency ? currencyConfig[currency].symbol : undefined);

    const clamp = useCallback(
      (v: number) => {
        let clamped = v;
        if (min !== undefined) clamped = Math.max(min, clamped);
        if (max !== undefined) clamped = Math.min(max, clamped);
        return clamped;
      },
      [min, max],
    );

    const commitValue = (raw: string) => {
      const parsed = parseLocaleNumber(raw, numberLocale);
      emit(parsed === null ? null : clamp(parsed));
    };

    const handleFocus = () => {
      setEditing(true);
      setEditValue(value != null ? formatForEditing(value, numberLocale) : "");
    };

    const handleBlur = () => {
      setEditing(false);
      commitValue(editValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Enter while composing confirms the IME conversion; it must not commit.
      if (isComposingEvent(e)) return;
      if (e.key === "Enter") {
        // Blur commits, so committing here too would emit twice.
        innerRef.current?.blur();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        emit(clamp((value ?? 0) + step));
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        emit(clamp((value ?? 0) - step));
      }
    };

    const increment = () => {
      if (disabled) return;
      emit(clamp((value ?? 0) + step));
    };

    const decrement = () => {
      if (disabled) return;
      emit(clamp((value ?? 0) - step));
    };

    // Sync ref
    useEffect(() => {
      if (typeof ref === "function") ref(innerRef.current);
      else if (ref)
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = innerRef.current;
    });

    // Enter can submit a surrounding form before blur commits, so submit what is currently typed.
    const submitValue = editing ? parseLocaleNumber(editValue, numberLocale) : value;

    const displayValue = editing
      ? editValue
      : value != null
        ? formatNumber(value, locale, currency)
        : "";

    return (
      <div className={cn("number-field", error && "number-field--error", className)}>
        {label && (
          <label className="number-field__label" htmlFor={id}>
            {label}
          </label>
        )}
        <div className="number-field__wrapper">
          {showStepper && (
            <button
              type="button"
              className="number-field__stepper"
              onClick={decrement}
              disabled={disabled || (min !== undefined && (value ?? 0) <= min)}
              tabIndex={-1}
              aria-label={decrementLabel}
            >
              <svg
                aria-hidden="true"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="2" y1="6" x2="10" y2="6" />
              </svg>
            </button>
          )}
          {resolvedPrefix && <span className="number-field__affix">{resolvedPrefix}</span>}
          <input
            {...rest}
            ref={innerRef}
            id={id}
            type="text"
            inputMode="decimal"
            className="number-field__input"
            value={displayValue}
            onChange={(e) => setEditValue(e.target.value)}
            onFocus={composeEventHandlers(onFocus, handleFocus)}
            onBlur={composeEventHandlers(onBlur, handleBlur)}
            onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={
              [rest["aria-describedby"], errorMessage ? `${id}-error` : undefined]
                .filter(Boolean)
                .join(" ") || undefined
            }
          />
          {/* The visible input holds formatted text ("1,000"), so submit the raw number separately. */}
          {name && (
            <input type="hidden" name={name} value={submitValue ?? ""} disabled={disabled} />
          )}
          {suffix && <span className="number-field__affix">{suffix}</span>}
          {showStepper && (
            <button
              type="button"
              className="number-field__stepper"
              onClick={increment}
              disabled={disabled || (max !== undefined && (value ?? 0) >= max)}
              tabIndex={-1}
              aria-label={incrementLabel}
            >
              <svg
                aria-hidden="true"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="6" y1="2" x2="6" y2="10" />
                <line x1="2" y1="6" x2="10" y2="6" />
              </svg>
            </button>
          )}
        </div>
        {errorMessage && (
          <p className="number-field__error" id={`${id}-error`} role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);

NumberField.displayName = "NumberField";
