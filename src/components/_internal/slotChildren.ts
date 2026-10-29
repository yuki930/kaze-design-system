import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

/**
 * asChild renders the consumer's element, so extra content (a spinner, an
 * external-link arrow) has to go inside that element rather than beside it.
 * A non-element child is returned unchanged; Slot reports that mistake itself.
 */
export function wrapSlotChild(
  children: ReactNode,
  before?: ReactNode,
  after?: ReactNode,
): ReactNode {
  const child = Children.toArray(children)[0];
  if (!isValidElement(child)) return children;
  const element = child as ReactElement<{ children?: ReactNode }>;
  return cloneElement(element, undefined, before, element.props.children, after);
}
