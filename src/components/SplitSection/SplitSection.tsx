import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SplitSectionProps extends HTMLAttributes<HTMLElement> {
  /** Media slot (image placeholder, gradient, etc.) */
  media?: ReactNode;
  /** Background for the media area (CSS gradient or color) */
  mediaBg?: string;
  /** Reverse layout: text left, image right */
  reverse?: boolean;
}

export const SplitSection = forwardRef<HTMLElement, SplitSectionProps>(
  ({ media, mediaBg, reverse, className, children, ...rest }, ref) => {
    const mediaStyle: CSSProperties | undefined = mediaBg
      ? { background: mediaBg }
      : undefined;

    const mediaSlot = (
      <div className="split-section__media" style={mediaStyle}>
        {media}
      </div>
    );

    const bodySlot = <div className="split-section__body">{children}</div>;

    return (
      <section
        ref={ref}
        className={cn(
          "split-section",
          reverse && "split-section--reverse",
          className,
        )}
        {...rest}
      >
        {mediaSlot}
        {bodySlot}
      </section>
    );
  },
);

SplitSection.displayName = "SplitSection";
