import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import type { Tone } from "../../lib/types";
import { cn } from "@/lib/utils";

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
  tone?: Tone;
}

export const TimelineItem = forwardRef<HTMLLIElement, TimelineItemProps>(
  ({ time, title, description, tone = "default", className, ...rest }, ref) => {
    return (
      <li ref={ref} data-tone={tone} className={cn("timeline-item", className)} {...rest}>
        <span
          aria-hidden="true"
          className={cn("timeline-item__dot", tone !== "default" && `timeline-item__dot--${tone}`)}
        />
        {time && <span className="timeline-item__time">{time}</span>}
        <span className="timeline-item__title">{title}</span>
        {description && <span className="timeline-item__description">{description}</span>}
      </li>
    );
  },
);
TimelineItem.displayName = "TimelineItem";
