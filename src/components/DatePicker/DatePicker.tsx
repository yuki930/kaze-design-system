"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from "react";
import { composeEventHandlers } from "../../lib/composeEventHandlers";
import { isComposingEvent } from "../../lib/jaText";
import type { Size } from "../../lib/types";
import { cn } from "../../lib/utils";
import { isAriaInvalid } from "../_internal/aria";
import { useControllableState } from "../_internal/useControllableState";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover/Popover";
import {
  addDays,
  addMonths,
  clampIso,
  daysInMonth,
  formatDate,
  formatDateWithWeekday,
  formatMonth,
  parseDateText,
  parseIso,
  startOfWeek,
  todayIso,
  toIso,
  WEEKDAY_NAMES,
  WEEKDAY_SHORT,
  weekdayOf,
  type Era,
} from "./dateUtils";

/* ── Types ─────────────────────────────────────────────────── */

export type DatePickerEra = Era;
export type DatePickerSize = Extract<Size, "sm" | "md">;

export interface DatePickerProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "size" | "type" | "name" | "min" | "max"
  > {
  /** Selected date as "YYYY-MM-DD" (controlled). `null` means empty */
  value?: string | null;
  /** Initial date (uncontrolled) */
  defaultValue?: string | null;
  /**
   * Called with "YYYY-MM-DD" when a date is picked or typed, and with `null` when the
   * field is emptied or holds text that is not a selectable date.
   */
  onValueChange?: (value: string | null) => void;
  /** How the date is written in the field and the calendar heading */
  era?: DatePickerEra;
  /** Earliest selectable date, "YYYY-MM-DD" */
  min?: string;
  /** Latest selectable date, "YYYY-MM-DD" */
  max?: string;
  /** Marks individual dates as unavailable (holidays, closed days, ...) */
  isDateDisabled?: (date: string) => boolean;
  /** First column of the calendar: 0 = Sunday, 1 = Monday */
  weekStartsOn?: 0 | 1;
  /** Calendar popover state */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Submitted through a hidden input as "YYYY-MM-DD" (empty string when no date) */
  name?: string;
  size?: DatePickerSize;
  /** Accessible name of the calendar toggle button */
  calendarButtonLabel?: string;
  /** Accessible name of the calendar dialog */
  dialogLabel?: string;
  prevMonthLabel?: string;
  nextMonthLabel?: string;
  /** Class for the outer wrapper */
  wrapperClassName?: string;
}

const PLACEHOLDERS: Record<Era, string> = {
  gregorian: "2026/10/29",
  // Matches what formatDate(…, "japanese") shows in the field. kaze-copy-ignore-next-line
  japanese: "令和8年10月29日",
};

/* ── DatePicker ────────────────────────────────────────────── */

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      value: valueProp,
      defaultValue = null,
      onValueChange,
      era = "gregorian",
      min,
      max,
      isDateDisabled,
      weekStartsOn = 0,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      name,
      size = "md",
      calendarButtonLabel = "カレンダーを開く",
      dialogLabel = "日付を選択",
      prevMonthLabel = "前の月",
      nextMonthLabel = "次の月",
      wrapperClassName,
      className,
      disabled,
      readOnly,
      placeholder,
      "aria-invalid": ariaInvalid,
      onChange,
      onBlur,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [value, setValue] = useControllableState<string | null>({
      value: valueProp,
      defaultValue,
      onChange: onValueChange,
    });
    const [open, setOpen] = useControllableState<boolean>({
      value: openProp,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });

    const isSelectable = (iso: string) =>
      !(min && iso < min) && !(max && iso > max) && !isDateDisabled?.(iso);
    /** The date the text stands for, or null when it is empty, invalid or not selectable */
    const interpret = (input: string): string | null => {
      const iso = parseDateText(input);
      return iso && isSelectable(iso) ? iso : null;
    };

    const [text, setText] = useState(value ? formatDate(value, era) : "");
    const [textInvalid, setTextInvalid] = useState(false);

    // Follow a value changed from outside, but never overwrite what the user is typing:
    // text that already stands for `value` (or an invalid entry, which means null) stays.
    // biome-ignore lint/correctness/useExhaustiveDependencies: only an outside change of `value` should rewrite the text
    useEffect(() => {
      if (value !== interpret(text)) {
        setText(value ? formatDate(value, era) : "");
        setTextInvalid(false);
      }
    }, [value]);

    // Rewrite the shown date when the era switches.
    // biome-ignore lint/correctness/useExhaustiveDependencies: only `era` should reformat
    useEffect(() => {
      if (value) setText(formatDate(value, era));
    }, [era]);

    const commitText = () => {
      const trimmed = text.trim();
      if (trimmed === "") {
        setTextInvalid(false);
        if (value !== null) setValue(null);
        return;
      }
      const iso = interpret(trimmed);
      if (iso) {
        setTextInvalid(false);
        setText(formatDate(iso, era));
        if (iso !== value) setValue(iso);
      } else {
        // Do not leave the previous date behind a field that shows something else.
        setTextInvalid(true);
        if (value !== null) setValue(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (isComposingEvent(event)) return;
      if (event.key === "Enter") commitText();
    };

    const select = (iso: string) => {
      setTextInvalid(false);
      setText(formatDate(iso, era));
      if (iso !== value) setValue(iso);
      setOpen(false);
    };

    // Only read when the calendar mounts (= opens); later renders do not move the focused day.
    const calendarStart = clampIso(interpret(text) ?? value ?? todayIso(), min, max);

    const invalid = isAriaInvalid(ariaInvalid) || textInvalid;
    const inactive = disabled || readOnly;

    return (
      <div
        ref={wrapperRef}
        className={cn("datepicker", size === "sm" && "datepicker--sm", wrapperClassName)}
      >
        <input
          {...rest}
          ref={ref}
          type="text"
          autoComplete="off"
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder ?? PLACEHOLDERS[era]}
          aria-invalid={invalid ? "true" : ariaInvalid}
          value={text}
          className={cn("input", "datepicker__input", invalid && "input--error", className)}
          onChange={composeEventHandlers(onChange, (event: ChangeEvent<HTMLInputElement>) => {
            setText(event.target.value);
            setTextInvalid(false);
          })}
          onBlur={composeEventHandlers(onBlur, commitText)}
          onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
        />
        {name && <input type="hidden" name={name} value={value ?? ""} disabled={disabled} />}
        <Popover open={open && !inactive} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="datepicker__toggle"
              aria-label={calendarButtonLabel}
              disabled={inactive}
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </button>
          </PopoverTrigger>
          <PopoverContent
            aria-label={dialogLabel}
            anchorRef={wrapperRef}
            side="bottom"
            align="start"
            sideOffset={4}
            className="datepicker__popover"
            // The calendar moves focus to the day itself.
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            <DatePickerCalendar
              selected={value}
              initialDate={calendarStart}
              era={era}
              min={min}
              max={max}
              isDateDisabled={isDateDisabled}
              weekStartsOn={weekStartsOn}
              prevMonthLabel={prevMonthLabel}
              nextMonthLabel={nextMonthLabel}
              onSelect={select}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);

DatePicker.displayName = "DatePicker";

/* ── Calendar ──────────────────────────────────────────────── */

interface DatePickerCalendarProps {
  selected: string | null;
  initialDate: string;
  era: Era;
  min?: string;
  max?: string;
  isDateDisabled?: (date: string) => boolean;
  weekStartsOn: 0 | 1;
  prevMonthLabel: string;
  nextMonthLabel: string;
  onSelect: (date: string) => void;
}

const CELLS_PER_MONTH = 42; // 6 weeks: the popover keeps one height as months change

function DatePickerCalendar({
  selected,
  initialDate,
  era,
  min,
  max,
  isDateDisabled,
  weekStartsOn,
  prevMonthLabel,
  nextMonthLabel,
  onSelect,
}: DatePickerCalendarProps) {
  const headingId = useId();
  const gridRef = useRef<HTMLTableElement | null>(null);
  const [focused, setFocused] = useState(initialDate);
  const today = useMemo(todayIso, []);
  // Arrow keys move DOM focus; the month buttons only change what is shown. Opening focuses the day.
  const focusDayRef = useRef(true);

  useEffect(() => {
    if (!focusDayRef.current) return;
    focusDayRef.current = false;
    gridRef.current?.querySelector<HTMLElement>(`[data-iso="${focused}"]`)?.focus();
  }, [focused]);

  const view = parseIso(focused) ?? { y: 1970, m: 1, d: 1 };
  const firstOfMonth = toIso({ ...view, d: 1 });
  const lead = (weekdayOf(firstOfMonth) - weekStartsOn + 7) % 7;
  const total = daysInMonth(view.y, view.m);
  const weekdays = Array.from({ length: 7 }, (_, i) => (weekStartsOn + i) % 7);
  const isDisabled = (iso: string) =>
    Boolean((min && iso < min) || (max && iso > max) || isDateDisabled?.(iso));

  const cells = Array.from({ length: CELLS_PER_MONTH }, (_, i) => {
    const day = i - lead + 1;
    return day >= 1 && day <= total ? toIso({ ...view, d: day }) : null;
  });
  const rows = Array.from({ length: CELLS_PER_MONTH / 7 }, (_, r) => cells.slice(r * 7, r * 7 + 7));

  const move = (iso: string, moveFocus: boolean) => {
    focusDayRef.current = moveFocus;
    setFocused(clampIso(iso, min, max));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const current = (event.target as HTMLElement).dataset.iso;
    if (!current) return;
    const monthStep = event.shiftKey ? 12 : 1;
    let next: string;
    switch (event.key) {
      case "ArrowLeft":
        next = addDays(current, -1);
        break;
      case "ArrowRight":
        next = addDays(current, 1);
        break;
      case "ArrowUp":
        next = addDays(current, -7);
        break;
      case "ArrowDown":
        next = addDays(current, 7);
        break;
      case "PageUp":
        next = addMonths(current, -monthStep);
        break;
      case "PageDown":
        next = addMonths(current, monthStep);
        break;
      case "Home":
        next = startOfWeek(current, weekStartsOn);
        break;
      case "End":
        next = addDays(startOfWeek(current, weekStartsOn), 6);
        break;
      case "Enter":
      case " ":
        // Handled here so Space does not wait for keyup and Enter never reaches a form
        event.preventDefault();
        if (!isDisabled(current)) onSelect(current);
        return;
      default:
        return;
    }
    event.preventDefault();
    move(next, true);
  };

  const prevDisabled = Boolean(min && addDays(firstOfMonth, -1) < min);
  const nextDisabled = Boolean(max && addMonths(firstOfMonth, 1) > max);

  return (
    <div className="datepicker__calendar">
      <div className="datepicker__header">
        <button
          type="button"
          className="datepicker__nav"
          aria-label={prevMonthLabel}
          disabled={prevDisabled}
          onClick={() => move(addMonths(focused, -1), false)}
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div id={headingId} className="datepicker__title" aria-live="polite">
          {formatMonth(firstOfMonth, era)}
        </div>
        <button
          type="button"
          className="datepicker__nav"
          aria-label={nextMonthLabel}
          disabled={nextDisabled}
          onClick={() => move(addMonths(focused, 1), false)}
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
      <table
        ref={gridRef}
        // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: APG date picker needs role="grid"; a native table keeps the row / cell structure
        role="grid"
        aria-labelledby={headingId}
        className="datepicker__grid"
        onKeyDown={handleKeyDown}
      >
        <thead>
          <tr>
            {weekdays.map((weekday) => (
              <th
                key={weekday}
                scope="col"
                className={cn(
                  "datepicker__weekday",
                  weekday === 0 && "datepicker__weekday--sun",
                  weekday === 6 && "datepicker__weekday--sat",
                )}
              >
                <abbr title={WEEKDAY_NAMES[weekday]}>{WEEKDAY_SHORT[weekday]}</abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: week rows have no identity beyond their position
            <tr key={r}>
              {row.map((iso, c) => {
                if (!iso) return <td key={`blank-${weekdays[c]}`} />;
                const weekday = weekdayOf(iso);
                const disabled = isDisabled(iso);
                const isSelected = iso === selected;
                return (
                  // biome-ignore lint/a11y/useFocusableInteractive: the day button inside the cell holds focus
                  <td
                    key={iso}
                    // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: APG date grid cells are gridcells (aria-selected needs the role)
                    role="gridcell"
                    aria-selected={isSelected}
                  >
                    <button
                      type="button"
                      data-iso={iso}
                      tabIndex={iso === focused ? 0 : -1}
                      aria-label={formatDateWithWeekday(iso, era)}
                      aria-current={iso === today ? "date" : undefined}
                      aria-disabled={disabled || undefined}
                      data-selected={isSelected ? "true" : undefined}
                      data-today={iso === today ? "true" : undefined}
                      className={cn(
                        "datepicker__day",
                        weekday === 0 && "datepicker__day--sun",
                        weekday === 6 && "datepicker__day--sat",
                      )}
                      onClick={() => !disabled && onSelect(iso)}
                    >
                      {Number(iso.slice(8))}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
