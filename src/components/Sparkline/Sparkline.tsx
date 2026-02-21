import { forwardRef, type SVGAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SparklineProps extends Omit<SVGAttributes<SVGSVGElement>, "children"> {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showArea?: boolean;
}

export const Sparkline = forwardRef<SVGSVGElement, SparklineProps>(
  (
    {
      data,
      width = 80,
      height = 24,
      color = "var(--chart-emerald)",
      showArea = false,
      className,
      ...rest
    },
    ref,
  ) => {
    if (data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 1;

    const points = data.map((value, i) => {
      const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    });

    const linePath = `M${points.join("L")}`;
    const areaPath = `${linePath}L${width - padding},${height - padding}L${padding},${height - padding}Z`;

    return (
      <svg
        ref={ref}
        className={cn("sparkline", className)}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
        {...rest}
      >
        {showArea && (
          <path className="sparkline__area" d={areaPath} fill={color} />
        )}
        <path className="sparkline__line" d={linePath} stroke={color} />
      </svg>
    );
  },
);
Sparkline.displayName = "Sparkline";
