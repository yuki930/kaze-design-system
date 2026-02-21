import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type TrackerStatus = "positive" | "negative" | "warning" | "info" | "default";

export interface TrackerItem {
  /** Status determines the segment color */
  status: TrackerStatus;
  /** Optional tooltip text */
  tooltip?: string;
}

export interface TrackerProps extends HTMLAttributes<HTMLDivElement> {
  /** Array of status segments */
  data: TrackerItem[];
  /** Accessible label for the tracker (default: `${data.length} segments`) */
  label?: string;
}

export const Tracker = forwardRef<HTMLDivElement, TrackerProps>(
  ({ data, label, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("tracker", className)}
        role="img"
        aria-label={label ?? `${data.length} segments`}
        {...rest}
      >
        {data.map((item, i) => (
          <div
            key={i}
            className={cn("tracker__segment", `tracker__segment--${item.status}`)}
            title={item.tooltip}
          />
        ))}
      </div>
    );
  },
);

Tracker.displayName = "Tracker";
