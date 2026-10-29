"use client";

import {
  forwardRef,
  useState,
  useCallback,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";
import { renamedProp } from "@/lib/deprecate";
import { composeEventHandlers } from "@/lib/composeEventHandlers";
import { isComposingEvent } from "@/lib/jaText";

export interface SearchProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  placeholder?: string;
  shortcut?: string;
  /** Called when the user submits with Enter (not during IME composition). Use onChange for every keystroke. */
  onSearch?: (value: string) => void;
  /** Controlled value */
  value?: string;
  /** Initial value (uncontrolled) */
  defaultValue?: string;
  /** Called with the new value on every change */
  onValueChange?: (value: string) => void;
  /** @deprecated `onValueChange` に改名。次のマイナーで削除 */
  onChange?: (value: string) => void;
  /** Accessible label for the search input */
  "aria-label"?: string;
  /** Extra props for the inner <input> (name, disabled, autoComplete, onBlur, ...). `...rest` stays on the wrapper. */
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type">;
}

export const Search = forwardRef<HTMLInputElement, SearchProps>(
  (
    {
      placeholder = "検索",
      shortcut,
      onSearch,
      value: valueProp,
      defaultValue = "",
      onValueChange,
      onChange: onChangeProp,
      "aria-label": ariaLabel,
      inputProps,
      className,
      ...rest
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = valueProp !== undefined;
    const currentValue = isControlled ? valueProp : internalValue;

    const onValueChangeResolved = renamedProp(
      "Search",
      "onChange",
      "onValueChange",
      onChangeProp,
      onValueChange,
    );

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onValueChangeResolved?.(newValue);
      },
      [isControlled, onValueChangeResolved],
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        // Enter during IME composition only confirms the conversion.
        if (e.key !== "Enter" || isComposingEvent(e)) return;
        onSearch?.(e.currentTarget.value);
      },
      [onSearch],
    );

    return (
      // biome-ignore lint/a11y/useSemanticElements: the <search> element is not supported in all target browsers yet (Safari < 17); role="search" on a div exposes the same landmark.
      <div role="search" className={cn("search", className)} {...rest}>
        <svg
          className="search__icon"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          aria-label={ariaLabel ?? placeholder}
          {...inputProps}
          ref={ref}
          type="search"
          enterKeyHint="search"
          className={cn("search__input", inputProps?.className)}
          placeholder={placeholder}
          value={currentValue}
          onChange={handleChange}
          onKeyDown={composeEventHandlers(inputProps?.onKeyDown, handleKeyDown)}
        />
        {shortcut && (
          // biome-ignore lint/a11y/noAriaHiddenOnFocusable: <kbd> has no tabIndex and is not focusable; the shortcut hint is visual only.
          <kbd className="search__kbd" aria-hidden="true">
            {shortcut}
          </kbd>
        )}
      </div>
    );
  },
);

Search.displayName = "Search";
