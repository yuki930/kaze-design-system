import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { type ReactNode, useRef } from "react";
import { useFocusTrap } from "./useFocusTrap";

function Trap({
  active,
  children,
  tabIndex,
}: {
  active: boolean;
  children?: ReactNode;
  tabIndex?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, active);
  return (
    <div ref={ref} data-testid="trap" tabIndex={tabIndex}>
      {children}
    </div>
  );
}

function App({ active, children }: { active: boolean; children?: ReactNode }) {
  return (
    <>
      <button type="button">opener</button>
      {active && <Trap active>{children}</Trap>}
    </>
  );
}

function Removable({ active, showOpener }: { active: boolean; showOpener: boolean }) {
  return (
    <>
      {showOpener && <button type="button">opener</button>}
      {active && (
        <Trap active>
          <button type="button">inside</button>
        </Trap>
      )}
    </>
  );
}

const tab = (el: Element, shiftKey = false) =>
  fireEvent.keyDown(el, { key: "Tab", shiftKey, bubbles: true, cancelable: true });

afterEach(() => vi.unstubAllGlobals());

describe("useFocusTrap", () => {
  it("does nothing while inactive", () => {
    render(
      <Trap active={false}>
        <button type="button">a</button>
      </Trap>,
    );
    expect(document.activeElement).toBe(document.body);
    expect(tab(screen.getByText("a"))).toBe(true);
  });

  it("focuses the first focusable element, skipping disabled and tabindex=-1", () => {
    render(
      <Trap active>
        <button type="button" disabled>
          disabled
        </button>
        <span tabIndex={-1}>skip</span>
        <a href="#help">ヘルプを見る</a>
        <button type="button">last</button>
      </Trap>,
    );
    expect(document.activeElement).toBe(screen.getByText("ヘルプを見る"));
  });

  it("wraps Tab from the last to the first element", () => {
    render(
      <Trap active>
        <button type="button">first</button>
        <input aria-label="middle" />
        <button type="button">last</button>
      </Trap>,
    );
    const last = screen.getByText("last");
    last.focus();
    expect(tab(last)).toBe(false);
    expect(document.activeElement).toBe(screen.getByText("first"));
  });

  it("wraps Shift+Tab from the first to the last element", () => {
    render(
      <Trap active>
        <button type="button">first</button>
        <button type="button">last</button>
      </Trap>,
    );
    const first = screen.getByText("first");
    expect(document.activeElement).toBe(first);
    expect(tab(first, true)).toBe(false);
    expect(document.activeElement).toBe(screen.getByText("last"));
  });

  it("wraps Shift+Tab from the container itself to the last element", () => {
    render(
      <Trap active tabIndex={-1}>
        <button type="button">first</button>
        <button type="button">last</button>
      </Trap>,
    );
    const container = screen.getByTestId("trap");
    container.focus();
    expect(tab(container, true)).toBe(false);
    expect(document.activeElement).toBe(screen.getByText("last"));
  });

  it("lets Tab move naturally between middle elements", () => {
    render(
      <Trap active>
        <button type="button">first</button>
        <button type="button">middle</button>
        <button type="button">last</button>
      </Trap>,
    );
    expect(tab(screen.getByText("first"))).toBe(true);
    const middle = screen.getByText("middle");
    middle.focus();
    expect(tab(middle, true)).toBe(true);
  });

  it("ignores keys other than Tab", () => {
    render(
      <Trap active>
        <button type="button">only</button>
      </Trap>,
    );
    expect(fireEvent.keyDown(screen.getByText("only"), { key: "Enter", cancelable: true })).toBe(
      true,
    );
  });

  it("focuses the container when it has nothing focusable and keeps Tab there", () => {
    render(
      <Trap active>
        <p>テキストのみ</p>
      </Trap>,
    );
    const container = screen.getByTestId("trap");
    expect(container).toHaveAttribute("tabindex", "-1");
    expect(document.activeElement).toBe(container);
    expect(tab(container)).toBe(false);
    expect(document.activeElement).toBe(container);
  });

  it("keeps an existing tabindex on an empty container", () => {
    render(<Trap active tabIndex={0} />);
    expect(screen.getByTestId("trap")).toHaveAttribute("tabindex", "0");
  });

  it("restores focus to the previously focused element on deactivate", () => {
    const { rerender } = render(<App active={false} />);
    const opener = screen.getByText("opener");
    opener.focus();
    rerender(
      <App active>
        <button type="button">inside</button>
      </App>,
    );
    expect(document.activeElement).toBe(screen.getByText("inside"));
    rerender(<App active={false} />);
    expect(document.activeElement).toBe(opener);
  });

  it("retries the restore on the next frame when the opener cannot take focus yet", () => {
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      frames.push(cb);
      return frames.length;
    });
    const { rerender } = render(<App active={false} />);
    const opener = screen.getByText("opener");
    opener.focus();
    rerender(
      <App active>
        <button type="button">inside</button>
      </App>,
    );
    // simulate an opener that is still inert when the trap cleans up
    opener.setAttribute("disabled", "");
    rerender(<App active={false} />);
    expect(document.activeElement).not.toBe(opener);
    expect(frames).toHaveLength(1);
    opener.removeAttribute("disabled");
    frames[0]?.(0);
    expect(document.activeElement).toBe(opener);
  });

  it("skips the retry when the opener was removed before the next frame", () => {
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      frames.push(cb);
      return frames.length;
    });
    const { rerender } = render(<Removable active={false} showOpener />);
    const opener = screen.getByText("opener");
    opener.focus();
    rerender(<Removable active showOpener />);
    opener.setAttribute("disabled", "");
    rerender(<Removable active={false} showOpener />);
    expect(frames).toHaveLength(1);
    rerender(<Removable active={false} showOpener={false} />);
    expect(opener.isConnected).toBe(false);
    for (const f of frames) f(0);
    expect(document.activeElement).not.toBe(opener);
  });
});
