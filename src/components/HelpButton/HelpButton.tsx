"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  forwardRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type HelpButtonPosition = "top" | "bottom" | "left" | "right";
export type HelpButtonSize = "sm" | "md" | "lg";

export interface HelpButtonProps {
  /** Popover title */
  title?: string;
  /** Popover body content */
  children: ReactNode;
  /** Preferred side the popover appears on */
  position?: HelpButtonPosition;
  /** Popover width */
  size?: HelpButtonSize;
  /** Icon shown inside the trigger button (defaults to "?") */
  icon?: ReactNode;
  /** Accessible label for the trigger */
  ariaLabel?: string;
  className?: string;
}

const GAP = 8;

function computePosition(
  trigger: DOMRect,
  pop: DOMRect,
  side: HelpButtonPosition,
) {
  const sy = window.scrollY;
  const sx = window.scrollX;
  switch (side) {
    case "top":
      return {
        top: trigger.top - pop.height - GAP + sy,
        left: trigger.left + trigger.width / 2 - pop.width / 2 + sx,
      };
    case "bottom":
      return {
        top: trigger.bottom + GAP + sy,
        left: trigger.left + trigger.width / 2 - pop.width / 2 + sx,
      };
    case "left":
      return {
        top: trigger.top + trigger.height / 2 - pop.height / 2 + sy,
        left: trigger.left - pop.width - GAP + sx,
      };
    case "right":
      return {
        top: trigger.top + trigger.height / 2 - pop.height / 2 + sy,
        left: trigger.right + GAP + sx,
      };
  }
}

export const HelpButton = forwardRef<HTMLButtonElement, HelpButtonProps>(
  (
    {
      title,
      children,
      position = "bottom",
      size = "md",
      icon,
      ariaLabel = "ヘルプ",
      className,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState<{ top: number; left: number }>({
      top: 0,
      left: 0,
    });
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const popRef = useRef<HTMLDivElement | null>(null);
    const popoverId = useId();

    const updatePosition = useCallback(() => {
      if (!triggerRef.current || !popRef.current) return;
      const t = triggerRef.current.getBoundingClientRect();
      const p = popRef.current.getBoundingClientRect();
      setCoords(computePosition(t, p, position));
    }, [position]);

    useEffect(() => {
      if (!open) return;
      requestAnimationFrame(updatePosition);

      const onClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;
        if (
          popRef.current?.contains(target) ||
          triggerRef.current?.contains(target)
        ) {
          return;
        }
        setOpen(false);
      };
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpen(false);
          triggerRef.current?.focus();
        }
      };
      const onScroll = () => updatePosition();

      document.addEventListener("mousedown", onClickOutside);
      document.addEventListener("keydown", onKeyDown);
      window.addEventListener("scroll", onScroll, true);
      window.addEventListener("resize", onScroll);
      return () => {
        document.removeEventListener("mousedown", onClickOutside);
        document.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("scroll", onScroll, true);
        window.removeEventListener("resize", onScroll);
      };
    }, [open, updatePosition]);

    return (
      <>
        <button
          type="button"
          ref={(node) => {
            triggerRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          className={cn("help-button", className)}
          aria-label={ariaLabel}
          aria-expanded={open}
          aria-controls={open ? popoverId : undefined}
          onClick={() => setOpen((v) => !v)}
        >
          {icon ?? "?"}
        </button>
        {open &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              ref={popRef}
              id={popoverId}
              role="dialog"
              aria-modal="false"
              className={cn("help-popover", `help-popover--${size}`)}
              style={{ top: coords.top, left: coords.left }}
            >
              {title && <p className="help-popover__title">{title}</p>}
              <div className="help-popover__body">{children}</div>
            </div>,
            document.body,
          )}
      </>
    );
  },
);

HelpButton.displayName = "HelpButton";
