/**
 * Internal floating-panel placement shared by Popover and Combobox. Not exported from the barrel.
 * Coordinates are viewport-relative because the panels use `position: fixed`.
 */

export type Side = "top" | "bottom" | "left" | "right";
export type Align = "start" | "center" | "end";

export interface Placement {
  top: number;
  left: number;
  /** The side actually used after flipping */
  side: Side;
}

const OPPOSITE: Record<Side, Side> = { top: "bottom", bottom: "top", left: "right", right: "left" };

/** Minimum distance kept between the panel and the viewport edge */
export const VIEWPORT_MARGIN = 4;

function place(trigger: DOMRect, panel: DOMRect, side: Side, align: Align, offset: number) {
  const vertical = side === "top" || side === "bottom";
  let top: number;
  let left: number;
  if (vertical) {
    top = side === "top" ? trigger.top - panel.height - offset : trigger.bottom + offset;
    left =
      align === "start"
        ? trigger.left
        : align === "end"
          ? trigger.right - panel.width
          : trigger.left + trigger.width / 2 - panel.width / 2;
  } else {
    left = side === "left" ? trigger.left - panel.width - offset : trigger.right + offset;
    top =
      align === "start"
        ? trigger.top
        : align === "end"
          ? trigger.bottom - panel.height
          : trigger.top + trigger.height / 2 - panel.height / 2;
  }
  return { top, left };
}

function overflows(pos: { top: number; left: number }, panel: DOMRect, side: Side): boolean {
  if (side === "top") return pos.top < 0;
  if (side === "bottom") return pos.top + panel.height > window.innerHeight;
  if (side === "left") return pos.left < 0;
  return pos.left + panel.width > window.innerWidth;
}

/**
 * Places `panel` next to `trigger`. When the preferred side overflows the viewport
 * and the opposite side fits, flips to the opposite side. The result is clamped
 * so the panel never leaves the viewport.
 */
export function computePlacement(
  trigger: DOMRect,
  panel: DOMRect,
  side: Side,
  align: Align,
  offset: number,
): Placement {
  let used = side;
  let pos = place(trigger, panel, side, align, offset);
  if (overflows(pos, panel, side)) {
    const flipped = place(trigger, panel, OPPOSITE[side], align, offset);
    if (!overflows(flipped, panel, OPPOSITE[side])) {
      pos = flipped;
      used = OPPOSITE[side];
    }
  }
  const maxLeft = window.innerWidth - panel.width - VIEWPORT_MARGIN;
  const maxTop = window.innerHeight - panel.height - VIEWPORT_MARGIN;
  return {
    side: used,
    left: Math.max(VIEWPORT_MARGIN, Math.min(pos.left, maxLeft)),
    top: Math.max(VIEWPORT_MARGIN, Math.min(pos.top, maxTop)),
  };
}
