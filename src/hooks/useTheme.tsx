"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";
/**
 * Color palette. "warm" (砂) is the default and sets no attribute; the others set
 * `data-palette` on <html>: "cool" (霞), "ink" (墨), "indigo" (藍).
 */
export type Palette = "warm" | "cool" | "ink" | "indigo";

const PALETTES: readonly Palette[] = ["warm", "cool", "ink", "indigo"];

/**
 * Font set. "standard" is the default and sets no attribute: DM Sans for Latin,
 * Montserrat for displayed numbers, Noto Sans JP for kana and kanji. The others
 * set `data-font` on <html>: "neutral" (Inter + Noto Sans JP), "crisp" (IBM Plex Sans JP).
 * Load the fonts yourself (next/font or a <link>); Kaze only switches the stacks.
 */
export type FontSet = "standard" | "neutral" | "crisp";

const FONT_SETS: readonly FontSet[] = ["standard", "neutral", "crisp"];

export interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  palette: Palette;
  setPalette: (palette: Palette) => void;
  fontSet: FontSet;
  setFontSet: (fontSet: FontSet) => void;
}

const STORAGE_KEY = "kaze-theme";
const PALETTE_STORAGE_KEY = "kaze-palette";
const FONT_STORAGE_KEY = "kaze-font";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** The stored choice, or `fallback` (the provider's defaultTheme) when nothing valid is stored. */
function getStoredTheme(fallback: Theme): Theme {
  if (typeof window === "undefined") return fallback;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return fallback;
}

function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") return getSystemTheme();
  return theme;
}

function getStoredPalette(): Palette {
  if (typeof window === "undefined") return "warm";
  const stored = localStorage.getItem(PALETTE_STORAGE_KEY);
  if (stored && (PALETTES as readonly string[]).includes(stored)) return stored as Palette;
  return "warm";
}

function applyPalette(palette: Palette) {
  if (typeof document === "undefined") return;
  if (palette !== "warm") {
    document.documentElement.setAttribute("data-palette", palette);
  } else {
    document.documentElement.removeAttribute("data-palette");
  }
}

function getStoredFontSet(): FontSet {
  if (typeof window === "undefined") return "standard";
  const stored = localStorage.getItem(FONT_STORAGE_KEY);
  if (stored && (FONT_SETS as readonly string[]).includes(stored)) return stored as FontSet;
  return "standard";
}

function applyFontSet(fontSet: FontSet) {
  if (typeof document === "undefined") return;
  if (fontSet !== "standard") {
    document.documentElement.setAttribute("data-font", fontSet);
  } else {
    document.documentElement.removeAttribute("data-font");
  }
}

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme ?? "light");
  const [palette, setPaletteState] = useState<Palette>("warm");
  const [fontSet, setFontSetState] = useState<FontSet>("standard");

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(
    defaultTheme === "dark" ? "dark" : "light",
  );

  const applyTheme = useCallback((resolved: "light" | "dark") => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", resolved);
    }
    setResolvedTheme(resolved);
  }, []);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, newTheme);
      }
      applyTheme(resolveTheme(newTheme));
    },
    [applyTheme],
  );

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  }, [resolvedTheme, setTheme]);

  const setPalette = useCallback((newPalette: Palette) => {
    setPaletteState(newPalette);
    if (typeof window !== "undefined") {
      localStorage.setItem(PALETTE_STORAGE_KEY, newPalette);
    }
    applyPalette(newPalette);
  }, []);

  const setFontSet = useCallback((newFontSet: FontSet) => {
    setFontSetState(newFontSet);
    if (typeof window !== "undefined") {
      localStorage.setItem(FONT_STORAGE_KEY, newFontSet);
    }
    applyFontSet(newFontSet);
  }, []);

  // Read stored theme, palette & font set from localStorage on mount (client-side only)
  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only effect
  useEffect(() => {
    const stored = getStoredTheme(defaultTheme ?? "light");
    if (stored !== (defaultTheme ?? "light")) {
      setThemeState(stored);
    }
    applyTheme(resolveTheme(stored));

    const storedPalette = getStoredPalette();
    setPaletteState(storedPalette);
    applyPalette(storedPalette);

    const storedFontSet = getStoredFontSet();
    setFontSetState(storedFontSet);
    applyFontSet(storedFontSet);
  }, []);

  // Apply theme when theme changes (after initial mount)
  useEffect(() => {
    applyTheme(resolveTheme(theme));
  }, [theme, applyTheme]);

  // Listen for system theme changes when in "system" mode
  useEffect(() => {
    if (theme !== "system") return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      applyTheme(e.matches ? "dark" : "light");
    };

    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme, applyTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
      palette,
      setPalette,
      fontSet,
      setFontSet,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme, palette, setPalette, fontSet, setFontSet],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
