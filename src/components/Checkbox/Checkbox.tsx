import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, id: idProp, ...rest }, ref) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;

    return (
      <label htmlFor={id} className={cn("checkbox", className)}>
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className="checkbox__input"
          {...rest}
        />
        {label && <span>{label}</span>}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
