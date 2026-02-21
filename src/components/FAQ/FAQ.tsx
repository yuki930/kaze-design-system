"use client";

import {
  forwardRef,
  useState,
  type HTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

/* ── FAQ ──────────────────────────────────────────────────── */

export interface FAQProps extends HTMLAttributes<HTMLDivElement> {}

export const FAQ = forwardRef<HTMLDivElement, FAQProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn("faq", className)} {...rest}>
        {children}
      </div>
    );
  },
);

FAQ.displayName = "FAQ";

/* ── FAQItem ──────────────────────────────────────────────── */

export interface FAQItemProps extends HTMLAttributes<HTMLDivElement> {
  question: string;
  answer?: string;
}

export const FAQItem = forwardRef<HTMLDivElement, FAQItemProps>(
  ({ question, answer, className, children, ...rest }, ref) => {
    const [open, setOpen] = useState(false);

    return (
      <div
        ref={ref}
        className={cn("faq__item", open && "faq__item--open", className)}
        {...rest}
      >
        <button
          type="button"
          className="faq__trigger"
          aria-expanded={open}
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
        <div className="faq__answer">
          <div className="faq__answer-inner">
            {answer ?? children}
          </div>
        </div>
      </div>
    );
  },
);

FAQItem.displayName = "FAQItem";
