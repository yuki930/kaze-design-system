"use client";

import { useState, useCallback, useMemo, type CSSProperties } from "react";

interface RechartsLegendClickEvent {
  dataKey?: string | number;
  value?: string;
  color?: string;
  [key: string]: unknown;
}

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
    onClick: (e: RechartsLegendClickEvent) => void;
    formatter: (
      value: string,
      entry: { dataKey?: string | number; color?: string },
    ) => React.ReactNode;
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
      onClick: (e: RechartsLegendClickEvent) => {
        if (e?.dataKey != null) toggle(String(e.dataKey));
      },
      formatter: (
        value: string,
        entry: { dataKey?: string | number; color?: string },
      ) => {
        const key = entry?.dataKey != null ? String(entry.dataKey) : "";
        const hidden = hiddenSeries.has(key);
        return (
          <span
            style={{
              color: hidden
                ? "var(--color-fg-tertiary, #a1a1aa)"
                : entry?.color,
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
