import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { renamedProp } from "@/lib/deprecate";
import type { Tone } from "../../lib/types";
import { cn } from "@/lib/utils";

/** @deprecated `Tone` を使う */
export type AlertVariant = Tone;

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  /** @deprecated `tone` に改名。次のマイナーで削除 */
  variant?: Tone;
  icon?: ReactNode;
  title?: string;
  children: ReactNode;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ tone: toneProp, variant, icon, title, className, children, ...rest }, ref) => {
    const tone = renamedProp("Alert", "variant", "tone", variant, toneProp) ?? "info";
    return (
      <div
        ref={ref}
        role="alert"
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
