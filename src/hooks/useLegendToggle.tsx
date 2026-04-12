"use client";

import { useState, useCallback, useMemo, type CSSProperties } from "react";

/**
 * Public shape of `legendProps`. The `onClick` and `formatter` signatures
 * intentionally use `unknown` (rather than a hand-rolled Recharts shim)
 * so the object is structurally assignable to Recharts' own
 * `<Legend>` props without needing a peer-dep on `recharts`.
 *
 * See kaze-design-system#27 — earlier versions used a narrow custom
 * `RechartsLegendClickEvent` type which failed to unify with Recharts'
 * `LegendProps['onClick']`, forcing downstream users to wrap with
 * `as any`.
 */
export interface UseLegendToggleResult {
  /** Whether a given dataKey is currently hidden */
  isHidden: (dataKey: string) => boolean;
  /** Toggle visibility for a given dataKey */
  toggle: (dataKey: string) => void;
  /** Reset all series to visible */
  reset: () => void;
  /** Props to spread onto a Recharts `<Legend />` */
  legendProps: {
    wrapperStyle: CSSProperties;
    onClick: (e: unknown) => void;
    formatter: (value: string, entry: unknown) => React.ReactNode;
  };
}

/**
 * Hook for toggling Recharts legend entries to hide/show individual series.
 *
 * @example
 * const { isHidden, legendProps } = useLegendToggle();
 * return (
 *   <BarChart data={data}>
 *     <Legend {...legendProps} />
 *     <Bar dataKey="revenue" hide={isHidden("revenue")} />
 *   </BarChart>
 * );
 */
export function useLegendToggle(): UseLegendToggleResult {
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  const toggle = useCallback((dataKey: string) => {
    setHiddenSeries((prev) => {
      const next = new Set(prev);
      if (next.has(dataKey)) next.delete(dataKey);
      else next.add(dataKey);
      return next;
    });
  }, []);

  const isHidden = useCallback(
    (dataKey: string) => hiddenSeries.has(dataKey),
    [hiddenSeries],
  );

  const reset = useCallback(() => setHiddenSeries(new Set()), []);

  const legendProps = useMemo(
    () => ({
      wrapperStyle: {
        fontSize: 12,
        cursor: "pointer",
      } as CSSProperties,
      onClick: (e: unknown) => {
        const dataKey = (e as { dataKey?: string | number } | null)?.dataKey;
        if (dataKey != null) toggle(String(dataKey));
      },
      formatter: (value: string, entry: unknown) => {
        const e = entry as
          | { dataKey?: string | number; color?: string }
          | null;
        const key = e?.dataKey != null ? String(e.dataKey) : "";
        const hidden = hiddenSeries.has(key);
        return (
          <span
            style={{
              color: hidden
                ? "var(--color-fg-tertiary, #a1a1aa)"
                : e?.color,
              transition: "color 0.15s ease",
            }}
          >
            {value}
          </span>
        );
      },
    }),
    [hiddenSeries, toggle],
  );

  return { isHidden, toggle, reset, legendProps };
}
