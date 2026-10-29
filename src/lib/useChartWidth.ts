"use client";

import { type RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface ChartWidth<T extends HTMLElement> {
  ref: RefObject<T | null>;
  /** Measured width in px, or `fallback` until the first measurement */
  width: number;
  /**
   * False until the container has been measured (SSR HTML and the first client
   * paint before layout). Charts should stretch the SVG to 100% while false so
   * server-rendered output fits the container instead of jumping on hydration.
   */
  measured: boolean;
}

/** Track a container's width for SVG charts: measured before paint, then via ResizeObserver. */
export function useChartWidth<T extends HTMLElement>(fallback: number): ChartWidth<T> {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  const [measured, setMeasured] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = Math.round(el.getBoundingClientRect().width);
      if (w > 0) {
        setWidth(w);
        setMeasured(true);
      }
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, width, measured };
}
