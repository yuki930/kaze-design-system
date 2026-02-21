"use client";

import {
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useId,
  useRef,
  createContext,
  useContext,
  type HTMLAttributes,
  type MouseEvent,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { lockScroll } from "@/utils/scrollLock";

/* ── Dialog ────────────────────────────────────────────────── */

const CLOSE_ANIMATION_MS = 200;

export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  /** @deprecated useFocusTrap handles focus restoration automatically. Kept for backward compat — ignored. */
  returnFocusRef?: RefObject<HTMLElement | null>;
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ open, onClose, returnFocusRef: _returnFocusRef, className, children, ...rest }, ref) => {
    const titleId = useId();
    const internalRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);

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

    // Sync visibility with open prop — play close animation before unmounting
    useEffect(() => {
      if (open) {
        setVisible(true);
        setClosing(false);
      } else if (visible) {
        setClosing(true);
        const timer = setTimeout(() => {
          setClosing(false);
          setVisible(false);
        }, CLOSE_ANIMATION_MS);
        return () => clearTimeout(timer);
      }
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Scroll lock: ref-counting pattern (C6) ──
    useEffect(() => {
      if (!open) return;
      const unlock = lockScroll();
      return unlock;
    }, [open]);

    // Focus trap: trap focus inside dialog when open, auto-focus first element
    // useFocusTrap also restores focus to the previously focused element on
    // deactivation, so the separate returnFocusRef effect is no longer needed.
    useFocusTrap(internalRef, open);

    const handleOverlayClick = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      },
      [onClose],
    );

    // ── Escape key: handled on the overlay element so stopPropagation
    //    prevents nested dialogs from all closing at once (C7) ──
    const handleOverlayKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onClose();
        }
      },
      [onClose],
    );

    if (!visible) return null;
    if (typeof document === "undefined") return null;

    return createPortal(
      <div
        className={cn("overlay", closing && "overlay--closing")}
        onClick={handleOverlayClick}
        onKeyDown={handleOverlayKeyDown}
      >
        <div
          ref={mergedRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={cn("dialog", className)}
          {...rest}
        >
          <DialogTitleIdContext.Provider value={titleId}>
            {children}
          </DialogTitleIdContext.Provider>
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

export interface DialogTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {}

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, children, id, ...rest }, ref) => {
    const contextId = useContext(DialogTitleIdContext);
    return (
      <h2
        ref={ref}
        id={id ?? contextId}
        className={cn("dialog__title", className)}
        {...rest}
      >
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
