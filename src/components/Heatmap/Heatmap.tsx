"use client";

import {
  forwardRef,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";
import { defaultFormat } from "../../lib/chartScale";
import { joinIds } from "../_internal/aria";

export interface HeatmapDatum {
  /** Local calendar date as `YYYY-MM-DD` (no time zone conversion is applied) */
  date: string;
  value: number;
}

/** The cell passed to `formatTooltip`. `value` is `null` when there is no data. */
export interface HeatmapCell {
  row?: string;
  column?: string;
  date?: string;
  value: number | null;
}

export interface HeatmapProps extends Omit<HTMLAttributes<HTMLDivElement>, "aria-label"> {
  /** `matrix`: arbitrary rows x columns / `calendar`: one cell per day, a week per column */
  variant?: "matrix" | "calendar";
  /** matrix: row labels (top to bottom) */
  rows?: string[];
  /** matrix: column labels (left to right) */
  columns?: string[];
  /** matrix: `values[row][column]`. `null` renders an empty cell with no data */
  values?: (number | null)[][];
  /** calendar: daily values. Duplicate dates are summed */
  data?: HeatmapDatum[];
  /** calendar: first day (`YYYY-MM-DD`). Defaults to the earliest date in `data` */
  startDate?: string;
  /** calendar: last day (`YYYY-MM-DD`). Defaults to the latest date in `data` */
  endDate?: string;
  /** calendar: first weekday of a week row. 0 = Sunday, 1 = Monday (default) */
  weekStartsOn?: 0 | 1;
  /** Base color of the scale (any CSS color). Default `var(--chart-1)` */
  color?: string;
  /** Number of non-empty steps (default 5) */
  levels?: number;
  /** Value that maps to the darkest step. Defaults to the data maximum */
  max?: number;
  /** Cell edge length in px (default 16) */
  cellSize?: number;
  /** Gap between cells in px (default 3) */
  gap?: number;
  /** Show the "少 ... 多" legend (default true) */
  showLegend?: boolean;
  formatValue?: (value: number) => string;
  /** Replace the tooltip text. When omitted a title and value row are shown */
  formatTooltip?: (cell: HeatmapCell) => string;
  /** Accessible label for the chart (required for accessibility) */
  "aria-label": string;
}

const DAY_MS = 86_400_000;
const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];
// Only some weekday rows are labelled so the axis stays readable at small cell sizes.
const LABELLED_WEEKDAYS = new Set([1, 3, 5]);

/** Days since epoch for a `YYYY-MM-DD` string, computed in UTC so the host time zone never shifts the date. */
function parseDay(date: string): number | null {
  const m = DATE_RE.exec(date);
  if (!m) return null;
  const ms = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const d = new Date(ms);
  // Reject overflow such as 2026-02-31
  if (d.getUTCMonth() !== Number(m[2]) - 1) return null;
  return ms / DAY_MS;
}

function formatDay(day: number): string {
  return new Date(day * DAY_MS).toISOString().slice(0, 10);
}

/** Step 1..levels for a positive value, 0 for empty / non-positive. */
function levelOf(value: number | null, max: number, levels: number): number {
  if (value === null || value <= 0 || max <= 0) return 0;
  return Math.min(levels, Math.max(1, Math.ceil((value / max) * levels)));
}

function levelColor(level: number, levels: number): string | undefined {
  if (level === 0) return undefined;
  const pct = levels === 1 ? 100 : Math.round(25 + (75 * (level - 1)) / (levels - 1));
  return `color-mix(in srgb, var(--heatmap-color) ${pct}%, var(--color-bg-tertiary))`;
}

interface TooltipState {
  x: number;
  y: number;
  cell: HeatmapCell;
}

interface PlacedCell extends HeatmapCell {
  key: string;
  gridRow: number;
  gridColumn: number;
}

export const Heatmap = forwardRef<HTMLDivElement, HeatmapProps>(
  (
    {
      variant = "matrix",
      rows = [],
      columns = [],
      values = [],
      data = [],
      startDate,
      endDate,
      weekStartsOn = 1,
      color = "var(--chart-1)",
      levels = 5,
      max,
      cellSize = 16,
      gap = 3,
      showLegend = true,
      formatValue = defaultFormat,
      formatTooltip,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [tip, setTip] = useState<TooltipState | null>(null);
    const summaryId = `${useId()}-summary`;
    const stepCount = Math.max(1, Math.floor(levels));

    const cells: PlacedCell[] = [];
    let gridColumns = 0;
    const monthLabels: { label: string; gridColumn: number }[] = [];
    let maxValue = max;

    if (variant === "matrix") {
      gridColumns = columns.length;
      rows.forEach((row, r) => {
        columns.forEach((column, c) => {
          const raw = values[r]?.[c];
          cells.push({
            key: `${r}:${c}`,
            row,
            column,
            value: typeof raw === "number" && Number.isFinite(raw) ? raw : null,
            gridRow: r + 2,
            gridColumn: c + 2,
          });
        });
      });
    } else {
      const byDay = new Map<number, number>();
      for (const d of data) {
        const day = parseDay(d.date);
        if (day === null || !Number.isFinite(d.value)) continue;
        byDay.set(day, (byDay.get(day) ?? 0) + d.value);
      }
      const days = [...byDay.keys()];
      const start = startDate ? parseDay(startDate) : days.length ? Math.min(...days) : null;
      const end = endDate ? parseDay(endDate) : days.length ? Math.max(...days) : null;
      if (start !== null && end !== null && end >= start) {
        const rowOf = (day: number) => (new Date(day * DAY_MS).getUTCDay() - weekStartsOn + 7) % 7;
        const gridStart = start - rowOf(start);
        gridColumns = Math.floor((end - gridStart) / 7) + 1;
        let lastLabelWeek = -Infinity;
        let lastMonth = -1;
        for (let day = start; day <= end; day++) {
          const week = Math.floor((day - gridStart) / 7);
          const month = new Date(day * DAY_MS).getUTCMonth();
          if (month !== lastMonth) {
            // Label the first week that contains a new month; skip if it would collide with the previous label.
            if (week - lastLabelWeek >= 3) {
              monthLabels.push({ label: `${month + 1}月`, gridColumn: week + 2 });
              lastLabelWeek = week;
            }
            lastMonth = month;
          }
          cells.push({
            key: formatDay(day),
            date: formatDay(day),
            value: byDay.get(day) ?? null,
            gridRow: rowOf(day) + 2,
            gridColumn: week + 2,
          });
        }
      }
    }

    if (maxValue === undefined) {
      maxValue = cells.reduce((acc, c) => (c.value !== null && c.value > acc ? c.value : acc), 0);
    }
    const scaleMax = maxValue;

    // Screen reader summary (exposed via aria-describedby): where the peak is and how high.
    const peak = cells.reduce<PlacedCell | null>(
      (acc, c) =>
        c.value !== null && c.value > 0 && (!acc || c.value > (acc.value ?? 0)) ? c : acc,
      null,
    );
    const summary =
      peak && peak.value !== null
        ? `最大値 ${formatValue(peak.value)}（${peak.date ?? `${peak.row} ${peak.column}`}）`
        : "データなし";

    const show = (cell: PlacedCell, el: HTMLElement) => {
      const root = rootRef.current;
      if (!root) return;
      const a = el.getBoundingClientRect();
      const b = root.getBoundingClientRect();
      const { row, column, date, value } = cell;
      setTip({
        x: a.left - b.left + a.width / 2,
        y: a.top - b.top,
        cell: { row, column, date, value },
      });
    };

    const tooltipBody = (cell: HeatmapCell) => {
      if (formatTooltip) return <div className="chart-tooltip__title">{formatTooltip(cell)}</div>;
      const title = cell.date ?? `${cell.row} ${cell.column}`;
      return (
        <>
          <div className="chart-tooltip__title">{title}</div>
          <div className="chart-tooltip__row">
            <span className="chart-tooltip__label">値</span>
            <span className="chart-tooltip__value">
              {cell.value === null ? "データなし" : formatValue(cell.value)}
            </span>
          </div>
        </>
      );
    };

    const rootStyle = {
      "--heatmap-color": color,
      "--heatmap-cell": `${cellSize}px`,
      "--heatmap-gap": `${gap}px`,
      ...style,
    } as CSSProperties;

    // Thin column labels when they would overlap (≈8px per character at font-size-xs, plus breathing room).
    const longestColumnLabel = columns.reduce((m, c) => Math.max(m, String(c).length), 0);
    const columnLabelStep = Math.max(1, Math.ceil((longestColumnLabel * 8 + 6) / (cellSize + gap)));
    const gridStyle = {
      gridTemplateColumns: `auto repeat(${gridColumns}, var(--heatmap-cell))`,
      gridTemplateRows: `auto repeat(${variant === "matrix" ? rows.length : 7}, var(--heatmap-cell))`,
    } as CSSProperties;

    return (
      <div
        ref={(node) => {
          rootRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        role="img"
        aria-label={ariaLabel}
        aria-describedby={joinIds(ariaDescribedBy, summaryId)}
        className={cn("chart", "heatmap", `heatmap--${variant}`, className)}
        style={rootStyle}
        {...rest}
      >
        {/* Children of role="img" are presentational, but aria-describedby still resolves this text. */}
        <span id={summaryId} className="sr-only">
          {summary}
        </span>
        <div className="heatmap__scroll">
          {/* biome-ignore lint/a11y/noStaticElementInteractions: pointer-only tooltip; the chart is exposed as role=img */}
          <div className="heatmap__grid" style={gridStyle} onMouseLeave={() => setTip(null)}>
            {variant === "matrix" ? (
              <>
                {columns.map((c, i) => (
                  <span
                    hidden={i % columnLabelStep !== 0}
                    // biome-ignore lint/suspicious/noArrayIndexKey: labels are positional (grid track index) and may repeat
                    key={`c${i}`}
                    className="heatmap__label heatmap__label--column"
                    style={{ gridRow: 1, gridColumn: i + 2 }}
                  >
                    {c}
                  </span>
                ))}
                {rows.map((r, i) => (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: labels are positional (grid track index) and may repeat
                    key={`r${i}`}
                    className="heatmap__label heatmap__label--row"
                    style={{ gridRow: i + 2, gridColumn: 1 }}
                  >
                    {r}
                  </span>
                ))}
              </>
            ) : (
              <>
                {monthLabels.map((m) => (
                  <span
                    key={m.gridColumn}
                    className="heatmap__label heatmap__label--month"
                    style={{ gridRow: 1, gridColumn: `${m.gridColumn} / span 3` }}
                  >
                    {m.label}
                  </span>
                ))}
                {Array.from({ length: 7 }, (_, row) => {
                  const dow = (row + weekStartsOn) % 7;
                  return LABELLED_WEEKDAYS.has(dow) ? (
                    <span
                      key={dow}
                      className="heatmap__label heatmap__label--row"
                      style={{ gridRow: row + 2, gridColumn: 1 }}
                    >
                      {WEEKDAY_LABELS[dow]}
                    </span>
                  ) : null;
                })}
              </>
            )}
            {cells.map((cell) => {
              const level = levelOf(cell.value, scaleMax, stepCount);
              const { key, gridRow, gridColumn } = cell;
              return (
                // biome-ignore lint/a11y/noStaticElementInteractions: pointer-only tooltip; the chart is exposed as role=img
                <span
                  key={key}
                  className={cn("heatmap__cell", level === 0 && "heatmap__cell--empty")}
                  data-level={level}
                  style={{ gridRow, gridColumn, background: levelColor(level, stepCount) }}
                  onMouseEnter={(e) => show(cell, e.currentTarget)}
                />
              );
            })}
          </div>
        </div>
        {showLegend && (
          <div className="heatmap__legend" aria-hidden="true">
            <span>少</span>
            {Array.from({ length: stepCount }, (_, i) => i + 1).map((level) => (
              <span
                key={level}
                className="heatmap__swatch"
                style={{ background: levelColor(level, stepCount) }}
              />
            ))}
            <span>多</span>
          </div>
        )}
        {tip && (
          <div
            className="chart-tooltip heatmap__tooltip"
            style={{ left: tip.x, top: tip.y }}
            aria-hidden="true"
          >
            {tooltipBody(tip.cell)}
          </div>
        )}
      </div>
    );
  },
);
Heatmap.displayName = "Heatmap";
