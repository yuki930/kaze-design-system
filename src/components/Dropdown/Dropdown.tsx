"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────── */

export interface DropdownProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface DropdownTriggerProps {
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

export interface DropdownSeparatorProps {}

/* ── Context ───────────────────────────────────────────────── */

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  itemCount: number;
  registerItem: () => number;
  resetItems: () => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext(): DropdownContextValue {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error(
      "Dropdown compound components must be used within a <Dropdown>",
    );
  }
  return context;
}

/* ── Dropdown ──────────────────────────────────────────────── */

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ children, open: controlledOpen, onOpenChange }, ref) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;
    const triggerRef = useRef<HTMLElement | null>(null);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const itemCountRef = useRef(0);

    const setOpen = useCallback(
      (value: boolean) => {
        if (!isControlled) {
          setInternalOpen(value);
        }
        onOpenChange?.(value);
        if (!value) {
          setHighlightedIndex(-1);
        }
      },
      [isControlled, onOpenChange],
    );

    const registerItem = useCallback(() => {
      return itemCountRef.current++;
    }, []);

    const resetItems = useCallback(() => {
      itemCountRef.current = 0;
    }, []);

    return (
      <DropdownContext.Provider
        value={{
          open,
          setOpen,
          triggerRef,
          highlightedIndex,
          setHighlightedIndex,
          itemCount: itemCountRef.current,
          registerItem,
          resetItems,
        }}
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

export const DropdownTrigger = forwardRef<HTMLSpanElement, DropdownTriggerProps>(
  ({ children }, ref) => {
    const { open, setOpen, triggerRef } = useDropdownContext();

    const handleClick = useCallback(() => {
      setOpen(!open);
    }, [open, setOpen]);

    const handleKeyDown = useCallback(
      (e: ReactKeyboardEvent) => {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen(true);
        }
      },
      [setOpen],
    );

    return (
      <span
        ref={(node) => {
          (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        role="button"
        tabIndex={0}
        aria-expanded={open ? "true" : "false"}
        aria-haspopup="menu"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        style={{ display: "inline-flex" }}
      >
        {children}
      </span>
    );
  },
);

DropdownTrigger.displayName = "DropdownTrigger";

/* ── DropdownMenu ──────────────────────────────────────────── */

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ children, className, ...rest }, ref) => {
    const {
      open,
      setOpen,
      triggerRef,
      highlightedIndex,
      setHighlightedIndex,
      resetItems,
    } = useDropdownContext();
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = useState<{ top: number; left: number }>({
      top: 0,
      left: 0,
    });
    const itemsRef = useRef<HTMLElement[]>([]);

    // Reset item registration on each render cycle when open
    useEffect(() => {
      if (open) {
        resetItems();
        itemsRef.current = [];
      }
    }, [open, resetItems]);

    // Position the menu below the trigger
    useEffect(() => {
      if (!open || !triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4 + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }, [open, triggerRef]);

    // Focus the menu when opened
    useEffect(() => {
      if (open && menuRef.current) {
        menuRef.current.focus();
      }
    }, [open]);

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
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [open, setOpen, triggerRef]);

    // Keyboard navigation
    const handleKeyDown = useCallback(
      (e: ReactKeyboardEvent) => {
        const items = menuRef.current?.querySelectorAll(
          `[data-dropdown-item]:not([data-disabled="true"])`,
        );
        if (!items || items.length === 0) return;

        const count = items.length;

        switch (e.key) {
          case "ArrowDown": {
            e.preventDefault();
            const next =
              highlightedIndex < count - 1 ? highlightedIndex + 1 : 0;
            setHighlightedIndex(next);
            break;
          }
          case "ArrowUp": {
            e.preventDefault();
            const prev =
              highlightedIndex > 0 ? highlightedIndex - 1 : count - 1;
            setHighlightedIndex(prev);
            break;
          }
          case "Enter":
          case " ": {
            e.preventDefault();
            if (highlightedIndex >= 0 && highlightedIndex < count) {
              (items[highlightedIndex] as HTMLElement).click();
            }
            break;
          }
          case "Escape": {
            e.preventDefault();
            setOpen(false);
            triggerRef.current?.focus();
            break;
          }
        }
      },
      [highlightedIndex, setHighlightedIndex, setOpen, triggerRef],
    );

    if (!open) return null;
    if (typeof document === "undefined") return null;

    return createPortal(
      <div
        ref={(node) => {
          menuRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        role="menu"
        tabIndex={-1}
        className={cn("dropdown__menu", className)}
        style={{ top: position.top, left: position.left }}
        onKeyDown={handleKeyDown}
        {...rest}
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
  ({ onSelect, disabled, children, className, ...rest }, ref) => {
    const { setOpen } = useDropdownContext();

    const handleClick = useCallback(() => {
      if (disabled) return;
      onSelect?.();
      setOpen(false);
    }, [disabled, onSelect, setOpen]);

    const handleKeyDown = useCallback(
      (e: ReactKeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      },
      [handleClick],
    );

    return (
      <div
        ref={ref}
        role="menuitem"
        tabIndex={disabled ? undefined : -1}
        data-dropdown-item=""
        data-disabled={disabled || undefined}
        className={cn("dropdown__item", className)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-disabled={disabled || undefined}
        {...rest}
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
    return <div ref={ref} role="separator" className="dropdown__separator" />;
  },
);

DropdownSeparator.displayName = "DropdownSeparator";
