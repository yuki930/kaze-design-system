import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/chartColors";

export interface DonutChartSegment {
  label: string;
  value: number;
  color?: string;
}

export interface DonutChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "aria-label"> {
  data: DonutChartSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  showLegend?: boolean;
  /** Accessible label for the chart (required for accessibility) */
  "aria-label": string;
}

export const DonutChart = forwardRef<HTMLDivElement, DonutChartProps>(
  (
    {
      data,
      size = 120,
      strokeWidth = 16,
      centerLabel,
      showLegend = true,
      "aria-label": ariaLabel,
      className,
      ...rest
    },
    ref,
  ) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    let offset = 0;
    const segments = data.map((d, i) => {
      const pct = total > 0 ? d.value / total : 0;
      const dashLength = circumference * pct;
      const dashOffset = -offset;
      offset += dashLength;
      return {
        ...d,
        color: d.color ?? CHART_COLORS[i % CHART_COLORS.length],
        dashLength,
        dashOffset,
      };
    });

    return (
      <div ref={ref} role="img" aria-label={ariaLabel} className={cn("donut-chart", className)} {...rest}>
        <svg
          className="donut-chart__svg"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
        >
          <circle
            className="donut-chart__track"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {segments.map((seg) => (
            <circle
              key={seg.label}
              className="donut-chart__segment"
              cx={center}
              cy={center}
              r={radius}
              strokeWidth={strokeWidth}
              stroke={seg.color}
              strokeDasharray={`${seg.dashLength} ${circumference - seg.dashLength}`}
              strokeDashoffset={seg.dashOffset}
            />
          ))}
          {centerLabel && (
            <text className="donut-chart__center-label" x={center} y={center}>
              {centerLabel}
            </text>
          )}
        </svg>
        {showLegend && (
          <div className="donut-chart__legend">
            {segments.map((seg) => (
              <span key={seg.label} className="donut-chart__legend-item">
                <span
                  className="donut-chart__legend-dot"
                  style={{ background: seg.color }}
                />
                <span className="donut-chart__legend-label">{seg.label}</span>
                <span className="donut-chart__legend-value">{seg.value}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    );
  },
);
DonutChart.displayName = "DonutChart";
