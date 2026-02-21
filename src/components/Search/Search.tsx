"use client";

import {
  forwardRef,
  useState,
  useCallback,
  type HTMLAttributes,
  type ChangeEvent,
} from "react";
import { cn } from "@/lib/utils";

export interface SearchProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  placeholder?: string;
  shortcut?: string;
  onSearch?: (value: string) => void;
  /** Controlled value */
  value?: string;
  /** Change handler for controlled mode */
  onChange?: (value: string) => void;
  /** Accessible label for the search input */
  "aria-label"?: string;
}

export const Search = forwardRef<HTMLInputElement, SearchProps>(
  ({ placeholder = "Search...", shortcut, onSearch, value: valueProp, onChange: onChangeProp, "aria-label": ariaLabel, className, ...rest }, ref) => {
    const [internalValue, setInternalValue] = useState("");
    const isControlled = valueProp !== undefined;
    const currentValue = isControlled ? valueProp : internalValue;

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChangeProp?.(newValue);
        onSearch?.(newValue);
      },
      [isControlled, onChangeProp, onSearch],
    );

    return (
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
          ref={ref}
          type="text"
          className="search__input"
          placeholder={placeholder}
          aria-label={ariaLabel ?? placeholder}
          value={currentValue}
          onChange={handleChange}
        />
        {shortcut && (
          <kbd className="search__kbd" aria-hidden="true">
            {shortcut}
          </kbd>
        )}
      </div>
    );
  },
);

Search.displayName = "Search";
