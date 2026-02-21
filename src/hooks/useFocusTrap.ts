"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

/**
 * Traps focus within a container element when active.
 * - On Tab at the last focusable element, focus wraps to the first.
 * - On Shift+Tab at the first focusable element, focus wraps to the last.
 * - Auto-focuses the first focusable element when activated.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
): void {
  // Store the element that had focus before the trap was activated
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    // Remember the currently focused element so we can restore later
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const container = containerRef.current;

    // Auto-focus the first focusable element
    const focusableElements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    const firstFocusable = focusableElements[0];
    if (firstFocusable) {
      firstFocusable.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) return;

      if (e.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, containerRef]);

  // Restore focus when trap is deactivated
  useEffect(() => {
    if (!active && previousFocusRef.current) {
      const elementToRestore = previousFocusRef.current;
      previousFocusRef.current = null;
      // Use requestAnimationFrame to ensure the DOM has settled
      requestAnimationFrame(() => {
        elementToRestore?.focus();
      });
    }
  }, [active]);
}
