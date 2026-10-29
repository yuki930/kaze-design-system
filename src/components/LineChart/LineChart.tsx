"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { cn } from "@/lib/utils";
import { CHART_COLORS } from "../../lib/chartColors";
import { defaultFormat, linearScale, niceScale } from "../../lib/chartScale";
import { ChartLegend } from "../ChartLegend";

export interface LineChartSeries {
  /** Key of the value in each data row */
  key: string;
  /** Display label (legend and tooltip) */
  label: string;
  /** Stroke color (defaults to the shared chart palette by series order) */
  color?: string;
}

export type LineChartDatum = Record<string, string | number | null | undefined>;

export interface LineChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** One row per x point. Missing values (null / undefined) break the line. */
  data: LineChartDatum[];
  /** Key of the x axis label in each row (e.g. "month") */
  index: string;
  series: LineChartSeries[];
  /** Chart height in px (default: 240) */
  height?: number;
  /** Fill the area under each line with a flat low-opacity color */
  area?: boolean;
  /** "monotone" is a monotone cubic interpolation that never overshoots (default: "linear") */
  curve?: "linear" | "monotone";
  /** Show horizontal grid lines (default: true) */
  showGrid?: boolean;
  /** Show x axis labels (default: true) */
  showXAxis?: boolean;
  /** Show y axis labels (default: true) */
  showYAxis?: boolean;
  /** Show the toggleable legend (default: true) */
  showLegend?: boolean;
  /** Always show point markers. The hovered point is shown regardless (default: false) */
  showDots?: boolean;
  /** Width reserved for y axis labels in px (default: 48) */
  yAxisWidth?: number;
  /** Include zero in the y axis (default: true). Set false to fit the data range, e.g. a price or balance line */
  startAtZero?: boolean;
  /** Format values for y axis and tooltip */
  formatValue?: (value: number) => string;
  /** Accessible description of the chart (required) */
  "aria-label": string;
}

type Pt = { x: number; y: number };

const PAD_TOP = 8;
const PAD_BOTTOM = 24;
const PAD_RIGHT = 12;
const X_LABEL_MIN_GAP = 64;
const INITIAL_WIDTH = 600;

const num = (v: number) => Number(v.toFixed(2));

function toNumber(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

/** Split into runs of consecutive non-null points so gaps break the line. */
function splitRuns(points: (Pt | null)[]): Pt[][] {
  const runs: Pt[][] = [];
  let cur: Pt[] = [];
  for (const p of points) {
    if (p) cur.push(p);
    else if (cur.length) {
      runs.push(cur);
      cur = [];
    }
  }
  if (cur.length) runs.push(cur);
  return runs;
}

/** Index access that is safe by construction (callers iterate within bounds). */
const at = <T,>(arr: readonly T[], i: number): T => arr[i] as T;

/** Fritsch-Carlson tangents: monotone cubic Hermite, no overshoot between points. */
function monotoneTangents(pts: Pt[]): number[] {
  const n = pts.length;
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const p0 = at(pts, i);
    const p1 = at(pts, i + 1);
    d.push((p1.y - p0.y) / (p1.x - p0.x || 1));
  }
  const m: number[] = new Array(n).fill(0);
  m[0] = at(d, 0);
  m[n - 1] = at(d, n - 2);
  for (let i = 1; i < n - 1; i++) {
    const prev = at(d, i - 1);
    const next = at(d, i);
    m[i] = prev * next <= 0 ? 0 : (prev + next) / 2;
  }
  for (let i = 0; i < n - 1; i++) {
    const di = at(d, i);
    if (di === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = at(m, i) / di;
    const b = at(m, i + 1) / di;
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      m[i] = t * a * di;
      m[i + 1] = t * b * di;
    }
  }
  return m;
}

function linePath(run: Pt[], curve: "linear" | "monotone"): string {
  const first = at(run, 0);
  let d = `M${num(first.x)},${num(first.y)}`;
  if (curve === "monotone" && run.length > 2) {
    const m = monotoneTangents(run);
    for (let i = 0; i < run.length - 1; i++) {
      const p0 = at(run, i);
      const p1 = at(run, i + 1);
      const dx = (p1.x - p0.x) / 3;
      d += `C${num(p0.x + dx)},${num(p0.y + at(m, i) * dx)},${num(p1.x - dx)},${num(p1.y - at(m, i + 1) * dx)},${num(p1.x)},${num(p1.y)}`;
    }
    return d;
  }
  for (let i = 1; i < run.length; i++) {
    const p = at(run, i);
    d += `L${num(p.x)},${num(p.y)}`;
  }
  return d;
}

export const LineChart = forwardRef<HTMLDivElement, LineChartProps>(
  (
    {
      data,
      index,
      series,
      height = 240,
      area = false,
      curve = "linear",
      showGrid = true,
      showXAxis = true,
      showYAxis = true,
      showLegend = true,
      showDots = false,
      yAxisWidth = 48,
      startAtZero = true,
      formatValue = defaultFormat,
      "aria-label": ariaLabel,
      className,
      ...rest
    },
    ref,
  ) => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [width, setWidth] = useState(INITIAL_WIDTH);
    const [hidden, setHidden] = useState<string[]>([]);
    const [active, setActive] = useState<number | null>(null);

    useEffect(() => {
      const el = wrapRef.current;
      if (!el) return;
      const measure = () => {
        const w = Math.round(el.getBoundingClientRect().width);
        if (w > 0) setWidth(w);
      };
      measure();
      if (typeof ResizeObserver === "undefined") return;
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    const toggle = useCallback((key: string) => {
      setHidden((h) => (h.includes(key) ? h.filter((k) => k !== key) : [...h, key]));
    }, []);

    const items = series.map((s, i) => ({
      key: s.key,
      label: s.label,
      color: s.color ?? CHART_COLORS[i % CHART_COLORS.length] ?? "var(--chart-emerald)",
    }));
    const visible = items.filter((s) => !hidden.includes(s.key));

    const n = data.length;
    const padLeft = showYAxis ? yAxisWidth : 8;
    const padBottom = showXAxis ? PAD_BOTTOM : 4;
    const plotW = Math.max(width - padLeft - PAD_RIGHT, 1);
    const plotH = Math.max(height - PAD_TOP - padBottom, 1);

    let lo = Number.POSITIVE_INFINITY;
    let hi = Number.NEGATIVE_INFINITY;
    for (const s of visible) {
      for (const row of data) {
        const v = toNumber(row[s.key]);
        if (v === null) continue;
        lo = Math.min(lo, v);
        hi = Math.max(hi, v);
      }
    }
    if (!Number.isFinite(lo)) {
      lo = 0;
      hi = 1;
    }
    const scale = niceScale(lo, hi, 5, startAtZero);
    const yOf = linearScale([scale.min, scale.max], [PAD_TOP + plotH, PAD_TOP]);
    const xOf = (i: number) => padLeft + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW);

    const labelStep = Math.max(1, Math.ceil(X_LABEL_MIN_GAP / (n <= 1 ? plotW : plotW / (n - 1))));

    const indexFromPointer = (e: PointerEvent<SVGSVGElement>) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect || n === 0) return null;
      const scaleX = rect.width ? width / rect.width : 1;
      const x = (e.clientX - rect.left) * scaleX - padLeft;
      if (n === 1) return 0;
      return Math.min(n - 1, Math.max(0, Math.round((x / plotW) * (n - 1))));
    };

    const onKeyDown = (e: KeyboardEvent<SVGSVGElement>) => {
      if (n === 0) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setActive((a) => (a === null ? 0 : Math.min(n - 1, a + 1)));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActive((a) => (a === null ? n - 1 : Math.max(0, a - 1)));
      } else if (e.key === "Home") {
        e.preventDefault();
        setActive(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setActive(n - 1);
      } else if (e.key === "Escape") {
        setActive(null);
      }
    };

    const activeX = active !== null && active < n ? xOf(active) : null;
    const activeRow = active !== null ? data[active] : undefined;
    const flip = activeX !== null && activeX > width / 2;

    return (
      <div ref={ref} className={cn("line-chart", className)} {...rest}>
        <div ref={wrapRef} className="chart">
          <svg
            ref={svgRef}
            className="chart__svg line-chart__svg"
            role="img"
            aria-label={ariaLabel}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            // biome-ignore lint/a11y/noNoninteractiveTabindex: keyboard users move the crosshair with arrow keys
            tabIndex={0}
            onPointerMove={(e) => setActive(indexFromPointer(e))}
            onPointerLeave={() => setActive(null)}
            onKeyDown={onKeyDown}
            onBlur={() => setActive(null)}
          >
            {showGrid && (
              <g className="chart-grid">
                {scale.ticks.map((t) => (
                  <line key={t} x1={padLeft} x2={padLeft + plotW} y1={yOf(t)} y2={yOf(t)} />
                ))}
              </g>
            )}
            {showYAxis && (
              <g className="chart-axis">
                {scale.ticks.map((t) => (
                  <text
                    key={t}
                    x={padLeft - 8}
                    y={yOf(t)}
                    textAnchor="end"
                    dominantBaseline="middle"
                  >
                    {formatValue(t)}
                  </text>
                ))}
              </g>
            )}
            {showXAxis && (
              <g className="chart-axis">
                {data.map((row, i) =>
                  i % labelStep === 0 ? (
                    <text
                      // biome-ignore lint/suspicious/noArrayIndexKey: x points are positional
                      key={i}
                      x={xOf(i)}
                      y={PAD_TOP + plotH + 16}
                      textAnchor="middle"
                    >
                      {String(row[index] ?? "")}
                    </text>
                  ) : null,
                )}
              </g>
            )}

            {visible.map((s) => {
              const pts = data.map((row, i) => {
                const v = toNumber(row[s.key]);
                return v === null ? null : { x: xOf(i), y: yOf(v) };
              });
              const runs = splitRuns(pts);
              const base = yOf(Math.max(scale.min, Math.min(0, scale.max)));
              return (
                <g key={s.key} className="line-chart__series" style={{ color: s.color }}>
                  {area &&
                    runs
                      .filter((r) => r.length > 1)
                      .map((r) => (
                        <path
                          key={`a${at(r, 0).x}`}
                          className="line-chart__area"
                          d={`${linePath(r, curve)}L${num(at(r, r.length - 1).x)},${num(base)}L${num(at(r, 0).x)},${num(base)}Z`}
                        />
                      ))}
                  {runs.map((r) =>
                    r.length > 1 ? (
                      <path
                        key={`l${at(r, 0).x}`}
                        className="line-chart__line"
                        d={linePath(r, curve)}
                      />
                    ) : (
                      <circle
                        key={`s${at(r, 0).x}`}
                        className="line-chart__dot"
                        cx={at(r, 0).x}
                        cy={at(r, 0).y}
                        r={3}
                      />
                    ),
                  )}
                  {showDots &&
                    runs
                      .filter((r) => r.length > 1)
                      .flat()
                      .map((p) => (
                        <circle key={p.x} className="line-chart__dot" cx={p.x} cy={p.y} r={3} />
                      ))}
                  {active !== null && pts[active] && (
                    <circle
                      className="line-chart__dot line-chart__dot--active"
                      cx={pts[active]?.x}
                      cy={pts[active]?.y}
                      r={4.5}
                    />
                  )}
                </g>
              );
            })}

            {activeX !== null && (
              <line
                className="chart-crosshair"
                x1={activeX}
                x2={activeX}
                y1={PAD_TOP}
                y2={PAD_TOP + plotH}
              />
            )}
          </svg>

          {activeRow && activeX !== null && (
            <div
              className="chart-tooltip line-chart__tooltip"
              style={{
                left: activeX,
                top: PAD_TOP,
                transform: `translateX(${flip ? "calc(-100% - 12px)" : "12px"})`,
              }}
            >
              <div className="chart-tooltip__title">{String(activeRow[index] ?? "")}</div>
              {visible.map((s) => {
                const v = toNumber(activeRow[s.key]);
                return (
                  <div key={s.key} className="chart-tooltip__row">
                    <span className="chart-tooltip__swatch" style={{ background: s.color }} />
                    <span className="chart-tooltip__label">{s.label}</span>
                    <span className="chart-tooltip__value">
                      {v === null ? "-" : formatValue(v)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {showLegend && <ChartLegend items={items} hidden={hidden} onToggle={toggle} />}
      </div>
    );
  },
);
LineChart.displayName = "LineChart";
