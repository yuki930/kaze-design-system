import {
  Children,
  createContext,
  forwardRef,
  useContext,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/* -- FeatureGrid --------------------------------------------------- */

export type FeatureGridColumns = 2 | 3 | 4;
export type FeatureGridVariant = "grid" | "spotlight";

type SpotlightSlot = "lead" | "minor";

// FeatureCard reads its slot from here so the grid, not each card, decides who is the lead.
const SpotlightSlotContext = createContext<SpotlightSlot | null>(null);

export interface FeatureGridProps extends HTMLAttributes<HTMLDivElement> {
  /** `grid` のときの列数 */
  columns?: FeatureGridColumns;
  /**
   * `grid`: 同じ重みのカードを均等に並べる。
   * `spotlight`: 最初の子を主役（左の列）、残りを脇（右の列）に並べる。columns は使わない
   */
  variant?: FeatureGridVariant;
}

export const FeatureGrid = forwardRef<HTMLDivElement, FeatureGridProps>(
  ({ columns = 3, variant = "grid", className, children, ...rest }, ref) => {
    if (variant === "spotlight") {
      const [lead, ...minor] = Children.toArray(children);
      return (
        <div
          ref={ref}
          className={cn("feature-grid", "feature-grid--spotlight", className)}
          {...rest}
        >
          <SpotlightSlotContext.Provider value="lead">{lead}</SpotlightSlotContext.Provider>
          {minor.length > 0 && (
            <div className="feature-grid__minor">
              <SpotlightSlotContext.Provider value="minor">{minor}</SpotlightSlotContext.Provider>
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("feature-grid", columns !== 3 && `feature-grid--cols-${columns}`, className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

FeatureGrid.displayName = "FeatureGrid";

/* -- FeatureCard --------------------------------------------------- */

export interface FeatureCardProps extends HTMLAttributes<HTMLDivElement> {
  /** `spotlight` の中では描かれない */
  icon?: ReactNode;
  /** タイトルの上に大きく置く数字と単位。例: `<>23<small>KB</small></>` */
  figure?: ReactNode;
  title: string;
  description: string;
  /** description の下に置く補足（コード片など） */
  children?: ReactNode;
}

export const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ icon, figure, title, description, className, children, ...rest }, ref) => {
    const slot = useContext(SpotlightSlotContext);
    return (
      <div
        ref={ref}
        className={cn("feature-card", slot && `feature-card--${slot}`, className)}
        {...rest}
      >
        {icon && !slot && <div className="feature-card__icon">{icon}</div>}
        {figure && <div className="feature-card__figure">{figure}</div>}
        <h3 className="feature-card__title">{title}</h3>
        <p className="feature-card__description">{description}</p>
        {children && <div className="feature-card__extra">{children}</div>}
      </div>
    );
  },
);

FeatureCard.displayName = "FeatureCard";
