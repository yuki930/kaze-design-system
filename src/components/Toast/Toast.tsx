"use client";

import {
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

export type ToastVariant = "default" | "positive" | "negative" | "warning";

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
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
  toast: (options: ToastOptions) => void;
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
  onRemove: (id: string) => void;
  closeLabel?: string;
}

function ToastItem(props: ToastItemProps) {
  const { data, onRemove } = props;
  const closeLabel = props.closeLabel ?? "閉じる";
  const [removing, setRemoving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setRemoving(true);
    setTimeout(() => {
      onRemove(data.id);
    }, 150);
  }, [data.id, onRemove]);

  useEffect(() => {
    const duration = data.duration ?? 4000;
    timerRef.current = setTimeout(dismiss, duration);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [data.duration, dismiss]);

  const variantClass =
    data.variant && data.variant !== "default"
      ? `toast--${data.variant}`
      : undefined;

  return (
    <div
      className={cn("toast", variantClass)}
      role="status"
      data-removing={removing || undefined}
    >
      {data.variant && data.variant !== "default" && (
        <span className="toast__icon" aria-hidden="true">
          {data.variant === "positive" && (
            <svg
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
        </span>
      )}
      <div className="toast__content">
        <div className="toast__title">{data.title}</div>
        {data.description && (
          <div className="toast__description">{data.description}</div>
        )}
      </div>
      <button
        type="button"
        className="toast__close"
        onClick={dismiss}
        aria-label={closeLabel}
      >
        <svg
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
}

/* ── ToastProvider ─────────────────────────────────────────── */

export function ToastProvider({ children, closeLabel = "閉じる", containerLabel = "通知" }: ToastProviderProps) {
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
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div className="toast-container" aria-label={containerLabel} aria-live="polite">
            {toasts.map((t) => (
              <ToastItem key={t.id} data={t} onRemove={removeToast} closeLabel={closeLabel} />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

ToastProvider.displayName = "ToastProvider";
