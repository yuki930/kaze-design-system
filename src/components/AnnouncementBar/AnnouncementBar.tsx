import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface AnnouncementBarProps extends HTMLAttributes<HTMLElement> {
  /** お知らせの文。1 行に収まる長さにする */
  children: ReactNode;
  /** 続きへの導線。Kaze の `Link` を渡す */
  action?: ReactNode;
  /** ランドマークの名前 */
  label?: string;
}

export const AnnouncementBar = forwardRef<HTMLElement, AnnouncementBarProps>(
  ({ children, action, label = "お知らせ", className, ...rest }, ref) => {
    return (
      <aside ref={ref} aria-label={label} className={cn("announcement-bar", className)} {...rest}>
        <span className="announcement-bar__text">{children}</span>
        {action}
      </aside>
    );
  },
);

AnnouncementBar.displayName = "AnnouncementBar";
