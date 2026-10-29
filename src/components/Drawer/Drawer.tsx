"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useRef,
  type HTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import type { Size } from "../../lib/types";
import { cn } from "../../lib/utils";
import { mergeRefs } from "../_internal/refs";
import { useModalLayer } from "../_internal/useModalLayer";

/* ── Types ─────────────────────────────────────────────────── */

export type DrawerSide = "left" | "right" | "bottom";
export type DrawerSize = Extract<Size, "sm" | "md" | "lg">;

export interface DrawerProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  /** Called with `false` on Escape, backdrop click or any close request. The caller sets `open` */
  onOpenChange?: (open: boolean) => void;
  /** Edge the panel slides from. On narrow screens `"bottom"` is the better fit */
  side?: DrawerSide;
  /** Width of a side panel / height cap of a bottom sheet */
  size?: DrawerSize;
}

const DrawerTitleIdContext = createContext<string | undefined>(undefined);

/* ── Drawer ────────────────────────────────────────────────── */

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  ({ open, onOpenChange, side = "right", size = "md", className, children, ...rest }, ref) => {
    const titleId = useId();
    const internalRef = useRef<HTMLDivElement | null>(null);
    const requestClose = useCallback(() => onOpenChange?.(false), [onOpenChange]);
    const { visible, closing, state, onBackdropClick } = useModalLayer(
      internalRef,
      open,
      requestClose,
    );

    if (!visible) return null;
    if (typeof document === "undefined") return null;

    return createPortal(
      // biome-ignore lint/a11y/useKeyWithClickEvents: Escape is handled on document (see useModalLayer), so the backdrop needs no key handler.
      // biome-ignore lint/a11y/noStaticElementInteractions: the backdrop only handles click-outside-to-close; keyboard users close the drawer with Escape, and the backdrop itself must not be focusable.
      <div
        className={cn("overlay", "overlay--drawer", closing && "overlay--closing")}
        data-state={state}
        data-side={side}
        onClick={onBackdropClick}
      >
        <div
          // A consumer-supplied aria-label replaces the title reference
          aria-labelledby={rest["aria-label"] ? undefined : titleId}
          {...rest}
          ref={mergeRefs(ref, internalRef)}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          className={cn("drawer", `drawer--${side}`, `drawer--${size}`, className)}
          data-state={state}
          data-side={side}
        >
          <DrawerTitleIdContext.Provider value={titleId}>{children}</DrawerTitleIdContext.Provider>
        </div>
      </div>,
      document.body,
    );
  },
);

Drawer.displayName = "Drawer";

/* ── DrawerHeader ──────────────────────────────────────────── */

export interface DrawerHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ className, children, ...rest }, ref) => (
    <div ref={ref} className={cn("drawer__header", className)} {...rest}>
      {children}
    </div>
  ),
);

DrawerHeader.displayName = "DrawerHeader";

/* ── DrawerTitle ───────────────────────────────────────────── */

export interface DrawerTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const DrawerTitle = forwardRef<HTMLHeadingElement, DrawerTitleProps>(
  ({ className, children, id, ...rest }, ref) => {
    const contextId = useContext(DrawerTitleIdContext);
    return (
      <h2 ref={ref} id={id ?? contextId} className={cn("drawer__title", className)} {...rest}>
        {children}
      </h2>
    );
  },
);

DrawerTitle.displayName = "DrawerTitle";

/* ── DrawerBody ────────────────────────────────────────────── */

export interface DrawerBodyProps extends HTMLAttributes<HTMLDivElement> {}

export const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(
  ({ className, children, ...rest }, ref) => (
    <div ref={ref} className={cn("drawer__body", className)} {...rest}>
      {children}
    </div>
  ),
);

DrawerBody.displayName = "DrawerBody";

/* ── DrawerFooter ──────────────────────────────────────────── */

export interface DrawerFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ className, children, ...rest }, ref) => (
    <div ref={ref} className={cn("drawer__footer", className)} {...rest}>
      {children}
    </div>
  ),
);

DrawerFooter.displayName = "DrawerFooter";
