import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import type { Tone } from "../../lib/types";
import { cn } from "@/lib/utils";

/**
 * 読み上げの強さ。
 * - "assertive": role="alert"。表示された瞬間に割り込んで読み上げる（操作の結果出るエラー）
 * - "polite": role="status"。読み上げ中の内容が終わってから伝える（操作の結果出る注意や完了）
 * - "off": role を付けない。ページを開いた時点から置いてある注記
 */
export type AlertLive = "assertive" | "polite" | "off";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  icon?: ReactNode;
  title?: string;
  /**
   * 読み上げの強さ。既定は tone="negative" なら "assertive"、それ以外は "off"。
   * 操作のあとで出す注意や完了の報告には "polite" を渡す
   */
  live?: AlertLive;
  children: ReactNode;
}

const liveRole: Record<AlertLive, "alert" | "status" | undefined> = {
  assertive: "alert",
  polite: "status",
  off: undefined,
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ tone = "info", icon, title, live, className, children, ...rest }, ref) => {
    const resolvedLive = live ?? (tone === "negative" ? "assertive" : "off");
    return (
      <div
        ref={ref}
        role={liveRole[resolvedLive]}
        data-tone={tone}
        className={cn("alert", `alert--${tone}`, className)}
        {...rest}
      >
        {icon && <span className="alert__icon">{icon}</span>}
        <div className="alert__content">
          {title && <p className="alert__title">{title}</p>}
          <div className="alert__description">{children}</div>
        </div>
      </div>
    );
  },
);

Alert.displayName = "Alert";
