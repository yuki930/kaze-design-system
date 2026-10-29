/**
 * Compose a consumer's event handler with a component's internal one.
 * The consumer runs first; if it calls `preventDefault()` the internal handler is skipped,
 * so consumers can opt out of built-in behavior without losing their own handler.
 */
export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  user: ((event: E) => void) | undefined,
  internal: (event: E) => void,
): (event: E) => void {
  return (event) => {
    user?.(event);
    if (!event.defaultPrevented) internal(event);
  };
}
