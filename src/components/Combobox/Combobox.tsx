"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { composeEventHandlers } from "../../lib/composeEventHandlers";
import { includesJa, isComposingEvent, normalizeJa } from "../../lib/jaText";
import type { Size } from "../../lib/types";
import { cn } from "../../lib/utils";
import { isAriaInvalid } from "../_internal/aria";
import { computePlacement, type Side } from "../_internal/position";

/* ── Types ─────────────────────────────────────────────────── */

export interface ComboboxOption {
  value: string;
  label: string;
  /** Extra search terms (readings, aliases) that match without being shown */
  keywords?: string[];
  disabled?: boolean;
}

export type ComboboxSize = Extract<Size, "sm" | "md">;

export interface ComboboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "size" | "type" | "role" | "name"
  > {
  options: ComboboxOption[];
  /** Selected option value (controlled). `null` means nothing selected */
  value?: string | null;
  /** Initial selected value (uncontrolled) */
  defaultValue?: string | null;
  /** Called when the selection changes. `null` when the user clears the text */
  onValueChange?: (value: string | null) => void;
  /** Replaces the default match. Receives the option and the typed text */
  filter?: (option: ComboboxOption, query: string) => boolean;
  /** Submitted through a hidden input so the value (not the label) reaches the form */
  name?: string;
  size?: ComboboxSize;
  /** Shown when no option matches */
  emptyMessage?: string;
  /** Class for the outer wrapper */
  wrapperClassName?: string;
}

/** Default match: width / kana / case insensitive on the label and on `keywords` */
export function defaultComboboxFilter(option: ComboboxOption, query: string): boolean {
  return (
    includesJa(option.label, query) ||
    (option.keywords?.some((keyword) => includesJa(keyword, query)) ?? false)
  );
}

const POPUP_OFFSET = 4;

/* ── Combobox ──────────────────────────────────────────────── */

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      options,
      value: valueProp,
      defaultValue = null,
      onValueChange,
      filter = defaultComboboxFilter,
      name,
      size = "md",
      emptyMessage = "候補がありません",
      wrapperClassName,
      className,
      disabled,
      "aria-invalid": ariaInvalid,
      onChange,
      onKeyDown,
      onBlur,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const listboxId = useId();
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const popupRef = useRef<HTMLDivElement | null>(null);

    const [internalValue, setInternalValue] = useState<string | null>(defaultValue);
    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : internalValue;
    const selectedOption = options.find((option) => option.value === value);
    const selectedLabel = selectedOption?.label ?? "";

    const [text, setText] = useState(selectedLabel);
    /** True once the user typed since the list last opened; only then is the list narrowed */
    const [narrowing, setNarrowing] = useState(false);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [mounted, setMounted] = useState(false);
    const [placement, setPlacement] = useState<{
      top: number;
      left: number;
      width: number;
      side: Side;
    }>({ top: 0, left: 0, width: 0, side: "bottom" });

    useEffect(() => setMounted(true), []);

    // Keep the text in step with an externally changed value (controlled use, form reset).
    useEffect(() => {
      setText(selectedLabel);
      setNarrowing(false);
    }, [selectedLabel]);

    const visible = (query: string, narrow: boolean): ComboboxOption[] =>
      narrow && query.trim() !== "" ? options.filter((option) => filter(option, query)) : options;
    const filtered = visible(text, narrowing);
    const activeOption = open ? filtered[activeIndex] : undefined;
    const activeId = activeOption ? `${listboxId}-option-${activeIndex}` : undefined;

    const firstEnabled = (list: ComboboxOption[]) => list.findIndex((o) => !o.disabled);
    const lastEnabled = (list: ComboboxOption[]) => {
      for (let i = list.length - 1; i >= 0; i--) if (!list[i]?.disabled) return i;
      return -1;
    };
    const step = (list: ComboboxOption[], from: number, dir: 1 | -1) => {
      if (list.every((o) => o.disabled)) return -1;
      let i = from < 0 && dir === -1 ? 0 : from;
      do {
        i = (i + dir + list.length) % list.length;
      } while (list[i]?.disabled);
      return i;
    };

    const commit = useCallback(
      (next: string | null) => {
        if (!isControlled) setInternalValue(next);
        if (next !== value) onValueChange?.(next);
      },
      [isControlled, value, onValueChange],
    );

    const closeList = () => {
      setOpen(false);
      setActiveIndex(-1);
    };

    const select = (option: ComboboxOption) => {
      if (option.disabled) return;
      commit(option.value);
      setText(option.label);
      setNarrowing(false);
      closeList();
    };

    const openList = (index: number) => {
      setOpen(true);
      setActiveIndex(index);
    };

    const updatePlacement = useCallback(() => {
      const wrapper = wrapperRef.current;
      const popup = popupRef.current;
      if (!wrapper || !popup) return;
      const anchor = wrapper.getBoundingClientRect();
      const result = computePlacement(
        anchor,
        { width: anchor.width, height: popup.getBoundingClientRect().height },
        "bottom",
        "start",
        POPUP_OFFSET,
      );
      setPlacement({ ...result, width: anchor.width });
    }, []);

    // Re-measure when the list opens or its height changes with filtering.
    // biome-ignore lint/correctness/useExhaustiveDependencies: filtered.length drives re-measure
    useLayoutEffect(() => {
      if (!open) return;
      updatePlacement();
      window.addEventListener("resize", updatePlacement);
      window.addEventListener("scroll", updatePlacement, true);
      return () => {
        window.removeEventListener("resize", updatePlacement);
        window.removeEventListener("scroll", updatePlacement, true);
      };
    }, [open, filtered.length, updatePlacement]);

    // jsdom has no scrollIntoView
    useEffect(() => {
      if (!activeId) return;
      document.getElementById(activeId)?.scrollIntoView?.({ block: "nearest" });
    }, [activeId]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value;
      setText(next);
      setNarrowing(true);
      setOpen(true);
      setActiveIndex(firstEnabled(visible(next, true)));
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      // Keys pressed while converting kana belong to the IME, not to the list.
      if (isComposingEvent(event)) return;
      switch (event.key) {
        case "ArrowDown":
        case "ArrowUp": {
          event.preventDefault();
          const dir = event.key === "ArrowDown" ? 1 : -1;
          if (!open) {
            const selected = filtered.findIndex((o) => o.value === value && !o.disabled);
            openList(
              selected >= 0 ? selected : dir === 1 ? firstEnabled(filtered) : lastEnabled(filtered),
            );
          } else {
            setActiveIndex(step(filtered, activeIndex, dir));
          }
          break;
        }
        case "Home":
        case "End":
          if (open) {
            event.preventDefault();
            setActiveIndex(event.key === "Home" ? firstEnabled(filtered) : lastEnabled(filtered));
          }
          break;
        case "Enter":
          if (!open) break;
          if (activeOption) {
            // Keep Enter from submitting the surrounding form while picking
            event.preventDefault();
            select(activeOption);
          } else {
            closeList();
          }
          break;
        case "Escape":
          if (open) {
            event.preventDefault();
            event.stopPropagation();
            setText(selectedLabel);
            setNarrowing(false);
            closeList();
          }
          break;
      }
    };

    const handleBlur = () => {
      closeList();
      setNarrowing(false);
      if (text.trim() === "") {
        if (value !== null) commit(null);
        setText("");
        return;
      }
      // Typed a full label without picking it: treat as picked.
      const exact = options.find((o) => !o.disabled && normalizeJa(o.label) === normalizeJa(text));
      if (exact) {
        commit(exact.value);
        setText(exact.label);
      } else {
        setText(selectedLabel);
      }
    };

    const handleClick = () => {
      if (open || disabled) return;
      const selected = options.findIndex((o) => o.value === value && !o.disabled);
      openList(selected >= 0 ? selected : -1);
    };

    // Keep focus in the input while the pointer works the list.
    const keepFocus = (event: MouseEvent) => event.preventDefault();

    const invalid = isAriaInvalid(ariaInvalid);

    return (
      <div
        ref={wrapperRef}
        className={cn("combobox", size === "sm" && "combobox--sm", wrapperClassName)}
        data-state={open ? "open" : "closed"}
      >
        <input
          {...rest}
          ref={ref}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-activedescendant={activeId}
          aria-invalid={ariaInvalid}
          disabled={disabled}
          value={text}
          className={cn("input", "combobox__input", invalid && "input--error", className)}
          onChange={composeEventHandlers(onChange, handleChange)}
          onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
          onBlur={composeEventHandlers(onBlur, handleBlur)}
          onClick={composeEventHandlers(onClick, handleClick)}
        />
        {name && <input type="hidden" name={name} value={value ?? ""} disabled={disabled} />}
        <svg
          className="combobox__chevron"
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
        {open &&
          mounted &&
          createPortal(
            // biome-ignore lint/a11y/noStaticElementInteractions: mousedown only keeps focus in the input; options are driven by aria-activedescendant
            <div
              ref={popupRef}
              className="combobox__popup"
              data-side={placement.side}
              style={{ top: placement.top, left: placement.left, width: placement.width }}
              onMouseDown={keepFocus}
            >
              <div
                id={listboxId}
                role="listbox"
                className="combobox__list"
                aria-label={rest["aria-label"]}
              >
                {filtered.map((option, index) => (
                  // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard selection happens on the input via aria-activedescendant
                  <div
                    key={option.value}
                    id={`${listboxId}-option-${index}`}
                    role="option"
                    tabIndex={-1}
                    aria-selected={option.value === value}
                    aria-disabled={option.disabled || undefined}
                    data-highlighted={index === activeIndex ? "true" : undefined}
                    className="combobox__option"
                    onMouseMove={() => !option.disabled && setActiveIndex(index)}
                    onClick={() => select(option)}
                  >
                    <span>{option.label}</span>
                    {option.value === value && (
                      <svg
                        className="combobox__check"
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="combobox__empty" role="status">
                  {emptyMessage}
                </div>
              )}
            </div>,
            document.body,
          )}
      </div>
    );
  },
);

Combobox.displayName = "Combobox";
