"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useId,
  forwardRef,
  cloneElement,
  type ReactNode,
  type ReactElement,
} from "react";
import { createPortal } from "react-dom";

/* ── Types ─────────────────────────────────────────────────── */

export type TooltipSide = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  /** Content to render inside the tooltip */
  content: ReactNode;
  /** The element that triggers the tooltip */
  children: ReactElement;
  /** Which side the tooltip appears on */
  side?: TooltipSide;
  /** Delay in ms before the tooltip shows */
  delay?: number;
}

/* ── Positioning helpers ───────────────────────────────────── */

const GAP = 8;

function getPosition(
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  side: TooltipSide,
): { top: number; left: number } {
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;

  switch (side) {
    case "top":
      return {
        top: triggerRect.top - tooltipRect.height - GAP + scrollY,
        left:
          triggerRect.left +
          triggerRect.width / 2 -
          tooltipRect.width / 2 +
          scrollX,
      };
    case "bottom":
      return {
        top: triggerRect.bottom + GAP + scrollY,
        left:
          triggerRect.left +
          triggerRect.width / 2 -
          tooltipRect.width / 2 +
          scrollX,
      };
    case "left":
      return {
        top:
          triggerRect.top +
          triggerRect.height / 2 -
          tooltipRect.height / 2 +
          scrollY,
        left: triggerRect.left - tooltipRect.width - GAP + scrollX,
      };
    case "right":
      return {
        top:
          triggerRect.top +
          triggerRect.height / 2 -
          tooltipRect.height / 2 +
          scrollY,
        left: triggerRect.right + GAP + scrollX,
      };
  }
}

/* ── Tooltip ───────────────────────────────────────────────── */

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(({
  content,
  children,
  side = "top",
  delay = 200,
}, ref) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const triggerRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    setPosition(getPosition(triggerRect, tooltipRect, side));
  }, [side]);

  useEffect(() => {
    if (visible) {
      // Use rAF to let the tooltip render before measuring
      requestAnimationFrame(updatePosition);
    }
  }, [visible, updatePosition]);

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisible(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const childProps = children.props as Record<string, unknown>;

  const trigger = cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
      // Forward existing ref if present
      const childRef = (children as { ref?: unknown }).ref;
      if (typeof childRef === "function") {
        childRef(node);
      } else if (childRef && typeof childRef === "object" && "current" in childRef) {
        (childRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
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
    "aria-describedby": visible ? tooltipId : undefined,
  } as Record<string, unknown>);

  return (
    <>
      {trigger}
      {visible &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={(node) => {
              tooltipRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            id={tooltipId}
            role="tooltip"
            className="tooltip"
            style={{ top: position.top, left: position.left }}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
});

Tooltip.displayName = "Tooltip";
