import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface WatermarkProps extends HTMLAttributes<HTMLDivElement> {
  /** Watermark text (e.g. "社外秘", "CONFIDENTIAL") */
  text: string;
  /** Font size in px */
  fontSize?: number;
  /** Rotation angle in degrees */
  rotate?: number;
  /** Gap between watermark instances in px */
  gap?: number;
  /** Watermark text color */
  color?: string;
  /** Watermark text opacity */
  opacity?: number;
  children?: ReactNode;
}

export const Watermark = forwardRef<HTMLDivElement, WatermarkProps>(
  (
    {
      text,
      fontSize = 16,
      rotate = -22,
      gap = 100,
      color = "var(--color-fg)",
      opacity = 0.08,
      children,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn("watermark", className)}
        style={{ position: "relative", ...style }}
        {...rest}
      >
        {children}
        <div
          className="watermark__overlay"
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <div
            className="watermark__pattern"
            style={{
              position: "absolute",
              inset: `-${gap}px`,
              display: "flex",
              flexWrap: "wrap",
              gap: `${gap}px`,
              justifyContent: "center",
              alignContent: "center",
              transform: `rotate(${rotate}deg)`,
            }}
          >
            {Array.from({ length: 200 }).map((_, i) => (
              <span
                key={i}
                style={{
                  fontSize: `${fontSize}px`,
                  fontWeight: 600,
                  color,
                  opacity,
                  whiteSpace: "nowrap",
                  userSelect: "none",
                  letterSpacing: "0.1em",
                }}
              >
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  },
);

Watermark.displayName = "Watermark";
