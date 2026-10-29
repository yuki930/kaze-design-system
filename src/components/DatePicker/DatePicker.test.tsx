import { createEvent, fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FormField } from "../FormField/FormField";
import { DatePicker, type DatePickerProps } from "./DatePicker";

// "Today" is 2026-10-29 (Thursday). Only Date is faked so focus / effects stay real.
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 9, 29, 12, 0, 0));
});
afterEach(() => {
  vi.useRealTimers();
});

const field = () => screen.getByRole<HTMLInputElement>("textbox");
const toggle = () => screen.getByRole("button", { name: "カレンダーを開く" });
// Day buttons are looked up by their accessible label directly: querying 42 buttons by
// role + name is slow enough to time out the suite under load.
const day = (label: string): HTMLButtonElement => {
  const el = document.querySelector<HTMLButtonElement>(`button[data-iso][aria-label="${label}"]`);
  if (!el) throw new Error(`No day button labelled ${label}`);
  return el;
};
const dayButtons = (month: string) =>
  Array.from(document.querySelectorAll<HTMLButtonElement>(`button[data-iso^="${month}-"]`));
const grid = () => screen.getByRole("grid");

function setup(props: Partial<DatePickerProps> = {}) {
  return render(<DatePicker aria-label="開始日" {...props} />);
}

function commitTyped(text: string) {
  fireEvent.change(field(), { target: { value: text } });
  fireEvent.blur(field());
}

function press(target: HTMLElement, key: string, init: KeyboardEventInit = {}) {
  fireEvent.keyDown(target, { key, ...init });
}

describe("DatePicker field", () => {
  it("shows the value in the Gregorian era by default", () => {
    setup({ defaultValue: "2026-10-29" });
    expect(field().value).toBe("2026年10月29日");
  });

  it("shows the value in the Japanese era", () => {
    setup({ defaultValue: "2026-10-29", era: "japanese" });
    expect(field().value).toBe("令和8年10月29日");
  });

  it("writes the first day of an era with 元年 and keeps the previous era's last day", () => {
    const { unmount } = setup({ defaultValue: "2019-05-01", era: "japanese" });
    expect(field().value).toBe("令和元年5月1日");
    unmount();
    setup({ defaultValue: "2019-04-30", era: "japanese" });
    expect(field().value).toBe("平成31年4月30日");
  });

  it("rewrites the shown date when the era changes", () => {
    const { rerender } = setup({ defaultValue: "2026-10-29" });
    rerender(<DatePicker aria-label="開始日" defaultValue="2026-10-29" era="japanese" />);
    expect(field().value).toBe("令和8年10月29日");
    rerender(<DatePicker aria-label="開始日" defaultValue="2026-10-29" era="gregorian" />);
    expect(field().value).toBe("2026年10月29日");
  });

  it("suggests the format as a placeholder for each era and lets it be replaced", () => {
    const { rerender } = setup();
    expect(field()).toHaveAttribute("placeholder", "2026/10/29");
    rerender(<DatePicker aria-label="開始日" era="japanese" />);
    expect(field()).toHaveAttribute("placeholder", "令和8年10月29日");
    rerender(<DatePicker aria-label="開始日" placeholder="日付" />);
    expect(field()).toHaveAttribute("placeholder", "日付");
  });

  it("submits the ISO value through a hidden input when `name` is set", () => {
    const { container } = render(
      <form>
        <DatePicker aria-label="開始日" name="start" defaultValue="2026-10-29" />
      </form>,
    );
    const form = container.querySelector("form") as HTMLFormElement;
    expect(new FormData(form).get("start")).toBe("2026-10-29");
    expect(field()).not.toHaveAttribute("name");
  });

  it("submits an empty string when empty", () => {
    const { container } = render(
      <form>
        <DatePicker aria-label="開始日" name="start" />
      </form>,
    );
    expect(new FormData(container.querySelector("form") as HTMLFormElement).get("start")).toBe("");
  });

  it("reuses the Input look and applies the size modifier", () => {
    const { container } = setup({ size: "sm" });
    expect(field()).toHaveClass("input", "datepicker__input");
    expect(container.firstElementChild).toHaveClass("datepicker--sm");
  });

  it("forwards the ref to the input", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<DatePicker aria-label="開始日" ref={ref} />);
    expect(ref.current).toBe(field());
  });
});

function EchoingField() {
  const [value, setValue] = useState<string | null>("2026-10-29");
  return <DatePicker aria-label="開始日" value={value} onValueChange={setValue} />;
}

function ControlledWithOutput() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <>
      <DatePicker aria-label="開始日" value={value} onValueChange={setValue} />
      <output>{value ?? "none"}</output>
    </>
  );
}

describe("DatePicker typed input", () => {
  it.each([
    ["2026/10/29"],
    ["2026-10-29"],
    ["20261029"],
    ["令和8年10月29日"],
    ["R8.10.29"],
    ["２０２６／１０／２９"],
    ["Ｒ８．１０．２９"],
  ])("reads %s as 2026-10-29 on blur and rewrites it in the display era", (typed) => {
    const onValueChange = vi.fn();
    setup({ onValueChange });
    commitTyped(typed);
    expect(onValueChange).toHaveBeenCalledWith("2026-10-29");
    expect(field().value).toBe("2026年10月29日");
    expect(field()).not.toHaveAttribute("aria-invalid", "true");
  });

  it("writes an era-typed date back in the Japanese era when era is japanese", () => {
    setup({ era: "japanese" });
    commitTyped("2026/10/29");
    expect(field().value).toBe("令和8年10月29日");
  });

  it("handles the era boundary: 平成31年4月30日 and 令和元年5月1日", () => {
    const onValueChange = vi.fn();
    setup({ onValueChange });
    commitTyped("平成31年4月30日");
    expect(onValueChange).toHaveBeenLastCalledWith("2019-04-30");
    commitTyped("令和元年5月1日");
    expect(onValueChange).toHaveBeenLastCalledWith("2019-05-01");
    commitTyped("R1.5.1");
    expect(onValueChange).toHaveBeenLastCalledWith("2019-05-01");
  });

  it("flags a date the era never had (平成31年5月1日) as invalid and clears the value", () => {
    const onValueChange = vi.fn();
    setup({ onValueChange, defaultValue: "2026-10-29" });
    commitTyped("平成31年5月1日");
    expect(field()).toHaveAttribute("aria-invalid", "true");
    expect(field()).toHaveClass("input--error");
    expect(field().value).toBe("平成31年5月1日");
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it.each(["あしたの朝", "2026/02/30", "2026/13/1", "99/1/1"])("marks %s as invalid", (typed) => {
    setup();
    commitTyped(typed);
    expect(field()).toHaveAttribute("aria-invalid", "true");
    expect(field().value).toBe(typed);
  });

  it("clears the invalid flag as soon as the user edits", () => {
    setup();
    commitTyped("あした");
    expect(field()).toHaveAttribute("aria-invalid", "true");
    fireEvent.change(field(), { target: { value: "2026/10/3" } });
    expect(field()).not.toHaveAttribute("aria-invalid", "true");
  });

  it("does not interpret the text while it is being typed", () => {
    const onValueChange = vi.fn();
    setup({ onValueChange });
    fireEvent.change(field(), { target: { value: "2026/1/2" } });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(field().value).toBe("2026/1/2");
  });

  it("commits on Enter", () => {
    const onValueChange = vi.fn();
    setup({ onValueChange });
    fireEvent.change(field(), { target: { value: "R8.10.29" } });
    press(field(), "Enter");
    expect(onValueChange).toHaveBeenCalledWith("2026-10-29");
  });

  it("ignores Enter while an IME composition is in progress", () => {
    const onValueChange = vi.fn();
    setup({ onValueChange });
    fireEvent.change(field(), { target: { value: "令和" } });
    press(field(), "Enter", { isComposing: true });
    press(field(), "Enter", { keyCode: 229 });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(field()).not.toHaveAttribute("aria-invalid", "true");
  });

  it("emptying the field clears the value without an error", () => {
    const onValueChange = vi.fn();
    setup({ onValueChange, defaultValue: "2026-10-29" });
    commitTyped("");
    expect(onValueChange).toHaveBeenCalledWith(null);
    expect(field()).not.toHaveAttribute("aria-invalid", "true");
  });

  it("rejects typed dates outside min / max and on disabled dates", () => {
    const onValueChange = vi.fn();
    setup({
      onValueChange,
      min: "2026-10-10",
      max: "2026-10-20",
      isDateDisabled: (d) => d === "2026-10-15",
    });
    commitTyped("2026/10/09");
    expect(field()).toHaveAttribute("aria-invalid", "true");
    commitTyped("2026/10/21");
    expect(field()).toHaveAttribute("aria-invalid", "true");
    commitTyped("2026/10/15");
    expect(field()).toHaveAttribute("aria-invalid", "true");
    expect(onValueChange).not.toHaveBeenCalled();
    commitTyped("2026/10/16");
    expect(field()).not.toHaveAttribute("aria-invalid", "true");
    expect(onValueChange).toHaveBeenCalledWith("2026-10-16");
  });

  it("honors a consumer aria-invalid", () => {
    setup({ "aria-invalid": true });
    expect(field()).toHaveAttribute("aria-invalid", "true");
    expect(field()).toHaveClass("input--error");
  });

  it("follows a value changed from outside without disturbing in-progress text", () => {
    const { rerender } = setup({ value: "2026-10-29" });
    rerender(<DatePicker aria-label="開始日" value="2026-11-03" />);
    expect(field().value).toBe("2026年11月3日");
  });

  it("keeps invalid text on screen when the parent echoes null back", () => {
    render(<EchoingField />);
    commitTyped("あした");
    expect(field().value).toBe("あした");
    expect(field()).toHaveAttribute("aria-invalid", "true");
  });
});

describe("DatePicker toggle and dialog", () => {
  it("exposes the toggle as a dialog disclosure", () => {
    setup();
    expect(toggle()).toHaveAttribute("aria-haspopup", "dialog");
    expect(toggle()).toHaveAttribute("aria-expanded", "false");
    expect(toggle()).toHaveAttribute("type", "button");
  });

  it("opens a dialog labelled 日付を選択 with a labelled grid", () => {
    setup({ defaultValue: "2026-10-29" });
    fireEvent.click(toggle());
    const dialog = screen.getByRole("dialog", { name: "日付を選択" });
    expect(toggle()).toHaveAttribute("aria-expanded", "true");
    expect(toggle()).toHaveAttribute("aria-controls", dialog.id);
    expect(grid()).toHaveAccessibleName("2026年10月");
  });

  it("lets every label be replaced", () => {
    setup({
      calendarButtonLabel: "Open",
      dialogLabel: "Pick",
      prevMonthLabel: "Prev",
      nextMonthLabel: "Next",
    });
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog", { name: "Pick" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Prev" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
  });

  it("focuses the selected day on open", () => {
    setup({ defaultValue: "2026-10-15" });
    fireEvent.click(toggle());
    expect(day("2026年10月15日木曜日")).toHaveFocus();
    expect(day("2026年10月15日木曜日")).toHaveAttribute("tabindex", "0");
    expect(day("2026年10月16日金曜日")).toHaveAttribute("tabindex", "-1");
  });

  it("focuses today when nothing is selected, and marks it with aria-current", () => {
    setup();
    fireEvent.click(toggle());
    expect(day("2026年10月29日木曜日")).toHaveFocus();
    expect(day("2026年10月29日木曜日")).toHaveAttribute("aria-current", "date");
    expect(day("2026年10月28日水曜日")).not.toHaveAttribute("aria-current");
  });

  it("opens on the month of the typed (uncommitted) date", () => {
    setup();
    fireEvent.change(field(), { target: { value: "2027/3/15" } });
    fireEvent.click(toggle());
    expect(grid()).toHaveAccessibleName("2027年3月");
    expect(day("2027年3月15日月曜日")).toHaveFocus();
  });

  it("clamps the starting day into min / max", () => {
    setup({ min: "2026-11-05", max: "2026-11-20" });
    fireEvent.click(toggle());
    expect(day("2026年11月5日木曜日")).toHaveFocus();
  });

  it("marks only the chosen day as selected", () => {
    setup({ defaultValue: "2026-10-15" });
    fireEvent.click(toggle());
    expect(day("2026年10月15日木曜日").closest("td")).toHaveAttribute("aria-selected", "true");
    expect(day("2026年10月16日金曜日").closest("td")).toHaveAttribute("aria-selected", "false");
  });

  it("does not open a disabled or read-only field", () => {
    const { unmount } = setup({ disabled: true });
    expect(toggle()).toBeDisabled();
    unmount();
    setup({ readOnly: true });
    expect(toggle()).toBeDisabled();
  });

  it("supports a controlled `open` and reports requests", () => {
    const onOpenChange = vi.fn();
    setup({ open: false, onOpenChange });
    fireEvent.click(toggle());
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("grid")).toBeNull();
  });

  it("supports defaultOpen", () => {
    setup({ defaultOpen: true, defaultValue: "2026-10-29" });
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });
});

describe("DatePicker grid structure", () => {
  it("uses real calendar math: October 2026 starts on Thursday", () => {
    setup({ defaultValue: "2026-10-29" });
    fireEvent.click(toggle());
    const first = day("2026年10月1日木曜日");
    const cells = Array.from(first.closest("tr")?.children ?? []);
    expect(cells.indexOf(first.closest("td") as Element)).toBe(4);
    expect(dayButtons("2026-10")).toHaveLength(31);
  });

  it("labels weekday columns with abbr titles (日曜日 ... 土曜日)", () => {
    setup({ defaultValue: "2026-10-29" });
    fireEvent.click(toggle());
    const headers = within(grid()).getAllByRole("columnheader");
    expect(headers.map((h) => h.textContent)).toEqual(["日", "月", "火", "水", "木", "金", "土"]);
    const titles = headers.map((h) => h.querySelector("abbr")?.getAttribute("title"));
    expect(titles).toEqual(["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"]);
  });

  it("starts the week on Monday when asked", () => {
    setup({ defaultValue: "2026-10-29", weekStartsOn: 1 });
    fireEvent.click(toggle());
    const headers = within(grid()).getAllByRole("columnheader");
    expect(headers.map((h) => h.textContent)).toEqual(["月", "火", "水", "木", "金", "土", "日"]);
    const first = day("2026年10月1日木曜日");
    const cells = Array.from(first.closest("tr")?.children ?? []);
    expect(cells.indexOf(first.closest("td") as Element)).toBe(3);
  });

  it("marks weekends with modifier classes, in addition to the weekday in the label", () => {
    setup({ defaultValue: "2026-10-29" });
    fireEvent.click(toggle());
    expect(day("2026年10月4日日曜日")).toHaveClass("datepicker__day--sun");
    expect(day("2026年10月3日土曜日")).toHaveClass("datepicker__day--sat");
    expect(day("2026年10月5日月曜日")).not.toHaveClass("datepicker__day--sun");
  });

  it("writes the calendar in the Japanese era", () => {
    setup({ defaultValue: "2026-10-29", era: "japanese" });
    fireEvent.click(toggle());
    expect(grid()).toHaveAccessibleName("令和8年10月");
    expect(day("令和8年10月29日木曜日")).toBeInTheDocument();
  });

  it("shows 令和元年 and 平成31年 in headings around the era change", () => {
    setup({ defaultValue: "2019-05-01", era: "japanese" });
    fireEvent.click(toggle());
    expect(grid()).toHaveAccessibleName("令和元年5月");
    expect(day("令和元年5月1日水曜日")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "前の月" }));
    expect(grid()).toHaveAccessibleName("平成31年4月");
    expect(day("平成31年4月30日火曜日")).toBeInTheDocument();
  });
});

describe("DatePicker grid keyboard", () => {
  function openAt(iso: string, props: Partial<DatePickerProps> = {}) {
    setup({ defaultValue: iso, ...props });
    fireEvent.click(toggle());
  }

  it("moves by day with ArrowLeft / ArrowRight and by week with ArrowUp / ArrowDown", () => {
    openAt("2026-10-15");
    press(day("2026年10月15日木曜日"), "ArrowRight");
    expect(day("2026年10月16日金曜日")).toHaveFocus();
    press(day("2026年10月16日金曜日"), "ArrowLeft");
    press(day("2026年10月15日木曜日"), "ArrowLeft");
    expect(day("2026年10月14日水曜日")).toHaveFocus();
    press(day("2026年10月14日水曜日"), "ArrowDown");
    expect(day("2026年10月21日水曜日")).toHaveFocus();
    press(day("2026年10月21日水曜日"), "ArrowUp");
    expect(day("2026年10月14日水曜日")).toHaveFocus();
  });

  it("crosses a month boundary and updates the heading", () => {
    openAt("2026-10-31");
    press(day("2026年10月31日土曜日"), "ArrowRight");
    expect(grid()).toHaveAccessibleName("2026年11月");
    expect(day("2026年11月1日日曜日")).toHaveFocus();
  });

  it("moves a month with PageUp / PageDown, clamping the day", () => {
    openAt("2026-01-31");
    press(day("2026年1月31日土曜日"), "PageDown");
    expect(grid()).toHaveAccessibleName("2026年2月");
    expect(day("2026年2月28日土曜日")).toHaveFocus();
    press(day("2026年2月28日土曜日"), "PageUp");
    expect(day("2026年1月28日水曜日")).toHaveFocus();
  });

  it("moves a year with Shift+PageUp / Shift+PageDown", () => {
    openAt("2026-10-29");
    press(day("2026年10月29日木曜日"), "PageDown", { shiftKey: true });
    expect(grid()).toHaveAccessibleName("2027年10月");
    expect(day("2027年10月29日金曜日")).toHaveFocus();
    press(day("2027年10月29日金曜日"), "PageUp", { shiftKey: true });
    press(day("2026年10月29日木曜日"), "PageUp", { shiftKey: true });
    expect(grid()).toHaveAccessibleName("2025年10月");
  });

  it("jumps to the start and end of the week (Sunday-first)", () => {
    openAt("2026-10-29");
    press(day("2026年10月29日木曜日"), "Home");
    expect(day("2026年10月25日日曜日")).toHaveFocus();
    press(day("2026年10月25日日曜日"), "End");
    expect(day("2026年10月31日土曜日")).toHaveFocus();
  });

  it("jumps to the start and end of the week (Monday-first)", () => {
    openAt("2026-10-29", { weekStartsOn: 1 });
    press(day("2026年10月29日木曜日"), "Home");
    expect(day("2026年10月26日月曜日")).toHaveFocus();
    press(day("2026年10月26日月曜日"), "End");
    expect(day("2026年11月1日日曜日")).toHaveFocus();
  });

  it("keeps a single tab stop that follows the focused day", () => {
    openAt("2026-10-15");
    press(day("2026年10月15日木曜日"), "ArrowRight");
    const stops = dayButtons("2026-10").filter((b) => b.getAttribute("tabindex") === "0");
    expect(stops).toHaveLength(1);
    expect(stops[0]).toBe(day("2026年10月16日金曜日"));
  });

  it("ignores modified keys and unrelated keys", () => {
    openAt("2026-10-15");
    const before = day("2026年10月15日木曜日");
    const alt = createEvent.keyDown(before, { key: "ArrowRight", altKey: true });
    fireEvent(before, alt);
    expect(alt.defaultPrevented).toBe(false);
    expect(before).toHaveFocus();
    press(before, "a");
    expect(before).toHaveFocus();
  });

  it("selects with Enter, closes, writes the date and returns focus to the toggle", () => {
    const onValueChange = vi.fn();
    openAt("2026-10-15", { onValueChange });
    press(day("2026年10月15日木曜日"), "ArrowRight");
    press(day("2026年10月16日金曜日"), "Enter");
    expect(onValueChange).toHaveBeenCalledWith("2026-10-16");
    expect(field().value).toBe("2026年10月16日");
    expect(screen.queryByRole("grid")).toBeNull();
    expect(toggle()).toHaveFocus();
  });

  it("selects with Space", () => {
    const onValueChange = vi.fn();
    openAt("2026-10-15", { onValueChange });
    press(day("2026年10月15日木曜日"), "ArrowDown");
    press(day("2026年10月22日木曜日"), " ");
    expect(onValueChange).toHaveBeenCalledWith("2026-10-22");
  });

  it("selects with a click", () => {
    const onValueChange = vi.fn();
    openAt("2026-10-15", { onValueChange });
    fireEvent.click(day("2026年10月20日火曜日"));
    expect(onValueChange).toHaveBeenCalledWith("2026-10-20");
    expect(field().value).toBe("2026年10月20日");
  });

  it("writes the picked date in the Japanese era", () => {
    openAt("2026-10-15", { era: "japanese" });
    fireEvent.click(day("令和8年10月20日火曜日"));
    expect(field().value).toBe("令和8年10月20日");
  });

  it("closes on Escape, keeps the value and returns focus to the toggle", () => {
    const onValueChange = vi.fn();
    openAt("2026-10-15", { onValueChange });
    press(day("2026年10月15日木曜日"), "Escape");
    expect(screen.queryByRole("grid")).toBeNull();
    expect(toggle()).toHaveFocus();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(field().value).toBe("2026年10月15日");
  });

  it("stops Escape from reaching an outer handler (e.g. a Dialog)", () => {
    const outer = vi.fn();
    render(
      // biome-ignore lint/a11y/noStaticElementInteractions: probe for event propagation
      <div onKeyDown={outer}>
        <DatePicker aria-label="開始日" defaultValue="2026-10-15" />
      </div>,
    );
    fireEvent.click(toggle());
    press(day("2026年10月15日木曜日"), "Escape");
    expect(outer).not.toHaveBeenCalled();
  });

  it("closes when the user clicks outside", () => {
    openAt("2026-10-15");
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("grid")).toBeNull();
  });
});

describe("DatePicker constraints", () => {
  it("flags unavailable dates with aria-disabled and refuses to select them", () => {
    const onValueChange = vi.fn();
    setup({
      defaultValue: "2026-10-15",
      onValueChange,
      isDateDisabled: (d) => d === "2026-10-16",
    });
    fireEvent.click(toggle());
    const blocked = day("2026年10月16日金曜日");
    expect(blocked).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(blocked);
    press(blocked, "Enter");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("keeps unavailable days reachable by keyboard", () => {
    setup({ defaultValue: "2026-10-15", isDateDisabled: (d) => d === "2026-10-16" });
    fireEvent.click(toggle());
    press(day("2026年10月15日木曜日"), "ArrowRight");
    expect(day("2026年10月16日金曜日")).toHaveFocus();
  });

  it("disables days outside min / max and clamps keyboard movement", () => {
    setup({ defaultValue: "2026-10-15", min: "2026-10-10", max: "2026-10-20" });
    fireEvent.click(toggle());
    expect(day("2026年10月9日金曜日")).toHaveAttribute("aria-disabled", "true");
    expect(day("2026年10月21日水曜日")).toHaveAttribute("aria-disabled", "true");
    expect(day("2026年10月10日土曜日")).not.toHaveAttribute("aria-disabled");
    press(day("2026年10月15日木曜日"), "ArrowDown");
    press(day("2026年10月20日火曜日"), "ArrowDown");
    expect(day("2026年10月20日火曜日")).toHaveFocus();
    press(day("2026年10月20日火曜日"), "PageDown");
    expect(day("2026年10月20日火曜日")).toHaveFocus();
  });

  it("disables the month buttons at the range edges", () => {
    setup({ defaultValue: "2026-10-15", min: "2026-10-01", max: "2026-10-31" });
    fireEvent.click(toggle());
    expect(screen.getByRole("button", { name: "前の月" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "次の月" })).toBeDisabled();
  });

  it("moves between months with the month buttons without taking focus off the control", () => {
    setup({ defaultValue: "2026-10-15" });
    fireEvent.click(toggle());
    fireEvent.click(screen.getByRole("button", { name: "次の月" }));
    expect(grid()).toHaveAccessibleName("2026年11月");
    expect(day("2026年11月15日日曜日")).toHaveAttribute("tabindex", "0");
    fireEvent.click(screen.getByRole("button", { name: "前の月" }));
    fireEvent.click(screen.getByRole("button", { name: "前の月" }));
    expect(grid()).toHaveAccessibleName("2026年9月");
  });
});

describe("DatePicker value state", () => {
  it("works uncontrolled", () => {
    setup({ defaultValue: "2026-10-15" });
    fireEvent.click(toggle());
    fireEvent.click(day("2026年10月20日火曜日"));
    expect(field().value).toBe("2026年10月20日");
  });

  it("is controlled by `value` and only reports requests", () => {
    const onValueChange = vi.fn();
    setup({ value: "2026-10-15", onValueChange });
    fireEvent.click(toggle());
    fireEvent.click(day("2026年10月20日火曜日"));
    expect(onValueChange).toHaveBeenCalledWith("2026-10-20");
  });

  it("works controlled with external state across type and pick", () => {
    render(<ControlledWithOutput />);
    commitTyped("R8.10.29");
    expect(screen.getByRole("status")).toHaveTextContent("2026-10-29");
    fireEvent.click(toggle());
    fireEvent.click(day("2026年10月30日金曜日"));
    expect(screen.getByRole("status")).toHaveTextContent("2026-10-30");
    expect(field().value).toBe("2026年10月30日");
  });
});

describe("DatePicker in FormField", () => {
  it("connects the label, description and error to the input", () => {
    render(
      <FormField label="開始日" description="営業日を選びます" error="日付を入力してください">
        <DatePicker />
      </FormField>,
    );
    expect(screen.getByLabelText("開始日")).toBe(field());
    expect(field()).toHaveAttribute("aria-invalid", "true");
    expect(field()).toHaveClass("input--error");
    const describedBy = (field().getAttribute("aria-describedby") ?? "").split(" ");
    expect(describedBy).toHaveLength(2);
    expect(document.getElementById(describedBy[1] as string)).toHaveTextContent(
      "日付を入力してください",
    );
  });

  it("passes required through to the input", () => {
    render(
      <FormField label="開始日" required>
        <DatePicker />
      </FormField>,
    );
    expect(field()).toBeRequired();
  });
});
