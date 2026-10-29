"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useId,
  forwardRef,
  cloneElement,
  isValidElement,
  type ReactNode,
  type ReactElement,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { composeEventHandlers } from "@/lib/composeEventHandlers";
import { isComposingEvent, normalizeJa } from "@/lib/jaText";

/* ── Types ─────────────────────────────────────────────────── */

export interface DropdownProps {
  children: ReactNode;
  open?: boolean;
  /** Initial open state for uncontrolled usage */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface DropdownTriggerProps {
  /**
   * A single element (e.g. <Button>) receives the trigger props directly.
   * Anything else is wrapped in a <button type="button">.
   */
  children: ReactNode;
}

export interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface DropdownItemProps extends HTMLAttributes<HTMLDivElement> {
  onSelect?: () => void;
  disabled?: boolean;
  children: ReactNode;
}

export type DropdownSeparatorProps = Record<string, never>;

/* ── Context ───────────────────────────────────────────────── */

type InitialFocus = "first" | "last" | "menu";

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  openWith: (focus: InitialFocus) => void;
  initialFocusRef: React.RefObject<InitialFocus>;
  triggerRef: React.RefObject<HTMLElement | null>;
  triggerId: string;
  menuId: string;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext(): DropdownContextValue {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("Dropdown compound components must be used within a <Dropdown>");
  }
  return context;
}

const ITEM_SELECTOR = '[data-dropdown-item]:not([data-disabled="true"])';

function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === "function") ref(node);
  else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
}

/* ── Dropdown ──────────────────────────────────────────────── */

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ children, open: controlledOpen, defaultOpen = false, onOpenChange }, ref) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;
    const triggerRef = useRef<HTMLElement | null>(null);
    const initialFocusRef = useRef<InitialFocus>("menu");
    const triggerId = useId();
    const menuId = useId();

    const setOpen = useCallback(
      (value: boolean) => {
        if (!isControlled) {
          setInternalOpen(value);
        }
        onOpenChange?.(value);
      },
      [isControlled, onOpenChange],
    );

    const openWith = useCallback(
      (focus: InitialFocus) => {
        initialFocusRef.current = focus;
        setOpen(true);
      },
      [setOpen],
    );

    return (
      <DropdownContext.Provider
        value={{ open, setOpen, openWith, initialFocusRef, triggerRef, triggerId, menuId }}
      >
        <div ref={ref} style={{ display: "contents" }}>
          {children}
        </div>
      </DropdownContext.Provider>
    );
  },
);

Dropdown.displayName = "Dropdown";

/* ── DropdownTrigger ───────────────────────────────────────── */

type TriggerChildProps = {
  id?: string;
  ref?: Ref<HTMLElement>;
  onClick?: (e: ReactMouseEvent<HTMLElement>) => void;
  onKeyDown?: (e: ReactKeyboardEvent<HTMLElement>) => void;
};

export const DropdownTrigger = forwardRef<HTMLElement, DropdownTriggerProps>(
  ({ children }, ref) => {
    const { open, setOpen, openWith, triggerRef, triggerId, menuId } = useDropdownContext();

    const handleClick = (e: ReactMouseEvent<HTMLElement>) => {
      if (open) {
        setOpen(false);
        return;
      }
      // detail === 0: click synthesized from Enter / Space, so land on the first item.
      openWith(e.detail === 0 ? "first" : "menu");
    };

    const handleKeyDown = (e: ReactKeyboardEvent<HTMLElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        openWith("first");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        openWith("last");
      }
    };

    const element = isValidElement(children) ? (children as ReactElement<TriggerChildProps>) : null;
    const childProps = element?.props;

    const setRef = (node: HTMLElement | null) => {
      triggerRef.current = node;
      assignRef(ref, node);
      assignRef(childProps?.ref, node);
    };

    const triggerProps = {
      ref: setRef,
      id: childProps?.id ?? triggerId,
      "aria-haspopup": "menu" as const,
      "aria-expanded": open,
      "aria-controls": open ? menuId : undefined,
      "data-state": open ? "open" : "closed",
      onClick: composeEventHandlers(childProps?.onClick, handleClick),
      onKeyDown: composeEventHandlers(childProps?.onKeyDown, handleKeyDown),
    };

    if (element) return cloneElement(element, triggerProps);

    return (
      <button type="button" {...triggerProps}>
        {children}
      </button>
    );
  },
);

DropdownTrigger.displayName = "DropdownTrigger";

/* ── DropdownMenu ──────────────────────────────────────────── */

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ children, className, style, onKeyDown, ...rest }, ref) => {
    const { open, setOpen, triggerRef, initialFocusRef, triggerId, menuId } = useDropdownContext();
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = useState<{ top: number; left: number }>({
      top: 0,
      left: 0,
    });
    const typeaheadRef = useRef({ buffer: "", timer: 0 });

    // The menu is position: fixed, so viewport coordinates are used as-is (no scroll offset).
    useEffect(() => {
      if (!open || !triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 4, left: rect.left });
    }, [open, triggerRef]);

    // Move real focus into the menu when opened (menu items are roving-focus targets).
    useEffect(() => {
      if (!open || !menuRef.current) return;
      const items = menuRef.current.querySelectorAll<HTMLElement>(ITEM_SELECTOR);
      const mode = initialFocusRef.current;
      const target =
        mode === "first" ? items[0] : mode === "last" ? items[items.length - 1] : undefined;
      (target ?? menuRef.current).focus({ preventScroll: true });
    }, [open, initialFocusRef]);

    useEffect(() => {
      const state = typeaheadRef.current;
      return () => window.clearTimeout(state.timer);
    }, []);

    // Close on outside click
    useEffect(() => {
      if (!open) return;
      const handleClickOutside = (e: MouseEvent) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(e.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open, setOpen, triggerRef]);

    const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (isComposingEvent(e)) return;
      const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? []);
      const current = items.indexOf(document.activeElement as HTMLElement);
      const focusAt = (index: number) => items[index]?.focus({ preventScroll: false });

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          focusAt(current < items.length - 1 ? current + 1 : 0);
          return;
        case "ArrowUp":
          e.preventDefault();
          focusAt(current > 0 ? current - 1 : items.length - 1);
          return;
        case "Home":
          e.preventDefault();
          focusAt(0);
          return;
        case "End":
          e.preventDefault();
          focusAt(items.length - 1);
          return;
        case "Escape":
          e.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
          return;
        case "Tab":
          // Focus the trigger first so the default Tab action continues from there.
          triggerRef.current?.focus();
          setOpen(false);
          return;
      }

      // Typeahead: printable single characters jump to the next matching item.
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const state = typeaheadRef.current;
        if (e.key === " " && state.buffer === "") return;
        e.preventDefault();
        window.clearTimeout(state.timer);
        state.buffer += e.key;
        state.timer = window.setTimeout(() => {
          state.buffer = "";
        }, 500);
        const query = normalizeJa(state.buffer);
        const ordered = [...items.slice(current + 1), ...items.slice(0, current + 1)];
        const match = ordered.find((item) => normalizeJa(item.textContent ?? "").startsWith(query));
        match?.focus();
      }
    };

    if (!open) return null;
    if (typeof document === "undefined") return null;

    return createPortal(
      <div
        {...rest}
        ref={(node) => {
          menuRef.current = node;
          assignRef(ref, node);
        }}
        id={menuId}
        role="menu"
        tabIndex={-1}
        aria-labelledby={rest["aria-labelledby"] ?? triggerId}
        className={cn("dropdown__menu", className)}
        data-state="open"
        style={{ ...style, top: position.top, left: position.left }}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      >
        {children}
      </div>,
      document.body,
    );
  },
);

DropdownMenu.displayName = "DropdownMenu";

/* ── DropdownItem ──────────────────────────────────────────── */

export const DropdownItem = forwardRef<HTMLDivElement, DropdownItemProps>(
  ({ onSelect, disabled, children, className, onClick, onKeyDown, onMouseEnter, ...rest }, ref) => {
    const { setOpen, triggerRef } = useDropdownContext();

    const select = () => {
      if (disabled) return;
      onSelect?.();
      setOpen(false);
      triggerRef.current?.focus();
    };

    const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (isComposingEvent(e)) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        select();
      }
    };

    // Keep hover and keyboard highlight in sync: the hovered item takes real focus.
    const handleMouseEnter = (e: ReactMouseEvent<HTMLDivElement>) => {
      if (!disabled) e.currentTarget.focus({ preventScroll: true });
    };

    return (
      <div
        {...rest}
        ref={ref}
        role="menuitem"
        tabIndex={disabled ? undefined : -1}
        data-dropdown-item=""
        data-disabled={disabled || undefined}
        className={cn("dropdown__item", className)}
        onClick={composeEventHandlers(onClick, select)}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
        onMouseEnter={composeEventHandlers(onMouseEnter, handleMouseEnter)}
        aria-disabled={disabled || undefined}
      >
        {children}
      </div>
    );
  },
);

DropdownItem.displayName = "DropdownItem";

/* ── DropdownSeparator ─────────────────────────────────────── */

export const DropdownSeparator = forwardRef<HTMLDivElement, DropdownSeparatorProps>(
  (_props, ref) => {
    // biome-ignore lint/a11y/useSemanticElements: the forwarded ref is typed as HTMLDivElement (public API); switching to <hr> would change the exported types.
    return <div ref={ref} role="separator" className="dropdown__separator" />;
  },
);

DropdownSeparator.displayName = "DropdownSeparator";
