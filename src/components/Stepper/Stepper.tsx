import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const CheckIcon = () => (
  <svg
    aria-hidden="true"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export interface StepperStep {
  label: string;
}

export interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  steps: StepperStep[];
  /** 現在のステップ（0 始まり） */
  step?: number;
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  ({ steps, step: currentStep = 0, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn("stepper", className)} {...rest}>
        <ol className="stepper__list">
          {steps.map((step, i) => {
            const isCompleted = i < currentStep;
            const isActive = i === currentStep;
            return (
              <li
                // biome-ignore lint/suspicious/noArrayIndexKey: steps are ordinal (the index is rendered as the step number) and labels are not guaranteed unique.
                key={i}
                className="stepper__item"
                aria-current={isActive ? "step" : undefined}
              >
                <div className={cn("stepper__step", isActive && "stepper__step--active")}>
                  <span
                    className={cn(
                      "stepper__circle",
                      isActive && "stepper__circle--active",
                      isCompleted && "stepper__circle--completed",
                    )}
                  >
                    {isCompleted ? (
                      <>
                        <CheckIcon />
                        <span className="sr-only">完了</span>
                      </>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className="stepper__label">{step.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <span
                    className={cn(
                      "stepper__connector",
                      isCompleted && "stepper__connector--completed",
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    );
  },
);

Stepper.displayName = "Stepper";
