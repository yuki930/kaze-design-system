"use client";

/* ── Kaze Design System — Marketing Layer ──────────────────────
   LP・キャンペーンページ向けコンポーネントのサブパスエントリ。
   `import { Hero } from "kaze-design-system/marketing"` で利用する。
   ルートバレル（"kaze-design-system"）からの export も維持しており、
   どちらの import でも同じ実体を参照する（非破壊）。
   セット構成は docs の Marketing カタログと一致させること。
   ------------------------------------------------------------- */

export { Navbar, NavbarLinks, NavbarLink } from "./Navbar";
export type { NavbarProps, NavbarLinksProps, NavbarLinkProps } from "./Navbar";

export { Hero } from "./Hero";
export type { HeroProps } from "./Hero";

export { Section, SectionHeader } from "./Section";
export type { SectionProps, SectionHeaderProps, SectionSize, SectionBackground } from "./Section";

export { SplitSection } from "./SplitSection";
export type { SplitSectionProps } from "./SplitSection";

export { FeatureGrid, FeatureCard } from "./FeatureGrid";
export type { FeatureGridProps, FeatureCardProps, FeatureGridColumns } from "./FeatureGrid";

export { Stats, StatItem } from "./Stats";
export type { StatsProps, StatItemProps } from "./Stats";

export { PricingGrid, PricingCard } from "./Pricing";
export type { PricingGridProps, PricingCardProps } from "./Pricing";

export { TestimonialGrid, TestimonialCard } from "./Testimonial";
export type { TestimonialGridProps, TestimonialCardProps } from "./Testimonial";

export { FAQ, FAQItem } from "./FAQ";
export type { FAQProps, FAQItemProps } from "./FAQ";

export { CTABanner } from "./CTABanner";
export type { CTABannerProps } from "./CTABanner";

export { LPFooter } from "./LPFooter";
export type { LPFooterProps, FooterColumn } from "./LPFooter";
