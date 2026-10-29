"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { composeEventHandlers } from "../../lib/composeEventHandlers";
import { Slot } from "../../lib/Slot";
import { cn } from "../../lib/utils";
import { computePlacement, type Align, type Side } from "../_internal/position";
import { mergeRefs } from "../_internal/refs";

/* ── Types ─────────────────────────────────────────────────── */

export type PopoverSide = Side;
export type PopoverAlign = Align;

export interface PopoverProps {
  children?: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Initial open state (uncontrolled) */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface PopoverTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render the single child element as the trigger instead of a `<button>` */
  asChild?: boolean;
}

export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Preferred side of the trigger. Flips to the opposite side when it would leave the viewport */
  side?: PopoverSide;
  align?: PopoverAlign;
  /** Gap between trigger and panel in px */
  sideOffset?: number;
  /** Anchor the panel to this element instead of the trigger (e.g. a whole input group) */
  anchorRef?: RefObject<HTMLElement | null>;
  /** Called when the panel opens. Call `preventDefault()` to take over initial focus */
  onOpenAutoFocus?: (event: Event) => void;
}

export interface PopoverCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

/* ── Context ───────────────────────────────────────────────── */

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: RefObject<HTMLElement | null>;
  contentId: string;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext(): PopoverContextValue {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error("Popover compound components must be used within a <Popover>");
  }
  return context;
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

const DEFAULT_OFFSET = 8;

/* ── Popover ───────────────────────────────────────────────── */

export function Popover({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentId = useId();

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef, contentId }}>
      {children}
    </PopoverContext.Provider>
  );
}

Popover.displayName = "Popover";

/* ── PopoverTrigger ────────────────────────────────────────── */

export const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ asChild, onClick, onKeyDown, children, ...rest }, ref) => {
    const { open, setOpen, triggerRef, contentId } = usePopoverContext();
    const Comp = asChild ? Slot : "button";

    const handleClick = (_event: ReactMouseEvent<HTMLButtonElement>) => setOpen(!open);
    const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      if (open && event.key === "Escape") {
        event.stopPropagation();
        setOpen(false);
      }
    };

    return (
      <Comp
        {...(asChild ? {} : { type: "button" })}
        {...rest}
        ref={mergeRefs(ref, triggerRef) as never}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? contentId : undefined}
        data-state={open ? "open" : "closed"}
        onClick={composeEventHandlers(onClick, handleClick)}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      >
        {children}
      </Comp>
    );
  },
);

PopoverTrigger.displayName = "PopoverTrigger";

/* ── PopoverContent ────────────────────────────────────────── */

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>((props, ref) => {
  const { open } = usePopoverContext();
  const [mounted, setMounted] = useState(false);

  // The portal target only exists on the client; avoids a hydration mismatch for defaultOpen.
  useEffect(() => setMounted(true), []);

  if (!open || !mounted) return null;
  return createPortal(<PopoverPanel ref={ref} {...props} />, document.body);
});

PopoverContent.displayName = "PopoverContent";

const PopoverPanel = forwardRef<HTMLDivElement, PopoverContentProps>(
  (
    {
      side = "bottom",
      align = "center",
      sideOffset = DEFAULT_OFFSET,
      anchorRef,
      onOpenAutoFocus,
      onKeyDown,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const { setOpen, triggerRef, contentId } = usePopoverContext();
    const panelRef = useRef<HTMLDivElement | null>(null);
    const [placement, setPlacement] = useState({ top: 0, left: 0, side });

    const updatePosition = useCallback(() => {
      const anchor = anchorRef?.current ?? triggerRef.current;
      const panel = panelRef.current;
      if (!anchor || !panel) return;
      setPlacement(
        computePlacement(
          anchor.getBoundingClientRect(),
          panel.getBoundingClientRect(),
          side,
          align,
          sideOffset,
        ),
      );
    }, [anchorRef, triggerRef, side, align, sideOffset]);

    useLayoutEffect(() => {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }, [updatePosition]);

    // Initial focus: first focusable element, otherwise the panel itself.
    // biome-ignore lint/correctness/useExhaustiveDependencies: runs once when the panel mounts (= opens)
    useEffect(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const event = new Event("popover.openAutoFocus", { cancelable: true });
      onOpenAutoFocus?.(event);
      if (event.defaultPrevented) return;
      (panel.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? panel).focus({
        preventScroll: true,
      });
    }, []);

    // Closing: hand focus back to the trigger when it would otherwise be lost.
    // A non-modal panel must not steal focus if the user already moved on to another control.
    useEffect(() => {
      const panel = panelRef.current;
      return () => {
        const trigger = triggerRef.current;
        const active = document.activeElement;
        const lost = !active || active === document.body || panel?.contains(active);
        if (lost && trigger?.isConnected) trigger.focus({ preventScroll: true });
      };
    }, [triggerRef]);

    useEffect(() => {
      const onMouseDown = (event: MouseEvent) => {
        const target = event.target as Node;
        if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
        setOpen(false);
        // Clicking a non-focusable area parks focus on <body> after this handler; take it back.
        window.setTimeout(() => {
          const trigger = triggerRef.current;
          if (document.activeElement === document.body && trigger?.isConnected) {
            trigger.focus({ preventScroll: true });
          }
        }, 0);
      };
      document.addEventListener("mousedown", onMouseDown);
      return () => document.removeEventListener("mousedown", onMouseDown);
    }, [setOpen, triggerRef]);

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      setOpen(false);
    };

    return (
      <div
        {...rest}
        ref={mergeRefs(ref, panelRef)}
        id={contentId}
        role="dialog"
        tabIndex={-1}
        data-state="open"
        data-side={placement.side}
        data-align={align}
        className={cn("popover__content", className)}
        style={{ ...style, top: placement.top, left: placement.left }}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      >
        {children}
      </div>
    );
  },
);

PopoverPanel.displayName = "PopoverPanel";

/* ── PopoverClose ──────────────────────────────────────────── */

export const PopoverClose = forwardRef<HTMLButtonElement, PopoverCloseProps>(
  ({ asChild, onClick, children, ...rest }, ref) => {
    const { setOpen } = usePopoverContext();
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        {...(asChild ? {} : { type: "button" })}
        {...rest}
        ref={ref as never}
        onClick={composeEventHandlers(onClick, () => setOpen(false))}
      >
        {children}
      </Comp>
    );
  },
);

PopoverClose.displayName = "PopoverClose";
