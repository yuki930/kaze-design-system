import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Search } from "./Search";

describe("Search", () => {
  it("renders a type=search input with the Japanese default placeholder", () => {
    render(<Search />);
    const input = screen.getByRole("searchbox", { name: "検索" });
    expect(input).toHaveAttribute("type", "search");
    expect(input).toHaveAttribute("enterkeyhint", "search");
    expect(input).toHaveAttribute("placeholder", "検索");
  });

  it("calls onChange per keystroke but not onSearch", () => {
    const onChange = vi.fn();
    const onSearch = vi.fn();
    render(<Search onChange={onChange} onSearch={onSearch} />);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "かぜ" } });
    expect(onChange).toHaveBeenCalledWith("かぜ");
    expect(onSearch).not.toHaveBeenCalled();
  });

  it("calls onSearch on Enter", () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} />);
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "kaze" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSearch).toHaveBeenCalledWith("kaze");
  });

  it("does not call onSearch on Enter during IME composition", () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} />);
    const input = screen.getByRole("searchbox");
    fireEvent.keyDown(input, { key: "Enter", isComposing: true });
    fireEvent.keyDown(input, { key: "Enter", keyCode: 229 });
    expect(onSearch).not.toHaveBeenCalled();
  });

  it("forwards inputProps to the input and composes onKeyDown", () => {
    const onKeyDown = vi.fn();
    const onSearch = vi.fn();
    render(
      <Search
        onSearch={onSearch}
        inputProps={{ name: "q", autoComplete: "off", onKeyDown }}
        data-testid="wrapper"
      />,
    );
    const input = screen.getByRole("searchbox");
    expect(input).toHaveAttribute("name", "q");
    expect(input).toHaveAttribute("autocomplete", "off");
    expect(screen.getByTestId("wrapper")).toHaveAttribute("role", "search");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onKeyDown).toHaveBeenCalled();
    expect(onSearch).toHaveBeenCalled();
  });

  it("works uncontrolled", () => {
    render(<Search />);
    const input = screen.getByRole("searchbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "abc" } });
    expect(input.value).toBe("abc");
  });
});
