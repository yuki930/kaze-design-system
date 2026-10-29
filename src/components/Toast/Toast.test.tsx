import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetDeprecationWarnings } from "@/lib/deprecate";
import { ToastProvider, useToast } from "@/components/Toast";

let api: ReturnType<typeof useToast>;
function Capture() {
  api = useToast();
  return null;
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

function mount() {
  render(
    <ToastProvider>
      <Capture />
    </ToastProvider>,
  );
}

describe("Toast", () => {
  it("uses per-toast live roles and no container live region", () => {
    mount();
    act(() => {
      api.toast({ title: "ok" });
      api.toast({ title: "ng", tone: "negative" });
    });
    expect(screen.getByRole("status").getAttribute("aria-atomic")).toBe("true");
    expect(screen.getByRole("alert").textContent).toContain("ng");
    expect(document.querySelector(".toast-container")?.hasAttribute("aria-live")).toBe(false);
  });

  it("auto-dismisses, but pauses while hovered", () => {
    mount();
    act(() => {
      api.toast({ title: "hi", duration: 1000 });
    });
    const el = screen.getByRole("status");
    fireEvent.mouseEnter(el);
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.queryByRole("status")).not.toBeNull();
    fireEvent.mouseLeave(el);
    act(() => vi.advanceTimersByTime(1200));
    act(() => vi.advanceTimersByTime(200));
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("returns an id that dismiss() accepts", () => {
    mount();
    let id = "";
    act(() => {
      id = api.toast({ title: "bye", duration: 60000 });
    });
    act(() => api.dismiss(id));
    act(() => vi.advanceTimersByTime(200));
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("exposes data-tone and data-state", () => {
    mount();
    let id = "";
    act(() => {
      id = api.toast({ title: "ok", tone: "positive" });
    });
    const el = screen.getByRole("status");
    expect(el).toHaveAttribute("data-tone", "positive");
    expect(el).toHaveAttribute("data-state", "open");
    act(() => api.dismiss(id));
    expect(el).toHaveAttribute("data-state", "closing");
  });

  it("still honors deprecated variant and warns once", () => {
    resetDeprecationWarnings();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mount();
    act(() => {
      api.toast({ title: "a", variant: "negative" });
      api.toast({ title: "b", variant: "negative" });
    });
    expect(screen.getAllByRole("alert")).toHaveLength(2);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });
});
