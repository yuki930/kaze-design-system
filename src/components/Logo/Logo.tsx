import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ── Wind Mark SVG ────────────────────────────────────────── */

function WindMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Three wind strokes — varying lengths for visual rhythm */}
      <path
        d="M6 10 C10 7, 17 7, 23 10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M5 16.5 C10 13, 20 13, 27 16.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M6 23 C9 20.5, 13 20.5, 17 23"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Logo ─────────────────────────────────────────────────── */

export interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ size = "md", showText = true, className, ...rest }, ref) => {
    const iconSize = size === "sm" ? 18 : size === "lg" ? 32 : 22;

    return (
      <div ref={ref} className={cn("logo", className)} {...rest}>
        <div
          className={cn(
            "logo__mark",
            `logo__mark--${size}`,
          )}
        >
          <WindMark size={iconSize} />
        </div>
        {showText && (
          <span className={cn("logo__text", size === "lg" && "logo__text--lg")}>
            kaze
            <span className="logo__kanji">風</span>
          </span>
        )}
      </div>
    );
  },
);

Logo.displayName = "Logo";
