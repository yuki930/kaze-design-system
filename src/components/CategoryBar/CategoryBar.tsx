import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface CategoryBarItem {
  label: string;
  value: number;
  /** Any CSS color. Defaults to the `--chart-*` palette by index */
  color?: string;
}

export interface CategoryBarMarker {
  /** Position expressed in the same unit as `data` values (relative to the total) */
  value: number;
  label?: string;
}

export interface CategoryBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Segments, drawn in order. Non-positive values are ignored */
  data: CategoryBarItem[];
  /** Marker such as a target line, positioned against the total */
  marker?: CategoryBarMarker;
  /** Show the legend (label + value / %) below the bar */
  showLabels?: boolean;
  /** Include the percentage in the legend */
  showPercent?: boolean;
  /** Bar thickness in px */
  height?: number;
  /** Value formatter for legend, title and screen reader text */
  formatValue?: (value: number) => string;
  "aria-label": string;
}

const PALETTE_SIZE = 8;
const defaultFormat = (v: number) => v.toLocaleString("ja-JP");
const formatPercent = (ratio: number) => `${Math.round(ratio * 1000) / 10}%`;

export const CategoryBar = forwardRef<HTMLDivElement, CategoryBarProps>(
  (
    {
      data,
      marker,
      showLabels = true,
      showPercent = false,
      height = 8,
      formatValue = defaultFormat,
      className,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) => {
    const items = data.map((d, i) => ({
      ...d,
      value: Math.max(0, Number.isFinite(d.value) ? d.value : 0),
      color: d.color ?? `var(--chart-${(i % PALETTE_SIZE) + 1})`,
    }));
    const total = items.reduce((sum, d) => sum + d.value, 0);
    const ratioOf = (v: number) => (total > 0 ? v / total : 0);
    const markerPos = marker && total > 0 ? Math.min(1, Math.max(0, ratioOf(marker.value))) : null;

    const describe = (d: { label: string; value: number }) =>
      `${d.label} ${formatValue(d.value)}${showPercent ? ` (${formatPercent(ratioOf(d.value))})` : ""}`;

    return (
      <div
        ref={ref}
        role="img"
        aria-label={ariaLabel}
        className={cn("category-bar", className)}
        {...rest}
      >
        <span className="sr-only">
          {items.map(describe).join("、")}
          {marker ? `。${marker.label ?? "目標"} ${formatValue(marker.value)}` : ""}
        </span>
        <div className="category-bar__track" style={{ height }} aria-hidden="true">
          {items.map(
            (d) =>
              d.value > 0 && (
                <div
                  key={d.label}
                  className="category-bar__segment"
                  style={{ flexGrow: d.value, background: d.color }}
                  title={describe(d)}
                />
              ),
          )}
          {markerPos !== null && marker && (
            <div
              className="category-bar__marker"
              style={{ left: `${markerPos * 100}%`, height: height + 8 }}
              title={`${marker.label ?? "目標"} ${formatValue(marker.value)}`}
            />
          )}
        </div>
        {showLabels && (
          <ul className="category-bar__legend" aria-hidden="true">
            {items.map((d) => (
              <li key={d.label} className="category-bar__legend-item">
                <span className="category-bar__swatch" style={{ background: d.color }} />
                <span className="category-bar__label">{d.label}</span>
                <span className="category-bar__value">
                  {formatValue(d.value)}
                  {showPercent && (
                    <span className="category-bar__percent">
                      {" "}
                      {formatPercent(ratioOf(d.value))}
                    </span>
                  )}
                </span>
              </li>
            ))}
            {marker?.label && (
              <li className="category-bar__legend-item">
                <span className="category-bar__swatch category-bar__swatch--marker" />
                <span className="category-bar__label">{marker.label}</span>
                <span className="category-bar__value">{formatValue(marker.value)}</span>
              </li>
            )}
          </ul>
        )}
      </div>
    );
  },
);

CategoryBar.displayName = "CategoryBar";
