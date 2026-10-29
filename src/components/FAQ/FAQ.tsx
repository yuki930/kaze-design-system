"use client";

import { forwardRef, useId, useState, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ── FAQ ──────────────────────────────────────────────────── */

export interface FAQProps extends HTMLAttributes<HTMLDivElement> {}

export const FAQ = forwardRef<HTMLDivElement, FAQProps>(({ className, children, ...rest }, ref) => {
  return (
    <div ref={ref} className={cn("faq", className)} {...rest}>
      {children}
    </div>
  );
});

FAQ.displayName = "FAQ";

/* ── FAQItem ──────────────────────────────────────────────── */

export type FAQHeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface FAQItemProps extends HTMLAttributes<HTMLDivElement> {
  question: string;
  answer?: string;
  /** Heading level that wraps the question button (default: 3) */
  headingLevel?: FAQHeadingLevel;
}

export const FAQItem = forwardRef<HTMLDivElement, FAQItemProps>(
  ({ question, answer, headingLevel = 3, className, children, ...rest }, ref) => {
    const [open, setOpen] = useState(false);
    const baseId = useId();
    const triggerId = `${baseId}-trigger`;
    const answerId = `${baseId}-answer`;
    const Heading = `h${headingLevel}` as const;

    return (
      <div ref={ref} className={cn("faq__item", open && "faq__item--open", className)} {...rest}>
        <Heading className="faq__heading">
          <button
            id={triggerId}
            type="button"
            className="faq__trigger"
            aria-expanded={open}
            aria-controls={answerId}
            onClick={() => setOpen((prev) => !prev)}
          >
            {question}
            <svg
              className="faq__chevron"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </Heading>
        {/* The panel stays in the DOM so the grid-rows animation can run; while closed it is
            inert (unfocusable, out of the a11y tree) and aria-hidden for browsers without inert. */}
        <div id={answerId} className="faq__answer" inert={!open} aria-hidden={!open}>
          <div className="faq__answer-inner">{answer ?? children}</div>
        </div>
      </div>
    );
  },
);

FAQItem.displayName = "FAQItem";
