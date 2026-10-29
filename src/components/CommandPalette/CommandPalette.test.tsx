import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CommandPalette, type Command } from "./CommandPalette";

beforeAll(() => {
  // jsdom does not implement scrollIntoView
  Element.prototype.scrollIntoView = vi.fn();
});

function setup(overrides: Partial<React.ComponentProps<typeof CommandPalette>> = {}) {
  const onSelectA = vi.fn();
  const onSelectB = vi.fn();
  const commands: Command[] = [
    {
      id: "a",
      label: "ダッシュボードを開く",
      group: "移動",
      keywords: ["home", "ホーム"],
      onSelect: onSelectA,
    },
    { id: "b", label: "Settings", group: "設定", onSelect: onSelectB },
  ];
  const onOpenChange = vi.fn();
  render(<CommandPalette open onOpenChange={onOpenChange} commands={commands} {...overrides} />);
  return { onSelectA, onSelectB, onOpenChange };
}

describe("CommandPalette", () => {
  it("does not run the first command on Enter during IME composition", () => {
    const { onSelectA } = setup();
    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "Enter", isComposing: true });
    fireEvent.keyDown(input, { key: "Enter", keyCode: 229 });
    expect(onSelectA).not.toHaveBeenCalled();
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSelectA).toHaveBeenCalledTimes(1);
  });

  it("matches ignoring width, case and kana type", () => {
    setup();
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "ｓｅｔｔ" } });
    expect(screen.getAllByRole("option")).toHaveLength(1);
    fireEvent.change(input, { target: { value: "だっしゅ" } });
    expect(screen.getByRole("option", { name: /ダッシュボード/ })).toBeInTheDocument();
  });

  it("matches keywords", () => {
    setup();
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "HOME" } });
    expect(screen.getByRole("option", { name: /ダッシュボード/ })).toBeInTheDocument();
  });

  it("accepts a custom filter", () => {
    setup({ filter: (cmd) => cmd.id === "b" });
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "x" } });
    expect(screen.getAllByRole("option")).toHaveLength(1);
  });

  it("exposes the combobox pattern", () => {
    setup();
    const input = screen.getByRole("combobox");
    const listbox = screen.getByRole("listbox");
    expect(input).toHaveAttribute("aria-controls", listbox.id);
    expect(input).toHaveAttribute("aria-autocomplete", "list");
    const options = screen.getAllByRole("option");
    expect(input).toHaveAttribute("aria-activedescendant", options[0]?.id);
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveAttribute("aria-activedescendant", options[1]?.id);
    expect(options[1]).toHaveAttribute("aria-selected", "true");
  });

  it("labels groups and announces empty results", () => {
    setup();
    expect(screen.getByRole("group", { name: "移動" })).toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "zzzz" } });
    expect(screen.getByRole("status")).toHaveTextContent("該当するコマンドが見つかりません");
  });

  it("composes a consumer onKeyDown with the internal one", () => {
    const onKeyDown = vi.fn();
    const { onSelectA } = setup({ onKeyDown });
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "Enter" });
    expect(onKeyDown).toHaveBeenCalled();
    expect(onSelectA).toHaveBeenCalled();
  });
});

describe("CommandPalette data-state", () => {
  it("marks the dialog as open", () => {
    setup();
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open");
  });
});
