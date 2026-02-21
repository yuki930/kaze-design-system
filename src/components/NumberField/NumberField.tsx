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

export type NumberFieldCurrency = "JPY" | "USD" | "EUR" | "GBP" | "CNY" | "KRW";

export interface NumberFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  /** Current numeric value */
  value?: number | null;
  /** Change handler */
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
  /** Prefix text (e.g. "¥") — auto-set by currency */
  prefix?: string;
  /** Suffix text (e.g. "%", "件") */
  suffix?: string;
  /** Accessible label for decrement button (default: "減少") */
  decrementLabel?: string;
  /** Accessible label for increment button (default: "増加") */
  incrementLabel?: string;
}

const currencyConfig: Record<NumberFieldCurrency, { locale: string; symbol: string; decimals: number }> = {
  JPY: { locale: "ja-JP", symbol: "¥", decimals: 0 },
  USD: { locale: "en-US", symbol: "$", decimals: 2 },
  EUR: { locale: "de-DE", symbol: "€", decimals: 2 },
  GBP: { locale: "en-GB", symbol: "£", decimals: 2 },
  CNY: { locale: "zh-CN", symbol: "¥", decimals: 2 },
  KRW: { locale: "ko-KR", symbol: "₩", decimals: 0 },
};

function formatNumber(
  value: number,
  locale: string,
  currency?: NumberFieldCurrency,
): string {
  if (currency) {
    const cfg = currencyConfig[currency];
    return new Intl.NumberFormat(cfg.locale, {
      minimumFractionDigits: cfg.decimals,
      maximumFractionDigits: cfg.decimals,
    }).format(value);
  }
  return new Intl.NumberFormat(locale).format(value);
}

function parseLocaleNumber(str: string): number | null {
  // Remove all non-numeric characters except minus and decimal separators
  const cleaned = str.replace(/[^\d.\-,]/g, "").replace(/,/g, "");
  const num = Number(cleaned);
  return isNaN(num) ? null : num;
}

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
  (
    {
      value,
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
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const id = idProp ?? autoId;
    const [editing, setEditing] = useState(false);
    const [editValue, setEditValue] = useState("");
    const innerRef = useRef<HTMLInputElement | null>(null);

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

    const commitValue = useCallback(
      (raw: string) => {
        const parsed = parseLocaleNumber(raw);
        if (parsed === null) {
          onChange?.(null);
        } else {
          onChange?.(clamp(parsed));
        }
      },
      [onChange, clamp],
    );

    const handleFocus = () => {
      setEditing(true);
      setEditValue(value != null ? String(value) : "");
    };

    const handleBlur = () => {
      setEditing(false);
      commitValue(editValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        setEditing(false);
        commitValue(editValue);
        innerRef.current?.blur();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const next = clamp((value ?? 0) + step);
        onChange?.(next);
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = clamp((value ?? 0) - step);
        onChange?.(next);
      }
    };

    const increment = () => {
      if (disabled) return;
      onChange?.(clamp((value ?? 0) + step));
    };

    const decrement = () => {
      if (disabled) return;
      onChange?.(clamp((value ?? 0) - step));
    };

    // Sync ref
    useEffect(() => {
      if (typeof ref === "function") ref(innerRef.current);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = innerRef.current;
    });

    const displayValue =
      editing
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
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="2" y1="6" x2="10" y2="6" />
              </svg>
            </button>
          )}
          {resolvedPrefix && <span className="number-field__affix">{resolvedPrefix}</span>}
          <input
            ref={innerRef}
            id={id}
            type="text"
            inputMode="decimal"
            className="number-field__input"
            value={displayValue}
            onChange={(e) => setEditValue(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={errorMessage ? `${id}-error` : undefined}
            {...rest}
          />
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
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
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
