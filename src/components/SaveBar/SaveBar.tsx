"use client";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../Button";

export type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";
export interface SaveBarProps extends HTMLAttributes<HTMLDivElement> {
  state: SaveState;
  onSave: () => void;
  onReset?: () => void;
  /** Validation can disable saving without disabling reset. */
  disabled?: boolean;
  message?: ReactNode;
  saveLabel?: string;
  resetLabel?: string;
}
const messages = {
  idle: "変更はありません",
  dirty: "保存していない変更があります",
  saving: "保存中…",
  saved: "保存しました",
  error: "保存できませんでした。もう一度お試しください。",
} as const;
/** Controlled feedback only. Persistence and dirty-state tracking belong to the application. */
export const SaveBar = forwardRef<HTMLDivElement, SaveBarProps>(
  (
    {
      state,
      onSave,
      onReset,
      disabled,
      message,
      saveLabel = "保存する",
      resetLabel = "変更を戻す",
      className,
      ...rest
    },
    ref,
  ) => {
    const changed = state === "dirty" || state === "error";
    return (
      <div ref={ref} className={cn("save-bar", className)} {...rest}>
        <div className="save-bar__message" role="status" aria-live="polite" aria-atomic="true">
          {message ?? messages[state]}
        </div>
        <div className="save-bar__actions">
          {onReset && (
            <Button type="button" variant="outline" disabled={!changed} onClick={onReset}>
              {resetLabel}
            </Button>
          )}
          <Button
            type="button"
            loading={state === "saving"}
            disabled={disabled || (!changed && state !== "saving")}
            onClick={onSave}
          >
            {saveLabel}
          </Button>
        </div>
      </div>
    );
  },
);
SaveBar.displayName = "SaveBar";
