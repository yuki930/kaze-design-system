import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Badge } from "../Badge";

export interface DataStatusProps extends HTMLAttributes<HTMLDivElement> {
  /** Explicit status supplied by the application; no freshness is inferred. */
  status: "available" | "partial" | "stale" | "missing";
  /** Already formatted timestamps, including timezone when relevant. */
  fetchedAt?: ReactNode;
  asOf?: ReactNode;
  /** Explain the missing scope or next action. */
  children?: ReactNode;
}
const labels = {
  available: "取得済み",
  partial: "一部未取得",
  stale: "更新が必要",
  missing: "未取得",
} as const;
export const DataStatus = forwardRef<HTMLDivElement, DataStatusProps>(
  ({ status, fetchedAt, asOf, children, className, ...rest }, ref) => (
    <div ref={ref} className={cn("data-status", className)} {...rest}>
      <Badge tone={status === "available" ? "default" : "warning"}>{labels[status]}</Badge>
      <dl className="data-status__dates">
        {fetchedAt != null && (
          <div>
            <dt>取得日時</dt>
            <dd>{fetchedAt}</dd>
          </div>
        )}
        {asOf != null && (
          <div>
            <dt>データ基準</dt>
            <dd>{asOf}</dd>
          </div>
        )}
      </dl>
      {children && <div className="data-status__description">{children}</div>}
    </div>
  ),
);
DataStatus.displayName = "DataStatus";
