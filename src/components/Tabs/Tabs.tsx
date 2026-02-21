"use client";

import {
  forwardRef,
  useCallback,
  useId,
  createContext,
  useContext,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";

/* ── TabsContext ───────────────────────────────────────────── */

/**
 * Shared id prefix for connecting Tab and TabPanel via ARIA attributes.
 * The TabGroup wrapper provides this; Tab and TabPanel consume it.
 */
const TabsIdContext = createContext<string | undefined>(undefined);

/* ── TabGroup ─────────────────────────────────────────────── */

export interface TabGroupProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * Wrapper that provides a shared id prefix so that Tab and TabPanel
 * can generate matching `id` / `aria-controls` / `aria-labelledby` values.
 *
 * Usage:
 * ```
 * <TabGroup>
 *   <Tabs>
 *     <Tab value="a" active>A</Tab>
 *     <Tab value="b">B</Tab>
 *   </Tabs>
 *   <TabPanel value="a" selected="a">…</TabPanel>
 *   <TabPanel value="b" selected="a">…</TabPanel>
 * </TabGroup>
 * ```
 */
export const TabGroup = forwardRef<HTMLDivElement, TabGroupProps>(
  ({ children, className, ...rest }, ref) => {
    const prefix = useId();
    return (
      <TabsIdContext.Provider value={prefix}>
        <div ref={ref} className={className} {...rest}>
          {children}
        </div>
      </TabsIdContext.Provider>
    );
  },
);

TabGroup.displayName = "TabGroup";

/* ── Tabs ──────────────────────────────────────────────────── */

export type TabsVariant = "default" | "pills";

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  variant?: TabsVariant;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ variant = "default", className, children, ...rest }, ref) => {
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.getAttribute("role") !== "tab") return;

        const tabs = Array.from(
          (e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>(
            '[role="tab"]:not([disabled])',
          ),
        );

        const currentIndex = tabs.indexOf(target);
        if (currentIndex === -1) return;

        let nextIndex: number | null = null;

        if (e.key === "ArrowRight") {
          nextIndex = (currentIndex + 1) % tabs.length;
        } else if (e.key === "ArrowLeft") {
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        } else if (e.key === "Home") {
          nextIndex = 0;
        } else if (e.key === "End") {
          nextIndex = tabs.length - 1;
        }

        if (nextIndex !== null) {
          const nextTab = tabs[nextIndex];
          if (nextTab) {
            e.preventDefault();
            nextTab.focus();
            nextTab.click();
          }
        }
      },
      [],
    );

    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          "tabs",
          variant === "pills" && "tabs--pills",
          className,
        )}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Tabs.displayName = "Tabs";

/* ── Tab ───────────────────────────────────────────────────── */

export interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  id?: string;
  /** Tab の value — aria-controls / id の自動生成に使用 */
  value?: string;
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ active, id, value, className, children, ...rest }, ref) => {
    const contextPrefix = useContext(TabsIdContext);
    const fallbackPrefix = useId();
    const prefix = contextPrefix ?? fallbackPrefix;

    // Build unique ids for ARIA connection
    const tabId = id ?? (value ? `${prefix}-tab-${value}` : undefined);
    const panelId = value ? `${prefix}-panel-${value}` : undefined;

    // Extract text for data-text attr (prevents layout shift on bold)
    const text = typeof children === "string" ? children : undefined;

    return (
      <button
        ref={ref}
        id={tabId}
        role="tab"
        aria-selected={active}
        aria-controls={panelId}
        tabIndex={active ? 0 : -1}
        className={cn("tab", active && "tab--active", className)}
        data-text={text}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

Tab.displayName = "Tab";

/* ── TabPanel ─────────────────────────────────────────────── */

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Tab の value と対応する値 */
  value: string;
  /** 現在選択されている Tab の value */
  selected?: string;
}

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ value, selected, children, className, ...rest }, ref) => {
    const contextPrefix = useContext(TabsIdContext);
    const fallbackPrefix = useId();
    const prefix = contextPrefix ?? fallbackPrefix;

    const panelId = `${prefix}-panel-${value}`;
    const tabId = `${prefix}-tab-${value}`;

    if (value !== selected) return null;
    return (
      <div
        ref={ref}
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId}
        className={cn("tab-panel", className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

TabPanel.displayName = "TabPanel";
