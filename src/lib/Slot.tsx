"use client";

import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  version,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { composeEventHandlers } from "./composeEventHandlers";
import { cn } from "./utils";

const REACT_MAJOR = Number.parseInt(version.split(".")[0] ?? "0", 10);

type RefLike<T> = ((node: T | null) => void) | { current: T | null } | null | undefined;
type AnyProps = Record<string, unknown>;
type Handler = (event: { defaultPrevented: boolean }) => void;

function assignRef<T>(ref: RefLike<T>, node: T | null) {
  if (typeof ref === "function") ref(node);
  else if (ref) ref.current = node;
}

// React 19 exposes ref as a prop; reading element.ref there logs a warning. React 18 is the reverse.
function getElementRef(element: ReactElement<AnyProps>): RefLike<HTMLElement> {
  if (REACT_MAJOR >= 19) return element.props.ref as RefLike<HTMLElement>;
  return (element as unknown as { ref?: RefLike<HTMLElement> }).ref;
}

export interface SlotProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  /** Any other prop is forwarded to the child element as-is */
  [prop: string]: unknown;
}

/**
 * Renders its single child element with the Slot's own props merged in, so a
 * component can lend its styling and behaviour to another element:
 * `<Button asChild><a href="/">…</a></Button>` renders one `<a class="btn …">`.
 *
 * Merge rules: `className` values are joined, `style` objects are merged with
 * the child winning, event handlers run the child's first and skip the Slot's
 * when the child called `preventDefault()`, and any other prop set on the child wins.
 */
export const Slot = forwardRef<HTMLElement, SlotProps>(
  ({ children, ...slotProps }, forwardedRef) => {
    const child = Children.only(children);
    if (!isValidElement<AnyProps>(child)) {
      throw new Error("[kaze] Slot (asChild) には React 要素を 1 つだけ渡してください");
    }
    const merged = mergeProps(slotProps, child.props);
    const childRef = getElementRef(child);
    merged.ref = (node: HTMLElement | null) => {
      assignRef(childRef, node);
      assignRef(forwardedRef, node);
    };
    return cloneElement(child, merged);
  },
);

Slot.displayName = "Slot";

function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...slotProps };
  for (const [key, childValue] of Object.entries(childProps)) {
    if (childValue === undefined) continue;
    const slotValue = slotProps[key];
    if (key === "className") {
      merged.className = cn(slotValue as string | undefined, childValue as string);
    } else if (key === "style") {
      merged.style = {
        ...(slotValue as CSSProperties | undefined),
        ...(childValue as CSSProperties),
      };
    } else if (
      /^on[A-Z]/.test(key) &&
      typeof slotValue === "function" &&
      typeof childValue === "function"
    ) {
      merged[key] = composeEventHandlers(childValue as Handler, slotValue as Handler);
    } else {
      merged[key] = childValue;
    }
  }
  return merged;
}
