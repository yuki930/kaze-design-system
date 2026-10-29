"use client";

import { useCallback, useEffect, useState, type MouseEvent, type RefObject } from "react";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { lockScroll } from "../../utils/scrollLock";

/** Long enough for the closing animation in components.css to finish before unmounting */
export const MODAL_CLOSE_ANIMATION_MS = 200;

// Open modal layers, top-most last, so stacked ones (a Dialog opened from a Drawer, ...)
// close one at a time on Escape.
const layerStack: object[] = [];

interface ModalLayer {
  /** False until opened and again after the closing animation ends: render nothing */
  visible: boolean;
  closing: boolean;
  /** "open" while interactive, "closed" during the closing animation */
  state: "open" | "closed";
  /** Closes when the backdrop itself (not the panel) is clicked */
  onBackdropClick: (event: MouseEvent<HTMLElement>) => void;
}

/**
 * Behavior shared by the modal surfaces (Dialog, Drawer): mount / unmount around the
 * closing animation, scroll lock, inert background, focus trap with focus restoration,
 * Escape on the document, and click-on-backdrop.
 *
 * Effect order matters. The inert effect is declared BEFORE useFocusTrap on purpose:
 * cleanups run in declaration order, and the opener must be un-inerted before the trap
 * restores focus to it. Internal: not exported from the barrel.
 */
export function useModalLayer(
  containerRef: RefObject<HTMLElement | null>,
  open: boolean,
  requestClose: () => void,
): ModalLayer {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  // Sync visibility with open prop: play the close animation before unmounting
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
      }, MODAL_CLOSE_ANIMATION_MS);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Scroll lock: ref-counted, so stacked layers release it only when the last one closes.
  useEffect(() => {
    if (!open) return;
    const unlock = lockScroll();
    return unlock;
  }, [open]);

  // Activate only once the portal is mounted (visible) so the container ref is set.
  const trapActive = open && visible && !closing;

  // Make everything behind the layer inert (aria-modal alone is not honored by all AT).
  useEffect(() => {
    const container = containerRef.current;
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
  }, [trapActive, containerRef]);

  useFocusTrap(containerRef, trapActive);

  // Escape on document (works even if focus left the layer). Only the top-most layer closes.
  useEffect(() => {
    if (!trapActive) return;
    const token = {};
    layerStack.push(token);
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape" || layerStack[layerStack.length - 1] !== token) return;
      e.stopPropagation();
      requestClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      const i = layerStack.indexOf(token);
      if (i >= 0) layerStack.splice(i, 1);
    };
  }, [trapActive, requestClose]);

  const onBackdropClick = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (e.target === e.currentTarget) requestClose();
    },
    [requestClose],
  );

  return { visible, closing, state: open && !closing ? "open" : "closed", onBackdropClick };
}
