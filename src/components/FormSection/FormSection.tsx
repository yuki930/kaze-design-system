import { forwardRef, type FieldsetHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface FormSectionProps
  extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "title"> {
  /** Name of the group; rendered as the fieldset legend so screen readers announce it with each field */
  title: ReactNode;
  description?: ReactNode;
}

/** A titled group of related fields inside a longer form. */
export const FormSection = forwardRef<HTMLFieldSetElement, FormSectionProps>(
  ({ title, description, className, children, ...rest }, ref) => (
    <fieldset ref={ref} className={cn("form-section", className)} {...rest}>
      <legend className="form-section__title">{title}</legend>
      {description && <p className="form-section__description">{description}</p>}
      <div className="form-section__body">{children}</div>
    </fieldset>
  ),
);
FormSection.displayName = "FormSection";
