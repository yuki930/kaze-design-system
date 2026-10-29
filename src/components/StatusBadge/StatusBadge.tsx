import { forwardRef } from "react";
import { Badge, type BadgeProps } from "../Badge";

export type StatusBadgeStatus = "live" | "stale" | "missing" | "manual" | "loading";

export interface StatusBadgeProps extends Omit<BadgeProps, "tone" | "children"> {
  status: StatusBadgeStatus;
  /** Overrides the default label for the given status */
  label?: string;
}

const STATUS_CONFIG: Record<StatusBadgeStatus, { tone: BadgeProps["tone"]; label: string }> = {
  live: { tone: "positive", label: "自動更新" },
  stale: { tone: "warning", label: "要更新" },
  missing: { tone: "negative", label: "欠損" },
  manual: { tone: "default", label: "手動" },
  loading: { tone: "info", label: "取得中" },
};

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, label, dot = true, live, ...rest }, ref) => {
    const config = STATUS_CONFIG[status];
    const isLive = live ?? (status === "live" || status === "loading");
    return (
      <Badge ref={ref} tone={config.tone} dot={dot} live={isLive} {...rest}>
        {label ?? config.label}
      </Badge>
    );
  },
);

StatusBadge.displayName = "StatusBadge";
