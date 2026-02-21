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

export interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = "kaze-theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "light";
}

function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") return getSystemTheme();
  return theme;
}

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({
  children,
  defaultTheme,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme ?? "light");

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

  // Read stored theme from localStorage on mount (client-side only)
  useEffect(() => {
    const stored = getStoredTheme();
    if (stored !== (defaultTheme ?? "light")) {
      setThemeState(stored);
    }
    applyTheme(resolveTheme(stored));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
