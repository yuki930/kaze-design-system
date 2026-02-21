import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type TimelineItemStatus =
  | "default"
  | "positive"
  | "negative"
  | "info"
  | "warning";

export interface TimelineProps extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode;
}

export const Timeline = forwardRef<HTMLUListElement, TimelineProps>(
  ({ className, children, ...rest }, ref) => (
    <ul ref={ref} className={cn("timeline", className)} {...rest}>
      {children}
    </ul>
  ),
);
Timeline.displayName = "Timeline";

export interface TimelineItemProps extends Omit<HTMLAttributes<HTMLLIElement>, "title"> {
  time?: string;
  title: ReactNode;
  description?: ReactNode;
  status?: TimelineItemStatus;
}

export const TimelineItem = forwardRef<HTMLLIElement, TimelineItemProps>(
  ({ time, title, description, status = "default", className, ...rest }, ref) => (
    <li ref={ref} className={cn("timeline-item", className)} {...rest}>
      <span
        className={cn(
          "timeline-item__dot",
          status !== "default" && `timeline-item__dot--${status}`,
        )}
      />
      {time && <span className="timeline-item__time">{time}</span>}
      <span className="timeline-item__title">{title}</span>
      {description && (
        <span className="timeline-item__description">{description}</span>
      )}
    </li>
  ),
);
TimelineItem.displayName = "TimelineItem";
