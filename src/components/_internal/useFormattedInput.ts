"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useControllableState } from "./useControllableState";

interface Options {
  value: string | undefined;
  defaultValue: string;
  onValueChange?: (value: string) => void;
  /** Typed text to the value (e.g. digits only). Must be a stable (module-level) function */
  normalize: (text: string) => string;
  /** Typed text or a value to what the field shows after blur. Must be stable */
  display: (text: string) => string;
}

/**
 * A text field whose value is a normalized form of what was typed (phone number,
 * postal code). The text is never rewritten while typing or during IME
 * composition, only on blur, so the caret and the IME are left alone.
 * Internal: not exported from the barrel.
 */
export function useFormattedInput({
  value: valueProp,
  defaultValue,
  onValueChange,
  normalize,
  display,
}: Options) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const [text, setText] = useState(() => display(value));

  // A value set from outside (controlled update, form reset) replaces the text.
  // Typing keeps normalize(text) === value, so this does not fire while typing.
  useEffect(() => {
    setText((current) => (normalize(current) === value ? current : display(value)));
  }, [value, normalize, display]);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setText(next);
    const normalized = normalize(next);
    if (normalized !== value) setValue(normalized);
  };

  const onBlur = () => setText((current) => display(current));

  return { value, text, onChange, onBlur };
}
