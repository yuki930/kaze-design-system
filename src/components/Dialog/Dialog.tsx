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
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { lockScroll } from "@/utils/scrollLock";

/* ── Dialog ────────────────────────────────────────────────── */

const CLOSE_ANIMATION_MS = 200;

// Open dialogs, top-most last, so nested dialogs close one at a time on Escape.
const dialogStack: object[] = [];

export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  /** @deprecated useFocusTrap handles focus restoration automatically. Kept for backward compat: ignored. */
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
    // biome-ignore lint/correctness/useExhaustiveDependencies: only react to `open`; `visible` is read to decide whether to animate out
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
    }, [open]);

    // ── Scroll lock: ref-counting pattern (C6) ──
    useEffect(() => {
      if (!open) return;
      const unlock = lockScroll();
      return unlock;
    }, [open]);

    // Activate only once the portal is mounted (visible) so the container ref is set.
    const trapActive = open && visible && !closing;

    // Make everything behind the dialog inert (aria-modal alone is not honored by all AT).
    // Declared BEFORE useFocusTrap on purpose: effect cleanups run in declaration
    // order, and the opener must be un-inerted before the trap restores focus to it.
    useEffect(() => {
      const container = internalRef.current;
      if (!trapActive || !container) return;
      let root: HTMLElement = container;
      while (root.parentElement && root.parentElement !== document.body) root = root.parentElement;
      const changed: Element[] = [];
      for (const el of Array.from(document.body.children)) {
        if (el === root || el.hasAttribute("inert") || el.classList.contains("toast-container"))
          continue;
        el.setAttribute("inert", "");
        changed.push(el);
      }
      return () => {
        for (const el of changed) el.removeAttribute("inert");
      };
    }, [trapActive]);

    useFocusTrap(internalRef, trapActive);

    // Escape on document (works even if focus left the dialog). Only the top-most dialog closes.
    useEffect(() => {
      if (!trapActive) return;
      const token = {};
      dialogStack.push(token);
      const onKeyDown = (e: globalThis.KeyboardEvent) => {
        if (e.key !== "Escape" || dialogStack[dialogStack.length - 1] !== token) return;
        e.stopPropagation();
        onClose();
      };
      document.addEventListener("keydown", onKeyDown);
      return () => {
        document.removeEventListener("keydown", onKeyDown);
        const i = dialogStack.indexOf(token);
        if (i >= 0) dialogStack.splice(i, 1);
      };
    }, [trapActive, onClose]);

    const handleOverlayClick = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      },
      [onClose],
    );

    if (!visible) return null;
    if (typeof document === "undefined") return null;

    return createPortal(
      // biome-ignore lint/a11y/useKeyWithClickEvents: Escape is handled on document (see above), so the backdrop needs no key handler.
      // biome-ignore lint/a11y/noStaticElementInteractions: the backdrop only handles click-outside-to-close; keyboard users close the dialog with Escape, and the backdrop itself must not be focusable.
      <div className={cn("overlay", closing && "overlay--closing")} onClick={handleOverlayClick}>
        <div
          ref={mergedRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className={cn("dialog", className)}
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
