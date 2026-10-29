import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ThemeScript } from "./ThemeScript";

describe("ThemeScript", () => {
  it("renders an inline script that reads the ThemeProvider storage keys", () => {
    const { container } = render(<ThemeScript defaultTheme="system" />);
    const script = container.querySelector("script");
    expect(script).not.toBeNull();
    expect(script?.innerHTML).toContain('"kaze-theme"');
    expect(script?.innerHTML).toContain('"kaze-palette"');
    expect(script?.innerHTML).toContain('t="system"');
  });

  it("applies the stored theme when executed", () => {
    localStorage.setItem("kaze-theme", "dark");
    localStorage.setItem("kaze-palette", "cool");
    const { container } = render(<ThemeScript />);
    // jsdom does not execute injected scripts; run the same code by hand
    new Function(container.querySelector("script")?.innerHTML ?? "")();
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(document.documentElement.getAttribute("data-palette")).toBe("cool");
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("data-palette");
  });
});
