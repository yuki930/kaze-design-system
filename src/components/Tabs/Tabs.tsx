"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useId,
  useRef,
  createContext,
  useContext,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type ElementType,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";
import { composeEventHandlers } from "@/lib/composeEventHandlers";
import { warnDeprecated } from "@/lib/deprecate";
import { Slot } from "@/lib/Slot";

/* ── TabsContext ───────────────────────────────────────────── */

/**
 * Shared id prefix for connecting Tab and TabPanel via ARIA attributes.
 * The TabGroup wrapper provides this; Tab and TabPanel consume it.
 */
interface TabsContextValue {
  prefix: string;
  /** undefined when the group has no value (legacy `active` / `selected` props then decide) */
  value: string | undefined;
  select: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

/* ── TabGroup ─────────────────────────────────────────────── */

export interface TabGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  /** 選択中の Tab の value（制御） */
  value?: string;
  /** 初期の value（非制御） */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

/**
 * Wrapper that provides a shared id prefix so that Tab and TabPanel
 * can generate matching `id` / `aria-controls` / `aria-labelledby` values.
 *
 * Usage:
 * ```
 * <TabGroup defaultValue="a">
 *   <Tabs>
 *     <Tab value="a">A</Tab>
 *     <Tab value="b">B</Tab>
 *   </Tabs>
 *   <TabPanel value="a">…</TabPanel>
 *   <TabPanel value="b">…</TabPanel>
 * </TabGroup>
 * ```
 * 制御する場合は `value` と `onValueChange` を渡す。
 * ```
 * ```
 */
export const TabGroup = forwardRef<HTMLDivElement, TabGroupProps>(
  ({ value: valueProp, defaultValue, onValueChange, children, className, ...rest }, ref) => {
    const prefix = useId();
    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : internalValue;

    const select = useCallback(
      (next: string) => {
        if (!isControlled) setInternalValue(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const context = useMemo(() => ({ prefix, value, select }), [prefix, value, select]);

    return (
      <TabsContext.Provider value={context}>
        <div ref={ref} className={className} {...rest}>
          {children}
        </div>
      </TabsContext.Provider>
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
  ({ variant = "default", className, children, onKeyDown, ...rest }, ref) => {
    const listRef = useRef<HTMLDivElement | null>(null);
    const fallbackTabRef = useRef<HTMLElement | null>(null);

    // With no active tab every tab is tabIndex=-1 and the tablist cannot be reached by Tab.
    // Tab cannot see its siblings, so the first enabled tab is made tabbable here, and
    // handed back as soon as a real active tab exists.
    useEffect(() => {
      const list = listRef.current;
      if (!list) return;
      const hasActive = list.querySelector('[role="tab"][aria-selected="true"]') !== null;
      const previous = fallbackTabRef.current;
      if (previous && previous.getAttribute("aria-selected") !== "true") {
        previous.tabIndex = -1;
      }
      fallbackTabRef.current = null;
      if (hasActive) return;
      const first = list.querySelector<HTMLElement>('[role="tab"]:not([disabled])');
      if (first) {
        first.tabIndex = 0;
        fallbackTabRef.current = first;
      }
    });

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
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
    }, []);

    return (
      <div
        {...rest}
        ref={(node) => {
          listRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        role="tablist"
        aria-orientation="horizontal"
        className={cn("tabs", variant === "pills" && "tabs--pills", className)}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      >
        {children}
      </div>
    );
  },
);

Tabs.displayName = "Tabs";

/* ── Tab ───────────────────────────────────────────────────── */

export interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** @deprecated `TabGroup` の `value` / `defaultValue` で選択を管理する。次のマイナーで削除 */
  active?: boolean;
  id?: string;
  /** Tab の value。選択状態の判定と aria-controls / id の自動生成に使用 */
  value?: string;
  /** 子要素（`<a>` など）にタブの見た目と挙動を渡す */
  asChild?: boolean;
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ active: activeProp, id, value, asChild, className, children, onClick, ...rest }, ref) => {
    const context = useContext(TabsContext);
    const fallbackPrefix = useId();
    const prefix = context?.prefix ?? fallbackPrefix;

    if (activeProp !== undefined) {
      warnDeprecated(
        "Tab.active",
        "Tab の `active` は `TabGroup` の `value` / `defaultValue` に置き換わりました。次のマイナーバージョンで削除します",
      );
    }
    const active =
      context?.value !== undefined ? value !== undefined && value === context.value : activeProp;

    // Build unique ids for ARIA connection
    const tabId = id ?? (value ? `${prefix}-tab-${value}` : undefined);
    const panelId = value ? `${prefix}-panel-${value}` : undefined;

    // Extract text for data-text attr (prevents layout shift on bold)
    const text = typeof children === "string" ? children : undefined;

    const handleClick = () => {
      if (value !== undefined) context?.select(value);
    };

    const Comp: ElementType = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        id={tabId}
        role="tab"
        type={asChild ? undefined : "button"}
        aria-selected={active}
        aria-controls={panelId}
        tabIndex={active ? 0 : -1}
        className={cn("tab", active && "tab--active", className)}
        data-state={active ? "active" : "inactive"}
        data-text={text}
        {...rest}
        onClick={composeEventHandlers(onClick, handleClick)}
      >
        {children}
      </Comp>
    );
  },
);

Tab.displayName = "Tab";

/* ── TabPanel ─────────────────────────────────────────────── */

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Tab の value と対応する値 */
  value: string;
  /** @deprecated `TabGroup` の `value` / `defaultValue` で選択を管理する。次のマイナーで削除 */
  selected?: string;
}

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ value, selected: selectedProp, children, className, ...rest }, ref) => {
    const context = useContext(TabsContext);
    const fallbackPrefix = useId();
    const prefix = context?.prefix ?? fallbackPrefix;

    const panelId = `${prefix}-panel-${value}`;
    const tabId = `${prefix}-tab-${value}`;

    if (selectedProp !== undefined) {
      warnDeprecated(
        "TabPanel.selected",
        "TabPanel の `selected` は `TabGroup` の `value` / `defaultValue` に置き換わりました。次のマイナーバージョンで削除します",
      );
    }
    const selected = context?.value !== undefined ? context.value : selectedProp;

    if (value !== selected) return null;
    return (
      <div
        ref={ref}
        id={panelId}
        role="tabpanel"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: APG tabs pattern, a panel without focusable content must itself be tabbable so keyboard users can reach it.
        tabIndex={0}
        aria-labelledby={tabId}
        className={cn("tab-panel", className)}
        data-state="active"
        {...rest}
      >
        {children}
      </div>
    );
  },
);

TabPanel.displayName = "TabPanel";
