import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, className, id, ...rest }, ref) => {
    const autoId = useId();
    const switchId = id ?? autoId;
    return (
      <label className={cn("switch", className)} htmlFor={switchId}>
        <input
          ref={ref}
          type="checkbox"
          // biome-ignore lint/a11y/useAriaPropsForRole: a native checkbox with role="switch" exposes its checked state automatically; a manual aria-checked would go stale for uncontrolled usage.
          role="switch"
          id={switchId}
          className="switch__input"
          {...rest}
        />
        <span className="switch__track">
          <span className="switch__thumb" />
        </span>
        {label && <span className="switch__label">{label}</span>}
      </label>
    );
  },
);

Switch.displayName = "Switch";
