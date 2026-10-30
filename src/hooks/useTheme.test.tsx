import { act, render, renderHook, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, useTheme } from "./useTheme";

type Listener = (e: MediaQueryListEvent) => void;

let systemDark = false;
let listeners: Set<Listener>;
const addSpy = vi.fn();
const removeSpy = vi.fn();

function emitSystemChange(dark: boolean) {
  systemDark = dark;
  for (const l of listeners) l({ matches: dark } as MediaQueryListEvent);
}

beforeEach(() => {
  systemDark = false;
  listeners = new Set();
  addSpy.mockClear();
  removeSpy.mockClear();
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("data-palette");
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      get matches() {
        return systemDark;
      },
      media: query,
      addEventListener: (_: string, l: Listener) => {
        addSpy();
        listeners.add(l);
      },
      removeEventListener: (_: string, l: Listener) => {
        removeSpy();
        listeners.delete(l);
      },
    })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const root = () => document.documentElement;

function setup(defaultTheme?: "light" | "dark" | "system") {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ThemeProvider defaultTheme={defaultTheme}>{children}</ThemeProvider>
  );
  return renderHook(() => useTheme(), { wrapper });
}

describe("ThemeProvider / useTheme", () => {
  it("defaults to light / warm with nothing stored", () => {
    const { result } = setup();
    expect(result.current.theme).toBe("light");
    expect(result.current.resolvedTheme).toBe("light");
    expect(result.current.palette).toBe("warm");
    expect(root()).toHaveAttribute("data-theme", "light");
    expect(root()).not.toHaveAttribute("data-palette");
  });

  it("renders its children", () => {
    render(
      <ThemeProvider>
        <span>子要素</span>
      </ThemeProvider>,
    );
    expect(screen.getByText("子要素")).toBeInTheDocument();
  });

  it("reads the stored theme and palette on mount", () => {
    localStorage.setItem("kaze-theme", "dark");
    localStorage.setItem("kaze-palette", "cool");
    const { result } = setup();
    expect(result.current.theme).toBe("dark");
    expect(result.current.resolvedTheme).toBe("dark");
    expect(result.current.palette).toBe("cool");
    expect(root()).toHaveAttribute("data-theme", "dark");
    expect(root()).toHaveAttribute("data-palette", "cool");
  });

  it("ignores invalid stored values", () => {
    localStorage.setItem("kaze-theme", "sepia");
    localStorage.setItem("kaze-palette", "neon");
    const { result } = setup();
    expect(result.current.theme).toBe("light");
    expect(result.current.palette).toBe("warm");
    expect(root()).toHaveAttribute("data-theme", "light");
    expect(root()).not.toHaveAttribute("data-palette");
  });

  it("keeps defaultTheme when the stored theme matches it", () => {
    localStorage.setItem("kaze-theme", "dark");
    const { result } = setup("dark");
    expect(result.current.theme).toBe("dark");
    expect(result.current.resolvedTheme).toBe("dark");
    expect(root()).toHaveAttribute("data-theme", "dark");
  });

  it("setTheme persists, updates state and data-theme", () => {
    const { result } = setup();
    act(() => result.current.setTheme("dark"));
    expect(localStorage.getItem("kaze-theme")).toBe("dark");
    expect(result.current.theme).toBe("dark");
    expect(result.current.resolvedTheme).toBe("dark");
    expect(root()).toHaveAttribute("data-theme", "dark");
  });

  it("toggleTheme flips between light and dark", () => {
    const { result } = setup();
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe("dark");
    expect(root()).toHaveAttribute("data-theme", "dark");
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe("light");
    expect(localStorage.getItem("kaze-theme")).toBe("light");
    expect(root()).toHaveAttribute("data-theme", "light");
  });

  it("resolves system to the OS preference", () => {
    systemDark = true;
    localStorage.setItem("kaze-theme", "system");
    const { result } = setup();
    expect(result.current.theme).toBe("system");
    expect(result.current.resolvedTheme).toBe("dark");
    expect(root()).toHaveAttribute("data-theme", "dark");
  });

  it("follows OS changes while in system mode and stops listening afterwards", () => {
    const { result } = setup();
    act(() => result.current.setTheme("system"));
    expect(result.current.resolvedTheme).toBe("light");
    expect(listeners.size).toBe(1);

    act(() => emitSystemChange(true));
    expect(result.current.resolvedTheme).toBe("dark");
    expect(root()).toHaveAttribute("data-theme", "dark");
    expect(result.current.theme).toBe("system");

    act(() => emitSystemChange(false));
    expect(result.current.resolvedTheme).toBe("light");

    act(() => result.current.setTheme("dark"));
    expect(listeners.size).toBe(0);
    expect(removeSpy).toHaveBeenCalled();
  });

  it("toggleTheme from system picks the opposite of the resolved theme", () => {
    systemDark = true;
    const { result } = setup();
    act(() => result.current.setTheme("system"));
    expect(result.current.resolvedTheme).toBe("dark");
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe("light");
  });

  it("removes the system listener on unmount", () => {
    localStorage.setItem("kaze-theme", "system");
    const { unmount } = setup();
    expect(listeners.size).toBe(1);
    unmount();
    expect(listeners.size).toBe(0);
  });

  it.each(["ink", "indigo"] as const)(
    "setPalette(%s) sets data-palette to that name",
    (palette) => {
      const { result } = setup();
      act(() => result.current.setPalette(palette));
      expect(root()).toHaveAttribute("data-palette", palette);
      expect(localStorage.getItem("kaze-palette")).toBe(palette);
    },
  );

  it("ignores an unknown stored palette", () => {
    localStorage.setItem("kaze-palette", "sepia");
    const { result } = setup();
    expect(result.current.palette).toBe("warm");
    expect(root()).not.toHaveAttribute("data-palette");
  });

  it("setPalette persists and toggles data-palette", () => {
    const { result } = setup();
    act(() => result.current.setPalette("cool"));
    expect(result.current.palette).toBe("cool");
    expect(localStorage.getItem("kaze-palette")).toBe("cool");
    expect(root()).toHaveAttribute("data-palette", "cool");
    act(() => result.current.setPalette("warm"));
    expect(result.current.palette).toBe("warm");
    expect(localStorage.getItem("kaze-palette")).toBe("warm");
    expect(root()).not.toHaveAttribute("data-palette");
  });

  it("throws outside a ThemeProvider", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useTheme())).toThrow(
      "useTheme must be used within a ThemeProvider",
    );
    err.mockRestore();
  });
});

describe("ThemeProvider defaultTheme", () => {
  it("keeps defaultTheme when nothing is stored", () => {
    const { result } = setup("dark");
    expect(result.current.theme).toBe("dark");
    expect(root().getAttribute("data-theme")).toBe("dark");
  });

  it("resolves defaultTheme=system from the OS setting when nothing is stored", () => {
    systemDark = true;
    const { result } = setup("system");
    expect(result.current.theme).toBe("system");
    expect(root().getAttribute("data-theme")).toBe("dark");
  });

  it("lets a stored choice win over defaultTheme", () => {
    localStorage.setItem("kaze-theme", "light");
    const { result } = setup("dark");
    expect(result.current.theme).toBe("light");
    expect(root().getAttribute("data-theme")).toBe("light");
  });
});
