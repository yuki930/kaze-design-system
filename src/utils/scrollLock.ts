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

export function lockScroll(): () => void {
  if (lockCount === 0) {
    originalOverflow = document.body.style.overflow;
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
    }
  };
}
