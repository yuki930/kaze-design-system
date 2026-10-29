import { describe, expect, it, vi } from "vitest";
import { composeEventHandlers } from "./composeEventHandlers";

describe("composeEventHandlers", () => {
  it("calls the user handler first, then the internal one", () => {
    const order: string[] = [];
    const handler = composeEventHandlers(
      () => order.push("user"),
      () => order.push("internal"),
    );
    handler({ defaultPrevented: false });
    expect(order).toEqual(["user", "internal"]);
  });

  it("skips the internal handler when the user calls preventDefault", () => {
    const internal = vi.fn();
    const handler = composeEventHandlers<{ defaultPrevented: boolean }>((e) => {
      e.defaultPrevented = true;
    }, internal);
    handler({ defaultPrevented: false });
    expect(internal).not.toHaveBeenCalled();
  });

  it("works without a user handler", () => {
    const internal = vi.fn();
    composeEventHandlers(undefined, internal)({ defaultPrevented: false });
    expect(internal).toHaveBeenCalledTimes(1);
  });
});
