import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { FormField } from "../FormField/FormField";
import { Combobox, type ComboboxOption } from "./Combobox";

const OPTIONS: ComboboxOption[] = [
  { value: "tokyo", label: "東京都", keywords: ["とうきょう", "tokyo"] },
  { value: "osaka", label: "大阪府", keywords: ["おおさか"] },
  { value: "kyoto", label: "京都府", keywords: ["きょうと"], disabled: true },
  { value: "hokkaido", label: "北海道", keywords: ["ほっかいどう"] },
  { value: "kana", label: "サッポロ" },
];

const input = () => screen.getByRole<HTMLInputElement>("combobox");
const optionLabels = () => screen.queryAllByRole("option").map((o) => o.textContent);

function open() {
  fireEvent.click(input());
}

function type(text: string) {
  fireEvent.change(input(), { target: { value: text } });
}

function key(k: string, init: KeyboardEventInit = {}) {
  fireEvent.keyDown(input(), { key: k, ...init });
}

describe("Combobox ARIA", () => {
  it("exposes the APG combobox contract on the input", () => {
    render(<Combobox options={OPTIONS} aria-label="都道府県" />);
    expect(input()).toHaveAttribute("aria-autocomplete", "list");
    expect(input()).toHaveAttribute("aria-expanded", "false");
    expect(input()).not.toHaveAttribute("aria-controls");
    expect(input()).not.toHaveAttribute("aria-activedescendant");
    expect(input()).toHaveAttribute("autocomplete", "off");
  });

  it("links aria-controls to the listbox and aria-activedescendant to the highlighted option", () => {
    render(<Combobox options={OPTIONS} aria-label="都道府県" />);
    open();
    const listbox = screen.getByRole("listbox");
    expect(input()).toHaveAttribute("aria-expanded", "true");
    expect(input()).toHaveAttribute("aria-controls", listbox.id);
    key("ArrowDown");
    const first = screen.getAllByRole("option")[0] as HTMLElement;
    expect(input()).toHaveAttribute("aria-activedescendant", first.id);
    expect(first).toHaveAttribute("data-highlighted", "true");
  });

  it("keeps DOM focus on the input while navigating", () => {
    render(<Combobox options={OPTIONS} aria-label="都道府県" />);
    input().focus();
    open();
    key("ArrowDown");
    key("ArrowDown");
    expect(input()).toHaveFocus();
  });

  it("marks the selected option with aria-selected and a disabled one with aria-disabled", () => {
    render(<Combobox options={OPTIONS} defaultValue="osaka" aria-label="都道府県" />);
    open();
    const options = screen.getAllByRole("option");
    expect(options[1]).toHaveAttribute("aria-selected", "true");
    expect(options[0]).toHaveAttribute("aria-selected", "false");
    expect(options[2]).toHaveAttribute("aria-disabled", "true");
  });
});

describe("Combobox filtering", () => {
  it("lists everything on open even when a value is selected", () => {
    render(<Combobox options={OPTIONS} defaultValue="osaka" aria-label="都道府県" />);
    expect(input().value).toBe("大阪府");
    open();
    expect(optionLabels()).toHaveLength(OPTIONS.length);
  });

  it("matches hiragana typed against kanji labels through keywords", () => {
    render(<Combobox options={OPTIONS} aria-label="都道府県" />);
    type("とうきょう");
    expect(optionLabels()).toEqual(["東京都"]);
  });

  it("ignores width and case differences", () => {
    render(<Combobox options={OPTIONS} aria-label="都道府県" />);
    type("ＴＯＫＹＯ");
    expect(optionLabels()).toEqual(["東京都"]);
  });

  it("matches halfwidth katakana against a katakana label and hiragana input", () => {
    render(<Combobox options={OPTIONS} aria-label="都道府県" />);
    type("ｻｯﾎﾟﾛ");
    expect(optionLabels()).toEqual(["サッポロ"]);
    type("さっぽろ");
    expect(optionLabels()).toEqual(["サッポロ"]);
  });

  it("shows the empty message (and no options) when nothing matches", () => {
    render(<Combobox options={OPTIONS} aria-label="都道府県" />);
    type("zzz");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByRole("status")).toHaveTextContent("候補がありません");
  });

  it("lets the empty message be replaced", () => {
    render(<Combobox options={OPTIONS} emptyMessage="該当なし" aria-label="都道府県" />);
    type("zzz");
    expect(screen.getByRole("status")).toHaveTextContent("該当なし");
  });

  it("accepts a custom filter", () => {
    const filter = vi.fn((option: ComboboxOption, query: string) => option.value.startsWith(query));
    render(<Combobox options={OPTIONS} filter={filter} aria-label="都道府県" />);
    type("ho");
    expect(optionLabels()).toEqual(["北海道"]);
    expect(filter).toHaveBeenCalled();
  });

  it("highlights the first enabled match as the user types", () => {
    render(<Combobox options={OPTIONS} aria-label="都道府県" />);
    type("都");
    // 東京都, 京都府 (disabled) → the first enabled match wins
    const active = screen.getAllByRole("option")[0] as HTMLElement;
    expect(input()).toHaveAttribute("aria-activedescendant", active.id);
  });
});

describe("Combobox keyboard", () => {
  it("opens with ArrowDown on the first option and with ArrowUp on the last", () => {
    const { unmount } = render(<Combobox options={OPTIONS} aria-label="都道府県" />);
    key("ArrowDown");
    expect(screen.getAllByRole("option")[0]).toHaveAttribute("data-highlighted", "true");
    unmount();
    render(<Combobox options={OPTIONS} aria-label="都道府県" />);
    key("ArrowUp");
    expect(screen.getAllByRole("option")[4]).toHaveAttribute("data-highlighted", "true");
  });

  it("opens on the selected option", () => {
    render(<Combobox options={OPTIONS} defaultValue="hokkaido" aria-label="都道府県" />);
    key("ArrowDown");
    expect(screen.getAllByRole("option")[3]).toHaveAttribute("data-highlighted", "true");
  });

  it("moves with ArrowDown / ArrowUp, skips disabled options and wraps", () => {
    render(<Combobox options={OPTIONS} aria-label="都道府県" />);
    key("ArrowDown"); // 東京都
    key("ArrowDown"); // 大阪府
    key("ArrowDown"); // skips 京都府 (disabled) → 北海道
    expect(screen.getAllByRole("option")[3]).toHaveAttribute("data-highlighted", "true");
    key("ArrowDown"); // サッポロ
    key("ArrowDown"); // wraps → 東京都
    expect(screen.getAllByRole("option")[0]).toHaveAttribute("data-highlighted", "true");
    key("ArrowUp"); // wraps back → サッポロ
    expect(screen.getAllByRole("option")[4]).toHaveAttribute("data-highlighted", "true");
  });

  it("jumps with Home and End while open, leaving them alone when closed", () => {
    render(<Combobox options={OPTIONS} aria-label="都道府県" />);
    const closedHome = createEvent.keyDown(input(), { key: "Home" });
    fireEvent(input(), closedHome);
    expect(closedHome.defaultPrevented).toBe(false);
    open();
    key("End");
    expect(screen.getAllByRole("option")[4]).toHaveAttribute("data-highlighted", "true");
    key("Home");
    expect(screen.getAllByRole("option")[0]).toHaveAttribute("data-highlighted", "true");
  });

  it("selects with Enter, closes, and reports the value", () => {
    const onValueChange = vi.fn();
    render(<Combobox options={OPTIONS} onValueChange={onValueChange} aria-label="都道府県" />);
    key("ArrowDown");
    key("ArrowDown");
    key("Enter");
    expect(onValueChange).toHaveBeenCalledWith("osaka");
    expect(input().value).toBe("大阪府");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(input()).toHaveAttribute("aria-expanded", "false");
  });

  it("does not submit the form when Enter picks an option, but submits when closed", () => {
    render(
      <form>
        <Combobox options={OPTIONS} aria-label="都道府県" />
      </form>,
    );
    key("ArrowDown");
    const picking = createEvent.keyDown(input(), { key: "Enter" });
    fireEvent(input(), picking);
    expect(picking.defaultPrevented).toBe(true);
    const closed = createEvent.keyDown(input(), { key: "Enter" });
    fireEvent(input(), closed);
    expect(closed.defaultPrevented).toBe(false);
  });

  it("closes on Escape, restores the selected label and stops the event", () => {
    const outer = vi.fn();
    render(
      // biome-ignore lint/a11y/noStaticElementInteractions: probe for event propagation
      <div onKeyDown={outer}>
        <Combobox options={OPTIONS} defaultValue="osaka" aria-label="都道府県" />
      </div>,
    );
    type("東");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    key("Escape");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(input().value).toBe("大阪府");
    expect(outer).not.toHaveBeenCalled();
  });

  it("lets Escape through when the list is closed", () => {
    const outer = vi.fn();
    render(
      // biome-ignore lint/a11y/noStaticElementInteractions: probe for event propagation
      <div onKeyDown={outer}>
        <Combobox options={OPTIONS} aria-label="都道府県" />
      </div>,
    );
    key("Escape");
    expect(outer).toHaveBeenCalled();
  });
});

describe("Combobox IME guard", () => {
  it("ignores Enter while a composition is in progress (isComposing)", () => {
    const onValueChange = vi.fn();
    render(<Combobox options={OPTIONS} onValueChange={onValueChange} aria-label="都道府県" />);
    type("とう");
    key("Enter", { isComposing: true });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("ignores Enter on browsers that only report keyCode 229", () => {
    const onValueChange = vi.fn();
    render(<Combobox options={OPTIONS} onValueChange={onValueChange} aria-label="都道府県" />);
    type("とう");
    key("Enter", { keyCode: 229 });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("ignores arrows during composition and does not open the list", () => {
    render(<Combobox options={OPTIONS} aria-label="都道府県" />);
    key("ArrowDown", { isComposing: true });
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("selects the top match once the composition is confirmed", () => {
    const onValueChange = vi.fn();
    render(<Combobox options={OPTIONS} onValueChange={onValueChange} aria-label="都道府県" />);
    type("おおさか");
    key("Enter", { isComposing: true });
    expect(onValueChange).not.toHaveBeenCalled();
    key("Enter");
    expect(onValueChange).toHaveBeenCalledWith("osaka");
  });
});

describe("Combobox pointer and blur", () => {
  it("selects an option on click", () => {
    const onValueChange = vi.fn();
    render(<Combobox options={OPTIONS} onValueChange={onValueChange} aria-label="都道府県" />);
    open();
    fireEvent.click(screen.getByRole("option", { name: "北海道" }));
    expect(onValueChange).toHaveBeenCalledWith("hokkaido");
    expect(input().value).toBe("北海道");
  });

  it("ignores clicks on disabled options", () => {
    const onValueChange = vi.fn();
    render(<Combobox options={OPTIONS} onValueChange={onValueChange} aria-label="都道府県" />);
    open();
    fireEvent.click(screen.getByRole("option", { name: "京都府" }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("keeps focus in the input by cancelling mousedown on the list", () => {
    render(<Combobox options={OPTIONS} aria-label="都道府県" />);
    open();
    const down = createEvent.mouseDown(screen.getByRole("listbox"));
    fireEvent(screen.getByRole("listbox"), down);
    expect(down.defaultPrevented).toBe(true);
  });

  it("closes on blur and restores the selected label", () => {
    render(<Combobox options={OPTIONS} defaultValue="osaka" aria-label="都道府県" />);
    type("zzz");
    fireEvent.blur(input());
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(input().value).toBe("大阪府");
  });

  it("clears the value when the text is emptied and the field blurs", () => {
    const onValueChange = vi.fn();
    render(
      <Combobox
        options={OPTIONS}
        defaultValue="osaka"
        onValueChange={onValueChange}
        aria-label="都道府県"
      />,
    );
    type("");
    fireEvent.blur(input());
    expect(onValueChange).toHaveBeenCalledWith(null);
    expect(input().value).toBe("");
  });

  it("treats a typed exact label as picked on blur", () => {
    const onValueChange = vi.fn();
    render(<Combobox options={OPTIONS} onValueChange={onValueChange} aria-label="都道府県" />);
    type("東京都");
    fireEvent.blur(input());
    expect(onValueChange).toHaveBeenCalledWith("tokyo");
  });

  it("does not open when disabled", () => {
    render(<Combobox options={OPTIONS} disabled aria-label="都道府県" />);
    open();
    expect(screen.queryByRole("listbox")).toBeNull();
  });
});

function Controlled() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <>
      <Combobox options={OPTIONS} value={value} onValueChange={setValue} aria-label="都道府県" />
      <output>{value ?? "none"}</output>
    </>
  );
}

describe("Combobox value", () => {
  it("works uncontrolled with defaultValue", () => {
    render(<Combobox options={OPTIONS} defaultValue="hokkaido" aria-label="都道府県" />);
    expect(input().value).toBe("北海道");
  });

  it("follows a controlled value and only reports requests", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Combobox
        options={OPTIONS}
        value="tokyo"
        onValueChange={onValueChange}
        aria-label="都道府県"
      />,
    );
    expect(input().value).toBe("東京都");
    open();
    fireEvent.click(screen.getByRole("option", { name: "大阪府" }));
    expect(onValueChange).toHaveBeenCalledWith("osaka");
    rerender(
      <Combobox
        options={OPTIONS}
        value="hokkaido"
        onValueChange={onValueChange}
        aria-label="都道府県"
      />,
    );
    expect(input().value).toBe("北海道");
  });

  it("works controlled with external state", () => {
    render(<Controlled />);
    open();
    fireEvent.click(screen.getByRole("option", { name: "東京都" }));
    expect(screen.getByRole("status", { hidden: true })).toHaveTextContent("tokyo");
  });

  it("submits the value (not the label) through a hidden input when `name` is set", () => {
    const { container } = render(
      <form>
        <Combobox options={OPTIONS} name="prefecture" defaultValue="osaka" aria-label="都道府県" />
      </form>,
    );
    const form = container.querySelector("form") as HTMLFormElement;
    expect(new FormData(form).get("prefecture")).toBe("osaka");
    expect(input()).not.toHaveAttribute("name");
    open();
    fireEvent.click(screen.getByRole("option", { name: "北海道" }));
    expect(new FormData(form).get("prefecture")).toBe("hokkaido");
  });

  it("submits an empty string when nothing is selected", () => {
    const { container } = render(
      <form>
        <Combobox options={OPTIONS} name="prefecture" aria-label="都道府県" />
      </form>,
    );
    expect(new FormData(container.querySelector("form") as HTMLFormElement).get("prefecture")).toBe(
      "",
    );
  });
});

describe("Combobox appearance and forms", () => {
  it("reuses the Input look and shows the error state from aria-invalid", () => {
    render(<Combobox options={OPTIONS} aria-invalid="true" aria-label="都道府県" />);
    expect(input()).toHaveClass("input", "input--error");
    expect(input()).toHaveAttribute("aria-invalid", "true");
  });

  it("applies the size modifier", () => {
    const { container } = render(<Combobox options={OPTIONS} size="sm" aria-label="都道府県" />);
    expect(container.firstElementChild).toHaveClass("combobox--sm");
  });

  it("wires id, label and describedby through FormField", () => {
    render(
      <FormField label="都道府県" description="居住地を選びます" error="必須です">
        <Combobox options={OPTIONS} />
      </FormField>,
    );
    const field = screen.getByLabelText("都道府県");
    expect(field).toBe(input());
    expect(input()).toHaveAttribute("aria-invalid", "true");
    const describedBy = (input().getAttribute("aria-describedby") ?? "").split(" ");
    expect(describedBy).toHaveLength(2);
    expect(document.getElementById(describedBy[1] as string)).toHaveTextContent("必須です");
    expect(input()).toHaveClass("input--error");
  });

  it("forwards the ref to the input", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Combobox ref={ref} options={OPTIONS} aria-label="都道府県" />);
    expect(ref.current).toBe(input());
  });
});
