/**
 * Internal ref helpers. Not exported from the barrel.
 */

import type { Ref } from "react";

export function assignRef<T>(ref: Ref<T> | undefined, node: T | null): void {
  if (typeof ref === "function") ref(node);
  else if (ref) (ref as { current: T | null }).current = node;
}

/** Combines several refs into one callback ref. */
export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): (node: T | null) => void {
  return (node) => {
    for (const ref of refs) assignRef(ref, node);
  };
}
