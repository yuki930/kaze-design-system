/**
 * Internal a11y helpers shared by the form controls. Not exported from the barrel.
 */

import type { AriaAttributes } from "react";

export type AriaInvalid = AriaAttributes["aria-invalid"];

/** True when an `aria-invalid` value marks the control as invalid ("false" / false / undefined do not). */
export function isAriaInvalid(value: AriaInvalid): boolean {
  return value === true || value === "true" || value === "grammar" || value === "spelling";
}

/** Joins id lists for `aria-describedby` / `aria-labelledby`, dropping empties. */
export function joinIds(...ids: (string | undefined | null | false)[]): string | undefined {
  const joined = ids
    .filter((id): id is string => typeof id === "string" && id.length > 0)
    .join(" ");
  return joined.length > 0 ? joined : undefined;
}
