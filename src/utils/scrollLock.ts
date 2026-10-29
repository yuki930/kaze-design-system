/**
 * Ref-counting scroll lock utility.
 *
 * Multiple consumers (Dialog, CommandPalette, etc.) can call `lockScroll()`
 * independently. The body overflow is only restored when **all** consumers
 * have released their locks.
 *
 * Usage:
 *   const unlock = lockScroll();
 *   // … later, when the overlay closes:
 *   unlock();
 */

let lockCount = 0;
let originalOverflow: string | null = null;
let originalPaddingRight: string | null = null;

export function lockScroll(): () => void {
  if (lockCount === 0) {
    originalOverflow = document.body.style.overflow;
    originalPaddingRight = document.body.style.paddingRight;
    // Compensate for the vanished scrollbar so the page does not shift sideways.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      const current = Number.parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${current + scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";
  }
  lockCount++;

  let released = false;

  return () => {
    if (released) return; // guard against double-release
    released = true;
    lockCount--;
    if (lockCount === 0 && originalOverflow !== null) {
      document.body.style.overflow = originalOverflow;
      originalOverflow = null;
      document.body.style.paddingRight = originalPaddingRight ?? "";
      originalPaddingRight = null;
    }
  };
}
