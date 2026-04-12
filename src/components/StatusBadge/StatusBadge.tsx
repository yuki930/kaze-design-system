import { forwardRef } from "react";
import { Badge, type BadgeProps } from "../Badge";

export type StatusBadgeStatus =
  | "live"
  | "stale"
  | "missing"
  | "manual"
  | "loading";

export interface StatusBadgeProps
  extends Omit<BadgeProps, "variant" | "children"> {
  status: StatusBadgeStatus;
  /** Overrides the default label for the given status */
  label?: string;
}

const STATUS_CONFIG: Record<
  StatusBadgeStatus,
  { variant: BadgeProps["variant"]; label: string }
> = {
  live: { variant: "positive", label: "自動更新" },
  stale: { variant: "warning", label: "要更新" },
  missing: { variant: "negative", label: "欠損" },
  manual: { variant: "default", label: "手動" },
  loading: { variant: "info", label: "取得中" },
};

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, label, dot = true, live, ...rest }, ref) => {
    const config = STATUS_CONFIG[status];
    const isLive = live ?? (status === "live" || status === "loading");
    return (
      <Badge
        ref={ref}
        variant={config.variant}
        dot={dot}
        live={isLive}
        {...rest}
      >
        {label ?? config.label}
      </Badge>
    );
  },
);

StatusBadge.displayName = "StatusBadge";
