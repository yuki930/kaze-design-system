"use client";

import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  createContext,
  useContext,
  type HTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useModalLayer } from "../_internal/useModalLayer";

/* ── Dialog ────────────────────────────────────────────────── */

export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  /** Escape / 背景クリック / 閉じる操作で呼ばれる。`open` を false にするのは呼び出し側 */
  onOpenChange?: (open: boolean) => void;
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ open, onOpenChange, className, children, ...rest }, ref) => {
    const titleId = useId();
    const internalRef = useRef<HTMLDivElement>(null);

    const requestClose = useCallback(() => {
      onOpenChange?.(false);
    }, [onOpenChange]);

    // ── Callback ref: merge forwarded ref with internal ref (M5) ──
    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        // Keep internal ref in sync
        (internalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        // Forward to the consumer ref
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref],
    );

    const { visible, closing, state, onBackdropClick } = useModalLayer(
      internalRef,
      open,
      requestClose,
    );

    if (!visible) return null;
    if (typeof document === "undefined") return null;

    return createPortal(
      // biome-ignore lint/a11y/useKeyWithClickEvents: Escape is handled on document (see above), so the backdrop needs no key handler.
      // biome-ignore lint/a11y/noStaticElementInteractions: the backdrop only handles click-outside-to-close; keyboard users close the dialog with Escape, and the backdrop itself must not be focusable.
      <div
        className={cn("overlay", closing && "overlay--closing")}
        data-state={state}
        onClick={onBackdropClick}
      >
        <div
          ref={mergedRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className={cn("dialog", className)}
          data-state={state}
          {...rest}
        >
          <DialogTitleIdContext.Provider value={titleId}>{children}</DialogTitleIdContext.Provider>
        </div>
      </div>,
      document.body,
    );
  },
);

Dialog.displayName = "Dialog";

/* ── DialogTitleIdContext ──────────────────────────────────── */

const DialogTitleIdContext = createContext<string | undefined>(undefined);

/* ── DialogHeader ──────────────────────────────────────────── */

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn("dialog__header", className)} {...rest}>
        {children}
      </div>
    );
  },
);

DialogHeader.displayName = "DialogHeader";

/* ── DialogTitle ───────────────────────────────────────────── */

export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, children, id, ...rest }, ref) => {
    const contextId = useContext(DialogTitleIdContext);
    return (
      <h2 ref={ref} id={id ?? contextId} className={cn("dialog__title", className)} {...rest}>
        {children}
      </h2>
    );
  },
);

DialogTitle.displayName = "DialogTitle";

/* ── DialogBody ────────────────────────────────────────────── */

export interface DialogBodyProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn("dialog__body", className)} {...rest}>
        {children}
      </div>
    );
  },
);

DialogBody.displayName = "DialogBody";

/* ── DialogFooter ──────────────────────────────────────────── */

export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn("dialog__footer", className)} {...rest}>
        {children}
      </div>
    );
  },
);

DialogFooter.displayName = "DialogFooter";
