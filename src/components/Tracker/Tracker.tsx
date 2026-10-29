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
  /** Accessible label for the tracker (default: `${data.length}区間`) */
  label?: string;
}

/** Spoken status for each segment (the color is the only visual cue). */
const STATUS_LABELS: Record<TrackerStatus, string> = {
  positive: "正常",
  negative: "異常",
  warning: "警告",
  info: "情報",
  default: "データなし",
};

function segmentText(item: TrackerItem): string {
  const status = STATUS_LABELS[item.status];
  if (!item.tooltip || item.tooltip === status) return status;
  return `${item.tooltip}（${status}）`;
}

export const Tracker = forwardRef<HTMLDivElement, TrackerProps>(
  ({ data, label, className, ...rest }, ref) => {
    return (
      // biome-ignore lint/a11y/useSemanticElements: the forwarded ref and props are typed as HTMLDivElement (public API); switching to <figure> would change the exported types.
      <div
        ref={ref}
        className={cn("tracker", className)}
        role="figure"
        aria-label={label ?? `${data.length}区間`}
        {...rest}
      >
        <ol className="tracker__list">
          {data.map((item, i) => (
            <li
              // biome-ignore lint/suspicious/noArrayIndexKey: segments are positional time slots without their own id; the position is the identity and the list is never reordered.
              key={i}
              className={cn("tracker__segment", `tracker__segment--${item.status}`)}
              title={item.tooltip}
            >
              {/* title is pointer-only, so the same text is exposed to screen readers here. */}
              <span className="sr-only">{segmentText(item)}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  },
);

Tracker.displayName = "Tracker";
