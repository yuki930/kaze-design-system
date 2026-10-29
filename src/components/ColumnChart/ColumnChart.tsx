"use client";

import {
  forwardRef,
  useCallback,
  useMemo,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/chartColors";
import { defaultFormat, linearScale, niceScale } from "@/lib/chartScale";
import { useChartWidth } from "@/lib/useChartWidth";
import { ChartLegend } from "../ChartLegend";

export interface ColumnChartSeries {
  /** Key of the numeric field in each data row */
  key: string;
  /** Display label (legend and tooltip) */
  label: string;
  /** Any CSS color. Defaults to the shared chart palette */
  color?: string;
}

export interface ColumnChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "aria-label"> {
  /** Rows of data. Each row holds a category label under `index` and one number per series key */
  data: Record<string, string | number>[];
  /** Field holding the category label (x axis) */
  index: string;
  series: ColumnChartSeries[];
  /** "grouped" places series side by side, "stacked" stacks them (positive and negative separately) */
  layout?: "grouped" | "stacked";
  /** Chart height in px (legend excluded) */
  height?: number;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showLegend?: boolean;
  /** Width in px reserved for y axis labels */
  yAxisWidth?: number;
  /** Formats axis labels and tooltip values */
  formatValue?: (value: number) => string;
  /** Corner radius of the bar end that faces away from the baseline */
  barRadius?: number;
  /** Accessible label for the chart (required for accessibility) */
  "aria-label": string;
}

interface Bar {
  key: string;
  x: number;
  width: number;
  /** Value-space start and end (stacked segments start at the previous segment's end) */
  from: number;
  to: number;
  roundEnd: boolean;
}

const FALLBACK_WIDTH = 640;
const PAD_TOP = 8;
const PAD_RIGHT = 8;
const BAR_GAP = 2;

function toNumber(v: string | number | undefined): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

/** Bar from `y0` (baseline side) to `y1`, rounding only the `y1` end. */
function barPath(x: number, y0: number, y1: number, w: number, radius: number, roundEnd: boolean) {
  const h = Math.abs(y1 - y0);
  if (h === 0 || w <= 0) return "";
  const r = roundEnd ? Math.min(radius, w / 2, h) : 0;
  const x1 = x + w;
  if (y1 <= y0) {
    return `M${x},${y0}V${y1 + r}${r ? `Q${x},${y1} ${x + r},${y1}` : ""}H${x1 - r}${r ? `Q${x1},${y1} ${x1},${y1 + r}` : ""}V${y0}Z`;
  }
  return `M${x},${y0}V${y1 - r}${r ? `Q${x},${y1} ${x + r},${y1}` : ""}H${x1 - r}${r ? `Q${x1},${y1} ${x1},${y1 - r}` : ""}V${y0}Z`;
}

export const ColumnChart = forwardRef<HTMLDivElement, ColumnChartProps>(
  (
    {
      data,
      index,
      series,
      layout = "grouped",
      height = 240,
      showGrid = true,
      showXAxis = true,
      showYAxis = true,
      showLegend = true,
      yAxisWidth = 48,
      formatValue = defaultFormat,
      barRadius = 2,
      "aria-label": ariaLabel,
      className,
      onKeyDown,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const { ref: wrapRef, width, measured } = useChartWidth<HTMLDivElement>(FALLBACK_WIDTH);
    const [hidden, setHidden] = useState<string[]>([]);
    const [active, setActive] = useState<number | null>(null);

    const toggle = useCallback((key: string) => {
      setHidden((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
    }, []);

    const colorOf = (s: ColumnChartSeries, i: number) =>
      s.color ?? CHART_COLORS[i % CHART_COLORS.length] ?? "var(--chart-1)";

    const visible = useMemo(() => series.filter((s) => !hidden.includes(s.key)), [series, hidden]);
    const stacked = layout === "stacked";

    const left = showYAxis ? yAxisWidth : 4;
    const bottom = showXAxis ? 24 : 4;
    const plotW = Math.max(width - left - PAD_RIGHT, 1);
    const plotH = Math.max(height - PAD_TOP - bottom, 1);
    const n = data.length;
    const step = n > 0 ? plotW / n : plotW;

    const scale = useMemo(() => {
      let lo = 0;
      let hi = 0;
      for (const row of data) {
        let pos = 0;
        let neg = 0;
        for (const s of visible) {
          const v = toNumber(row[s.key]);
          if (stacked) {
            if (v >= 0) pos += v;
            else neg += v;
          } else {
            lo = Math.min(lo, v);
            hi = Math.max(hi, v);
          }
        }
        if (stacked) {
          lo = Math.min(lo, neg);
          hi = Math.max(hi, pos);
        }
      }
      return niceScale(lo, hi);
    }, [data, visible, stacked]);

    const y = linearScale([scale.min, scale.max], [PAD_TOP + plotH, PAD_TOP]);
    const y0 = y(0);

    const columns = useMemo(() => {
      const groupW = step * 0.7;
      return data.map((row, ci) => {
        const gx = left + ci * step + (step - groupW) / 2;
        const bars: Bar[] = [];
        if (stacked) {
          let pos = 0;
          let neg = 0;
          const lastPos = [...visible].reverse().find((s) => toNumber(row[s.key]) > 0)?.key;
          const lastNeg = [...visible].reverse().find((s) => toNumber(row[s.key]) < 0)?.key;
          for (const s of visible) {
            const v = toNumber(row[s.key]);
            if (v === 0) continue;
            const from = v > 0 ? pos : neg;
            const to = from + v;
            if (v > 0) pos = to;
            else neg = to;
            bars.push({
              key: s.key,
              x: gx,
              width: groupW,
              from,
              to,
              roundEnd: s.key === (v > 0 ? lastPos : lastNeg),
            });
          }
        } else {
          const k = Math.max(visible.length, 1);
          const bw = Math.max((groupW - BAR_GAP * (k - 1)) / k, 1);
          visible.forEach((s, si) => {
            bars.push({
              key: s.key,
              x: gx + si * (bw + BAR_GAP),
              width: bw,
              from: 0,
              to: toNumber(row[s.key]),
              roundEnd: true,
            });
          });
        }
        return bars;
      });
    }, [data, visible, stacked, step, left]);

    const labels = data.map((row) => String(row[index] ?? ""));
    const longest = labels.reduce((m, l) => Math.max(m, l.length), 0);
    const labelEvery = Math.max(1, Math.ceil((longest * 8 + 12) / step));

    const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || n === 0) return;
      let next: number | null | undefined;
      if (e.key === "ArrowRight") next = active === null ? 0 : Math.min(active + 1, n - 1);
      else if (e.key === "ArrowLeft") next = active === null ? n - 1 : Math.max(active - 1, 0);
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = n - 1;
      else if (e.key === "Escape") next = null;
      else return;
      e.preventDefault();
      setActive(next ?? null);
    };

    const activeRow = active !== null ? data[active] : undefined;
    const activeCenter = active !== null ? left + (active + 0.5) * step : 0;
    const activeTotal = activeRow
      ? visible.reduce((sum, s) => sum + toNumber(activeRow[s.key]), 0)
      : 0;

    return (
      <div ref={ref} className={cn("chart", "column-chart", className)} {...rest}>
        <div ref={wrapRef} className="column-chart__plot">
          <div
            role="img"
            aria-label={ariaLabel}
            // biome-ignore lint/a11y/noNoninteractiveTabindex: keyboard users step through categories with arrow keys
            tabIndex={0}
            className="column-chart__figure"
            onKeyDown={onKey}
            onBlur={(e) => {
              onBlur?.(e);
              setActive(null);
            }}
          >
            <svg
              className="chart__svg column-chart__svg"
              width={measured ? width : "100%"}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio={measured ? undefined : "none"}
              onPointerLeave={() => setActive(null)}
              aria-hidden="true"
            >
              {showGrid && (
                <g className="chart-grid">
                  {scale.ticks.map((t) => (
                    <line key={t} x1={left} x2={left + plotW} y1={y(t)} y2={y(t)} />
                  ))}
                </g>
              )}
              {showYAxis && (
                <g className="chart-axis column-chart__y-axis">
                  {scale.ticks.map((t) => (
                    <text key={t} x={left - 8} y={y(t)} textAnchor="end" dominantBaseline="middle">
                      {formatValue(t)}
                    </text>
                  ))}
                </g>
              )}
              {active !== null && (
                <rect
                  className="column-chart__band"
                  x={left + active * step}
                  y={PAD_TOP}
                  width={step}
                  height={plotH}
                />
              )}
              {columns.map((bars, ci) => (
                <g key={labels[ci] + String(ci)} className="column-chart__column">
                  {bars.map((b) => {
                    const s = series.find((x) => x.key === b.key);
                    if (!s) return null;
                    return (
                      <path
                        key={b.key}
                        className="column-chart__bar"
                        d={barPath(b.x, y(b.from), y(b.to), b.width, barRadius, b.roundEnd)}
                        fill={colorOf(s, series.indexOf(s))}
                      />
                    );
                  })}
                </g>
              ))}
              <g className="chart-axis">
                <line x1={left} x2={left + plotW} y1={y0} y2={y0} />
                {showXAxis &&
                  labels.map((l, ci) =>
                    ci % labelEvery === 0 ? (
                      <text
                        // biome-ignore lint/suspicious/noArrayIndexKey: labels may repeat
                        key={ci}
                        x={left + (ci + 0.5) * step}
                        y={PAD_TOP + plotH + 16}
                        textAnchor="middle"
                      >
                        {l}
                      </text>
                    ) : null,
                  )}
              </g>
              {labels.map((l, ci) => (
                <rect
                  // biome-ignore lint/suspicious/noArrayIndexKey: labels may repeat
                  key={ci}
                  className="column-chart__hit"
                  x={left + ci * step}
                  y={PAD_TOP}
                  width={step}
                  height={plotH}
                  onPointerEnter={() => setActive(ci)}
                >
                  <title>{l}</title>
                </rect>
              ))}
            </svg>
          </div>
          {activeRow && (
            <div
              className="chart-tooltip column-chart__tooltip"
              role="status"
              style={{
                left: activeCenter,
                top: PAD_TOP,
                transform:
                  activeCenter > width / 2 ? "translateX(calc(-100% - 12px))" : "translateX(12px)",
              }}
            >
              <div className="chart-tooltip__title">{labels[active ?? 0]}</div>
              {visible.map((s) => (
                <div key={s.key} className="chart-tooltip__row">
                  <span
                    className="chart-tooltip__swatch"
                    style={{ background: colorOf(s, series.indexOf(s)) }}
                  />
                  <span className="chart-tooltip__label">{s.label}</span>
                  <span className="chart-tooltip__value">
                    {formatValue(toNumber(activeRow[s.key]))}
                  </span>
                </div>
              ))}
              {stacked && visible.length > 1 && (
                <div className="chart-tooltip__row column-chart__total">
                  <span className="chart-tooltip__label">合計</span>
                  <span className="chart-tooltip__value">{formatValue(activeTotal)}</span>
                </div>
              )}
            </div>
          )}
        </div>
        {showLegend && (
          <ChartLegend
            className="column-chart__legend"
            items={series.map((s, i) => ({ key: s.key, label: s.label, color: colorOf(s, i) }))}
            hidden={hidden}
            onToggle={toggle}
          />
        )}
      </div>
    );
  },
);
ColumnChart.displayName = "ColumnChart";
