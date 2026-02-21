import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* -- Hero ---------------------------------------------------------- */

export interface HeroProps extends HTMLAttributes<HTMLElement> {
  badge?: string;
  title: string;
  subtitle?: string;
  /** Background color — any CSS value, e.g. "var(--blue-500)" */
  bg?: string;
  /** Background image — URL or CSS gradient, e.g. "url(...)" or "linear-gradient(...)" */
  bgImage?: string;
  /** Dark overlay opacity (0–1). true = 0.5. Useful for readability on images. */
  overlay?: boolean | number;
}

export const Hero = forwardRef<HTMLElement, HeroProps>(
  (
    { badge, title, subtitle, bg, bgImage, overlay, className, children, style, ...rest },
    ref,
  ) => {
    const hasBg = !!(bg || bgImage);
    const overlayOpacity =
      overlay === true ? 0.5 : typeof overlay === "number" ? overlay : 0;

    const sectionStyle: CSSProperties = {
      ...style,
      ...(bg ? { background: bg } : {}),
      ...(bgImage
        ? {
            backgroundImage: bgImage.startsWith("url(") ? bgImage : `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }
        : {}),
    };

    return (
      <section
        ref={ref}
        className={cn("hero", hasBg && "hero--colored", className)}
        style={sectionStyle}
        {...rest}
      >
        {hasBg && overlayOpacity > 0 && (
          <div className="hero__overlay" style={{ opacity: overlayOpacity }} />
        )}
        <div className="hero__inner">
          {badge && <span className="hero__badge">{badge}</span>}
          <h1 className="hero__title">{title}</h1>
          {subtitle && <p className="hero__subtitle">{subtitle}</p>}
          {children && <div className="hero__actions">{children}</div>}
        </div>
      </section>
    );
  },
);

Hero.displayName = "Hero";
