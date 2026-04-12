"use client";

import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type DisclosureIcon = "chevron" | "plus" | ReactNode;
export type DisclosureIconPosition = "left" | "right";
export type DisclosureSize = "sm" | "md" | "lg";
export type DisclosureVariant = "default" | "ghost" | "bordered";

export interface DisclosureProps {
  /** Always-visible label on the trigger row */
  title: ReactNode;
  /** Content shown when the disclosure is expanded */
  children: ReactNode;
  /** Initial expanded state (uncontrolled) */
  defaultOpen?: boolean;
  /** Controlled expanded state */
  open?: boolean;
  /** Called when the expanded state changes */
  onOpenChange?: (open: boolean) => void;
  /**
   * Marker icon. Use `"chevron"` (default) or `"plus"` for the built-in
   * icons, or pass any ReactNode for a custom marker. Custom markers are
   * not auto-rotated.
   */
  icon?: DisclosureIcon;
  /** Which side the marker appears on */
  iconPosition?: DisclosureIconPosition;
  /** Trigger row density */
  size?: DisclosureSize;
  /** Visual treatment */
  variant?: DisclosureVariant;
  /** Additional class on the root wrapper */
  className?: string;
  /** Additional class on the trigger button */
  triggerClassName?: string;
  /** Additional class on the content region */
  contentClassName?: string;
  /** Disables the trigger */
  disabled?: boolean;
}

function renderIcon(icon: DisclosureIcon) {
  if (icon === "chevron" || icon == null) {
    return <ChevronRight size={16} className="disclosure__icon-svg" />;
  }
  if (icon === "plus") {
    return <Plus size={16} className="disclosure__icon-svg" />;
  }
  return icon;
}

export const Disclosure = forwardRef<HTMLDivElement, DisclosureProps>(
  (
    {
      title,
      children,
      defaultOpen = false,
      open: controlledOpen,
      onOpenChange,
      icon = "chevron",
      iconPosition = "left",
      size = "md",
      variant = "default",
      className,
      triggerClassName,
      contentClassName,
      disabled = false,
    },
    ref,
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

    const setOpen = useCallback(
      (next: boolean) => {
        if (!isControlled) setUncontrolledOpen(next);
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange],
    );

    const toggle = useCallback(() => {
      if (disabled) return;
      setOpen(!isOpen);
    }, [disabled, isOpen, setOpen]);

    const onKeyDown = useCallback(
      (e: KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "Escape" && isOpen) {
          e.preventDefault();
          setOpen(false);
        }
      },
      [isOpen, setOpen],
    );

    const contentId = useId();
    const isBuiltInIcon = icon === "chevron" || icon === "plus";
    const markerNode = useMemo(() => renderIcon(icon), [icon]);

    return (
      <div
        ref={ref}
        className={cn(
          "disclosure",
          `disclosure--${size}`,
          `disclosure--${variant}`,
          isOpen && "disclosure--open",
          disabled && "disclosure--disabled",
          className,
        )}
        data-state={isOpen ? "open" : "closed"}
      >
        <button
          type="button"
          className={cn(
            "disclosure__trigger",
            `disclosure__trigger--icon-${iconPosition}`,
            triggerClassName,
          )}
          aria-expanded={isOpen}
          aria-controls={contentId}
          disabled={disabled}
          onClick={toggle}
          onKeyDown={onKeyDown}
        >
          {iconPosition === "left" && (
            <span
              className={cn(
                "disclosure__icon",
                isBuiltInIcon && "disclosure__icon--rotate",
              )}
              aria-hidden="true"
            >
              {markerNode}
            </span>
          )}
          <span className="disclosure__title">{title}</span>
          {iconPosition === "right" && (
            <span
              className={cn(
                "disclosure__icon",
                "disclosure__icon--end",
                isBuiltInIcon && "disclosure__icon--rotate",
              )}
              aria-hidden="true"
            >
              {markerNode}
            </span>
          )}
        </button>
        <div
          id={contentId}
          role="region"
          className={cn("disclosure__content", contentClassName)}
          hidden={!isOpen}
        >
          <div className="disclosure__content-inner">{children}</div>
        </div>
      </div>
    );
  },
);

Disclosure.displayName = "Disclosure";
