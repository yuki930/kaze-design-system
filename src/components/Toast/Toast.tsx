"use client";

import {
  forwardRef,
  useMemo,
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────── */

export type ToastVariant = "default" | "positive" | "negative" | "warning" | "info";

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  /** Internal: set while the exit animation plays */
  removing?: boolean;
}

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastProviderProps {
  children: ReactNode;
  /** Accessible label for the close button on each toast (default: "閉じる") */
  closeLabel?: string;
  /** Accessible label for the toast container (default: "通知") */
  containerLabel?: string;
}

interface ToastContextValue {
  /** Shows a toast and returns its id */
  toast: (options: ToastOptions) => string;
  /** Dismisses a toast by id (plays the exit animation) */
  dismiss: (id: string) => void;
}

/* ── Context ───────────────────────────────────────────────── */

const ToastContext = createContext<ToastContextValue | null>(null);

/* ── useToast ──────────────────────────────────────────────── */

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return context;
}

/* ── ToastItem ─────────────────────────────────────────────── */

interface ToastItemProps {
  data: ToastData;
  onDismiss: (id: string) => void;
  onRemove: (id: string) => void;
  closeLabel?: string;
}

const REMOVE_ANIMATION_MS = 150;

const ToastItem = forwardRef<HTMLDivElement, ToastItemProps>(function ToastItem(props, ref) {
  const { data, onDismiss, onRemove } = props;
  const closeLabel = props.closeLabel ?? "閉じる";
  const removing = Boolean(data.removing);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingRef = useRef(data.duration ?? 4000);
  const startedAtRef = useRef(0);
  const hoverRef = useRef(false);
  const focusRef = useRef(false);

  const stopTimer = useCallback(() => {
    if (timerRef.current === null) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
    remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAtRef.current));
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current !== null) return;
    startedAtRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      onDismiss(data.id);
    }, remainingRef.current);
  }, [data.id, onDismiss]);

  // Auto-dismiss timer; paused while hovered or focused (WCAG 2.2.1)
  useEffect(() => {
    if (removing) return;
    if (!hoverRef.current && !focusRef.current) startTimer();
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [removing, startTimer]);

  // Unmount after the exit animation; cleared if the item unmounts first
  useEffect(() => {
    if (!removing) return;
    const timer = setTimeout(() => onRemove(data.id), REMOVE_ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [removing, data.id, onRemove]);

  const pause = (kind: "hover" | "focus") => {
    if (kind === "hover") hoverRef.current = true;
    else focusRef.current = true;
    stopTimer();
  };
  const resume = (kind: "hover" | "focus") => {
    if (kind === "hover") hoverRef.current = false;
    else focusRef.current = false;
    if (!hoverRef.current && !focusRef.current && !removing) startTimer();
  };

  const variantClass =
    data.variant && data.variant !== "default" ? `toast--${data.variant}` : undefined;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover/focus handlers only pause the auto-dismiss timer (WCAG 2.2.1); the element is a live region, not a control.
    <div
      ref={ref}
      className={cn("toast", variantClass)}
      role={data.variant === "negative" || data.variant === "warning" ? "alert" : "status"}
      aria-atomic="true"
      data-removing={removing || undefined}
      onMouseEnter={() => pause("hover")}
      onMouseLeave={() => resume("hover")}
      onFocus={() => pause("focus")}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) resume("focus");
      }}
    >
      {data.variant && data.variant !== "default" && (
        <span className="toast__icon" aria-hidden="true">
          {data.variant === "positive" && (
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          )}
          {data.variant === "negative" && (
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
          )}
          {data.variant === "warning" && (
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          )}
          {data.variant === "info" && (
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          )}
        </span>
      )}
      <div className="toast__content">
        <div className="toast__title">{data.title}</div>
        {data.description && <div className="toast__description">{data.description}</div>}
      </div>
      <button
        type="button"
        className="toast__close"
        onClick={() => onDismiss(data.id)}
        aria-label={closeLabel}
      >
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
});

/* ── ToastProvider ─────────────────────────────────────────── */

export function ToastProvider({
  children,
  closeLabel = "閉じる",
  containerLabel = "通知",
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const counterRef = useRef(0);

  const toast = useCallback((options: ToastOptions) => {
    const id = `toast-${++counterRef.current}`;
    const newToast: ToastData = {
      id,
      title: options.title,
      description: options.description,
      variant: options.variant ?? "default",
      duration: options.duration ?? 4000,
    };
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id && !t.removing ? { ...t, removing: true } : t)),
    );
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <section className="toast-container" aria-label={containerLabel}>
            {toasts.map((t) => (
              <ToastItem
                key={t.id}
                data={t}
                onDismiss={dismiss}
                onRemove={removeToast}
                closeLabel={closeLabel}
              />
            ))}
          </section>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

ToastProvider.displayName = "ToastProvider";
