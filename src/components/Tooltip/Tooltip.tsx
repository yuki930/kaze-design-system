"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useId,
  forwardRef,
  cloneElement,
  version as reactVersion,
  type CSSProperties,
  type ReactNode,
  type ReactElement,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────── */

export type TooltipSide = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  /** Content to render inside the tooltip */
  content: ReactNode;
  /** The element that triggers the tooltip */
  children: ReactElement;
  /** Controlled open state. Hover / focus / Escape then only call `onOpenChange` */
  open?: boolean;
  /** Initial open state (uncontrolled) */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Which side the tooltip appears on */
  side?: TooltipSide;
  /** Delay in ms before the tooltip shows */
  delay?: number;
  /** Extra class for the tooltip element */
  className?: string;
  /** Inline style for the tooltip element (position is controlled by the component) */
  style?: CSSProperties;
}

/* ── Positioning helpers ───────────────────────────────────── */

const GAP = 8;
const VIEWPORT_MARGIN = 4;
/** Grace period so the pointer can travel from trigger to tooltip (WCAG 1.4.13 hoverable) */
const HIDE_GRACE_MS = 100;
const REACT_MAJOR = Number.parseInt(reactVersion, 10);

const OPPOSITE: Record<TooltipSide, TooltipSide> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

// position: fixed, so coordinates are viewport-relative (no scroll offset).
function place(trigger: DOMRect, tip: DOMRect, side: TooltipSide): { top: number; left: number } {
  const centerX = trigger.left + trigger.width / 2 - tip.width / 2;
  const centerY = trigger.top + trigger.height / 2 - tip.height / 2;
  switch (side) {
    case "top":
      return { top: trigger.top - tip.height - GAP, left: centerX };
    case "bottom":
      return { top: trigger.bottom + GAP, left: centerX };
    case "left":
      return { top: centerY, left: trigger.left - tip.width - GAP };
    case "right":
      return { top: centerY, left: trigger.right + GAP };
  }
}

function overflows(pos: { top: number; left: number }, tip: DOMRect, side: TooltipSide): boolean {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (side === "top") return pos.top < 0;
  if (side === "bottom") return pos.top + tip.height > vh;
  if (side === "left") return pos.left < 0;
  return pos.left + tip.width > vw;
}

function getPosition(
  triggerRect: DOMRect,
  tipRect: DOMRect,
  side: TooltipSide,
): { top: number; left: number } {
  let pos = place(triggerRect, tipRect, side);
  if (overflows(pos, tipRect, side)) {
    const flipped = place(triggerRect, tipRect, OPPOSITE[side]);
    if (!overflows(flipped, tipRect, OPPOSITE[side])) pos = flipped;
  }
  const maxLeft = window.innerWidth - tipRect.width - VIEWPORT_MARGIN;
  const maxTop = window.innerHeight - tipRect.height - VIEWPORT_MARGIN;
  return {
    left: Math.max(VIEWPORT_MARGIN, Math.min(pos.left, maxLeft)),
    top: Math.max(VIEWPORT_MARGIN, Math.min(pos.top, maxTop)),
  };
}

type Ref<T> = ((node: T | null) => void) | { current: T | null } | null | undefined;

function assignRef<T>(ref: Ref<T>, node: T | null) {
  if (typeof ref === "function") ref(node);
  else if (ref) ref.current = node;
}

// React 19 exposes ref as a prop; reading element.ref there logs a warning. React 18 is the reverse.
function getChildRef(child: ReactElement): Ref<HTMLElement> {
  if (REACT_MAJOR >= 19) return (child.props as { ref?: Ref<HTMLElement> }).ref;
  return (child as unknown as { ref?: Ref<HTMLElement> }).ref;
}

/* ── Tooltip ───────────────────────────────────────────────── */

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      children,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      side = "top",
      delay = 200,
      className,
      style,
    },
    ref,
  ) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isControlled = openProp !== undefined;
    const open = isControlled ? openProp : internalOpen;
    const setOpen = useCallback(
      (next: boolean) => {
        if (!isControlled) setInternalOpen(next);
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange],
    );
    const [mounted, setMounted] = useState(false);
    const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const tooltipId = useId();

    const clearTimers = useCallback(() => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      showTimerRef.current = null;
      hideTimerRef.current = null;
    }, []);

    // Portal target only exists on the client; avoids hydration mismatch.
    useEffect(() => {
      setMounted(true);
      return clearTimers;
    }, [clearTimers]);

    const updatePosition = useCallback(() => {
      if (!triggerRef.current || !tooltipRef.current) return;
      setPosition(
        getPosition(
          triggerRef.current.getBoundingClientRect(),
          tooltipRef.current.getBoundingClientRect(),
          side,
        ),
      );
    }, [side]);

    useLayoutEffect(() => {
      if (!open) return;
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }, [open, updatePosition]);

    const show = useCallback(() => {
      clearTimers();
      showTimerRef.current = setTimeout(() => setOpen(true), delay);
    }, [delay, clearTimers, setOpen]);

    const hide = useCallback(() => {
      clearTimers();
      hideTimerRef.current = setTimeout(() => setOpen(false), HIDE_GRACE_MS);
    }, [clearTimers, setOpen]);

    // Keep open while the pointer is over the tooltip itself.
    const keepOpen = useCallback(() => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }, []);

    // WCAG 1.4.13 dismissible: Escape closes without moving focus.
    useEffect(() => {
      if (!open) return;
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          clearTimers();
          setOpen(false);
        }
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, clearTimers, setOpen]);

    const childProps = children.props as Record<string, unknown>;
    const childRef = getChildRef(children);
    const describedBy = [childProps["aria-describedby"] as string | undefined, tooltipId]
      .filter(Boolean)
      .join(" ");

    const trigger = cloneElement(children, {
      ref: (node: HTMLElement | null) => {
        triggerRef.current = node;
        assignRef(childRef, node);
      },
      onMouseEnter: (e: React.MouseEvent) => {
        show();
        (childProps.onMouseEnter as ((e: React.MouseEvent) => void) | undefined)?.(e);
      },
      onMouseLeave: (e: React.MouseEvent) => {
        hide();
        (childProps.onMouseLeave as ((e: React.MouseEvent) => void) | undefined)?.(e);
      },
      onFocus: (e: React.FocusEvent) => {
        show();
        (childProps.onFocus as ((e: React.FocusEvent) => void) | undefined)?.(e);
      },
      onBlur: (e: React.FocusEvent) => {
        hide();
        (childProps.onBlur as ((e: React.FocusEvent) => void) | undefined)?.(e);
      },
      "aria-describedby": describedBy,
    } as Record<string, unknown>);

    return (
      <>
        {trigger}
        {mounted &&
          createPortal(
            <div
              ref={(node) => {
                tooltipRef.current = node;
                assignRef(ref, node);
              }}
              id={tooltipId}
              role="tooltip"
              hidden={!open}
              data-state={open ? "open" : "closed"}
              className={cn("tooltip", className)}
              style={{ ...style, top: position.top, left: position.left }}
              onMouseEnter={keepOpen}
              onMouseLeave={hide}
            >
              {content}
            </div>,
            document.body,
          )}
      </>
    );
  },
);

Tooltip.displayName = "Tooltip";
