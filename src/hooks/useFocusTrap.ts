"use client";

import { useEffect, type RefObject } from "react";

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
export function useFocusTrap(containerRef: RefObject<HTMLElement | null>, active: boolean): void {
  // Callers must pass `active` that flips to true only once the container is mounted
  // (e.g. Dialog uses `visible && open`), otherwise containerRef.current is still null here.
  useEffect(() => {
    const container = containerRef.current;
    if (!active || !container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const firstFocusable = container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    if (firstFocusable) {
      firstFocusable.focus();
    } else {
      if (!container.hasAttribute("tabindex")) container.setAttribute("tabindex", "-1");
      container.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        e.preventDefault();
        container.focus();
        return;
      }

      const current = document.activeElement;
      if (e.shiftKey) {
        if (current === first || current === container) {
          e.preventDefault();
          last.focus();
        }
      } else if (current === last) {
        e.preventDefault();
        first.focus();
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus();
        // focus() is a no-op while the opener is still inert (or hidden); retry
        // once the surrounding effects have cleaned up.
        if (
          document.activeElement !== previouslyFocused &&
          typeof requestAnimationFrame === "function"
        ) {
          requestAnimationFrame(() => {
            if (previouslyFocused.isConnected) previouslyFocused.focus();
          });
        }
      }
    };
  }, [active, containerRef]);
}
