import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface AppLayoutProps extends HTMLAttributes<HTMLDivElement> {
  sidebar?: ReactNode;
  topbar?: ReactNode;
  children: ReactNode;
}

export const AppLayout = forwardRef<HTMLDivElement, AppLayoutProps>(
  ({ sidebar, topbar, children, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn("app-layout", className)} {...rest}>
        {sidebar}
        <div className="app-layout__main">
          {topbar}
          <main className="app-layout__content">{children}</main>
        </div>
      </div>
    );
  },
);

AppLayout.displayName = "AppLayout";
