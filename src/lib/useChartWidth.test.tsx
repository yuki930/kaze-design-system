import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { useChartWidth } from "./useChartWidth";

function Probe({ fallback = 600, attach = true }: { fallback?: number; attach?: boolean }) {
  const { ref, width, measured } = useChartWidth<HTMLDivElement>(fallback);
  return (
    <div ref={attach ? ref : undefined} data-testid="probe">
      {width}:{String(measured)}
    </div>
  );
}

let rectWidth = 0;
function mockWidth() {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    () => ({ width: rectWidth }) as DOMRect,
  );
}

type ROCallback = () => void;
class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];
  callback: ROCallback;
  observed: Element[] = [];
  disconnect = vi.fn();
  constructor(cb: ROCallback) {
    this.callback = cb;
    FakeResizeObserver.instances.push(this);
  }
  observe(el: Element) {
    this.observed.push(el);
  }
  unobserve() {}
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  FakeResizeObserver.instances = [];
  rectWidth = 0;
});

describe("useChartWidth", () => {
  it("returns the fallback and stays unmeasured when the container has no width", () => {
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    mockWidth();
    render(<Probe fallback={480} />);
    expect(screen.getByTestId("probe")).toHaveTextContent("480:false");
  });

  it("measures before paint and rounds the width", () => {
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    rectWidth = 321.6;
    mockWidth();
    render(<Probe />);
    expect(screen.getByTestId("probe")).toHaveTextContent("322:true");
  });

  it("re-measures on resize and disconnects on unmount", () => {
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    rectWidth = 300;
    mockWidth();
    const { unmount } = render(<Probe />);
    const ro = FakeResizeObserver.instances[0];
    expect(ro?.observed).toEqual([screen.getByTestId("probe")]);

    rectWidth = 420;
    act(() => ro?.callback());
    expect(screen.getByTestId("probe")).toHaveTextContent("420:true");

    // a zero-width resize (e.g. display:none) keeps the last good width
    rectWidth = 0;
    act(() => ro?.callback());
    expect(screen.getByTestId("probe")).toHaveTextContent("420:true");

    unmount();
    expect(ro?.disconnect).toHaveBeenCalledTimes(1);
  });

  it("measures once without ResizeObserver", () => {
    vi.stubGlobal("ResizeObserver", undefined);
    rectWidth = 250;
    mockWidth();
    const { unmount } = render(<Probe />);
    expect(screen.getByTestId("probe")).toHaveTextContent("250:true");
    expect(() => unmount()).not.toThrow();
  });

  it("does nothing when the ref is not attached", () => {
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    rectWidth = 300;
    mockWidth();
    render(<Probe attach={false} />);
    expect(screen.getByTestId("probe")).toHaveTextContent("600:false");
    expect(FakeResizeObserver.instances).toHaveLength(0);
  });
});
