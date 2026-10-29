"use client";

import { useCallback, useState } from "react";

interface Options<T> {
  /** Controlled value. `undefined` means uncontrolled */
  value: T | undefined;
  /** Initial value when uncontrolled */
  defaultValue: T;
  onChange?: (value: T) => void;
}

/**
 * The `value` / `defaultValue` / `onValueChange` contract shared by the form controls.
 * Controlled: the setter only reports the request. Uncontrolled: it also stores the value.
 * Internal: not exported from the barrel.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: Options<T>): [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );
  return [isControlled ? (value as T) : internal, setValue];
}
