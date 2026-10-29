import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
});

describe("Toast tones", () => {
  it.each([
    ["default", "status", false],
    ["positive", "status", true],
    ["info", "status", true],
    ["warning", "alert", true],
    ["negative", "alert", true],
  ] as const)("%s uses role=%s", (tone, role, hasIcon) => {
    mount();
    act(() => {
      api.toast({ title: "件名", tone });
    });
    const el = screen.getByRole(role);
    expect(el).toHaveAttribute("data-tone", tone);
    expect(el.classList.contains(`toast--${tone}`)).toBe(tone !== "default");
    expect(el.querySelector(".toast__icon svg") !== null).toBe(hasIcon);
  });

  it("renders the description only when given", () => {
    mount();
    act(() => {
      api.toast({ title: "保存しました", description: "3 件を更新" });
      api.toast({ title: "完了" });
    });
    const [withDesc, withoutDesc] = screen.getAllByRole("status");
    expect(withDesc?.querySelector(".toast__description")).toHaveTextContent("3 件を更新");
    expect(withoutDesc?.querySelector(".toast__description")).toBeNull();
  });
});

describe("Toast dismissal", () => {
  it("throws when useToast is used outside a provider", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Capture />)).toThrow("useToast must be used within a <ToastProvider>");
    error.mockRestore();
  });

  it("closes from the close button with default labels", () => {
    mount();
    act(() => {
      api.toast({ title: "閉じられる", duration: 60000 });
    });
    expect(screen.getByRole("region", { name: "通知" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "閉じる" }));
    expect(screen.getByRole("status")).toHaveAttribute("data-removing", "true");
    act(() => vi.advanceTimersByTime(150));
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("honors custom close and container labels", () => {
    render(
      <ToastProvider closeLabel="Dismiss" containerLabel="Notifications">
        <Capture />
      </ToastProvider>,
    );
    act(() => {
      api.toast({ title: "x" });
    });
    expect(screen.getByRole("region", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });

  it("auto-dismisses after 4 seconds by default", () => {
    mount();
    act(() => {
      api.toast({ title: "既定" });
    });
    act(() => vi.advanceTimersByTime(3999));
    expect(screen.getByRole("status")).toHaveAttribute("data-state", "open");
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole("status")).toHaveAttribute("data-state", "closing");
  });

  it("resumes with the remaining time after a pause", () => {
    mount();
    act(() => {
      api.toast({ title: "残り", duration: 1000 });
    });
    const el = screen.getByRole("status");
    act(() => vi.advanceTimersByTime(600));
    fireEvent.mouseEnter(el);
    act(() => vi.advanceTimersByTime(10000));
    fireEvent.mouseLeave(el);
    act(() => vi.advanceTimersByTime(399));
    expect(el).toHaveAttribute("data-state", "open");
    act(() => vi.advanceTimersByTime(1));
    expect(el).toHaveAttribute("data-state", "closing");
  });

  it("pauses while focus is inside and resumes when focus leaves the toast", () => {
    render(
      <ToastProvider>
        <Capture />
        <button type="button">外</button>
      </ToastProvider>,
    );
    act(() => {
      api.toast({ title: "フォーカス", duration: 500 });
    });
    const el = screen.getByRole("status");
    const close = screen.getByRole("button", { name: "閉じる" });
    fireEvent.focus(close);
    act(() => vi.advanceTimersByTime(2000));
    expect(el).toHaveAttribute("data-state", "open");
    // focus moving within the toast keeps it paused
    fireEvent.blur(close, { relatedTarget: el });
    act(() => vi.advanceTimersByTime(2000));
    expect(el).toHaveAttribute("data-state", "open");
    fireEvent.blur(close, { relatedTarget: screen.getByRole("button", { name: "外" }) });
    act(() => vi.advanceTimersByTime(500));
    expect(el).toHaveAttribute("data-state", "closing");
  });

  it("stays paused while still focused after the pointer leaves", () => {
    mount();
    act(() => {
      api.toast({ title: "両方", duration: 300 });
    });
    const el = screen.getByRole("status");
    fireEvent.mouseEnter(el);
    fireEvent.focus(el);
    fireEvent.mouseLeave(el);
    act(() => vi.advanceTimersByTime(1000));
    expect(el).toHaveAttribute("data-state", "open");
    fireEvent.blur(el);
    act(() => vi.advanceTimersByTime(300));
    expect(el).toHaveAttribute("data-state", "closing");
  });

  it("does not restart the timer when hover ends during the exit animation", () => {
    mount();
    let id = "";
    act(() => {
      id = api.toast({ title: "退場中", duration: 60000 });
    });
    const el = screen.getByRole("status");
    fireEvent.mouseEnter(el);
    act(() => api.dismiss(id));
    fireEvent.mouseLeave(el);
    // dismissing again while closing is a no-op
    act(() => api.dismiss(id));
    act(() => vi.advanceTimersByTime(150));
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("ignores dismiss for an unknown id", () => {
    mount();
    act(() => {
      api.toast({ title: "残る", duration: 60000 });
    });
    act(() => api.dismiss("toast-unknown"));
    expect(screen.getByRole("status")).toHaveAttribute("data-state", "open");
  });

  it("returns unique ids", () => {
    mount();
    let a = "";
    let b = "";
    act(() => {
      a = api.toast({ title: "a" });
      b = api.toast({ title: "b" });
    });
    expect(a).not.toBe(b);
  });

  it("cleans up pending timers when the provider unmounts", () => {
    const { unmount } = render(
      <ToastProvider>
        <Capture />
      </ToastProvider>,
    );
    let id = "";
    act(() => {
      api.toast({ title: "a", duration: 1000 });
      id = api.toast({ title: "b", duration: 1000 });
    });
    act(() => api.dismiss(id));
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
