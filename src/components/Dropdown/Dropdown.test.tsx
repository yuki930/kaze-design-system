import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "./Dropdown";

function setup(props: { onSelect?: () => void; defaultOpen?: boolean } = {}) {
  return render(
    <Dropdown defaultOpen={props.defaultOpen}>
      <DropdownTrigger>
        <button type="button">操作</button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onSelect={props.onSelect}>編集</DropdownItem>
        <DropdownItem disabled>複製</DropdownItem>
        <DropdownItem>削除</DropdownItem>
        <DropdownItem>アーカイブ</DropdownItem>
      </DropdownMenu>
    </Dropdown>,
  );
}

describe("Dropdown trigger", () => {
  it("injects menu button attributes into the child without a wrapper role=button", () => {
    setup();
    const trigger = screen.getByRole("button", { name: "操作" });
    expect(trigger.tagName).toBe("BUTTON");
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens on click and links aria-controls to the menu", () => {
    setup();
    const trigger = screen.getByRole("button", { name: "操作" });
    fireEvent.click(trigger);
    const menu = screen.getByRole("menu");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", menu.id);
    expect(menu).toHaveAttribute("aria-labelledby", trigger.id);
  });

  it("opens on ArrowDown and focuses the first item", () => {
    setup();
    const trigger = screen.getByRole("button", { name: "操作" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(screen.getByRole("menuitem", { name: "編集" })).toHaveFocus();
  });

  it("opens on ArrowUp and focuses the last item", () => {
    setup();
    fireEvent.keyDown(screen.getByRole("button", { name: "操作" }), { key: "ArrowUp" });
    expect(screen.getByRole("menuitem", { name: "アーカイブ" })).toHaveFocus();
  });

  it("supports defaultOpen", () => {
    setup({ defaultOpen: true });
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });
});

describe("Dropdown menu keyboard", () => {
  function openMenu() {
    setup();
    fireEvent.keyDown(screen.getByRole("button", { name: "操作" }), { key: "ArrowDown" });
    return screen.getByRole("menu");
  }

  it("moves real focus with ArrowDown / ArrowUp, skipping disabled items and wrapping", () => {
    const menu = openMenu();
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(screen.getByRole("menuitem", { name: "削除" })).toHaveFocus();
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(screen.getByRole("menuitem", { name: "編集" })).toHaveFocus();
    fireEvent.keyDown(menu, { key: "ArrowUp" });
    expect(screen.getByRole("menuitem", { name: "アーカイブ" })).toHaveFocus();
  });

  it("supports Home and End", () => {
    const menu = openMenu();
    fireEvent.keyDown(menu, { key: "End" });
    expect(screen.getByRole("menuitem", { name: "アーカイブ" })).toHaveFocus();
    fireEvent.keyDown(menu, { key: "Home" });
    expect(screen.getByRole("menuitem", { name: "編集" })).toHaveFocus();
  });

  it("jumps with typeahead", () => {
    const menu = openMenu();
    fireEvent.keyDown(menu, { key: "ア" });
    expect(screen.getByRole("menuitem", { name: "アーカイブ" })).toHaveFocus();
  });

  it("closes on Escape and returns focus to the trigger", () => {
    const menu = openMenu();
    fireEvent.keyDown(menu, { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "操作" })).toHaveFocus();
  });

  it("closes on Tab", () => {
    const menu = openMenu();
    fireEvent.keyDown(menu, { key: "Tab" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("selects with Enter and calls onSelect", () => {
    const onSelect = vi.fn();
    setup({ onSelect });
    fireEvent.keyDown(screen.getByRole("button", { name: "操作" }), { key: "ArrowDown" });
    fireEvent.keyDown(screen.getByRole("menuitem", { name: "編集" }), { key: "Enter" });
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("ignores Enter during IME composition", () => {
    const onSelect = vi.fn();
    setup({ onSelect });
    fireEvent.keyDown(screen.getByRole("button", { name: "操作" }), { key: "ArrowDown" });
    fireEvent.keyDown(screen.getByRole("menuitem", { name: "編集" }), {
      key: "Enter",
      isComposing: true,
    });
    expect(onSelect).not.toHaveBeenCalled();
  });
});

describe("DropdownItem handlers", () => {
  it("calls both consumer onClick and onSelect", () => {
    const onClick = vi.fn();
    const onSelect = vi.fn();
    render(
      <Dropdown defaultOpen>
        <DropdownTrigger>
          <button type="button">操作</button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem onClick={onClick} onSelect={onSelect}>
            編集
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );
    fireEvent.click(screen.getByRole("menuitem", { name: "編集" }));
    expect(onClick).toHaveBeenCalled();
    expect(onSelect).toHaveBeenCalled();
  });
});
