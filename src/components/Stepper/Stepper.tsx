import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const CheckIcon = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export interface StepperStep {
  label: string;
}

export interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  steps: StepperStep[];
  currentStep: number;
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  ({ steps, currentStep, className, ...rest }, ref) => (
    <div ref={ref} className={cn("stepper", className)} {...rest}>
      {steps.map((step, i) => {
        const isCompleted = i < currentStep;
        const isActive = i === currentStep;
        return (
          <div key={i} style={{ display: "contents" }}>
            <div
              className={cn(
                "stepper__step",
                isActive && "stepper__step--active",
              )}
            >
              <span
                className={cn(
                  "stepper__circle",
                  isActive && "stepper__circle--active",
                  isCompleted && "stepper__circle--completed",
                )}
              >
                {isCompleted ? <CheckIcon /> : i + 1}
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
          </div>
        );
      })}
    </div>
  ),
);

Stepper.displayName = "Stepper";
