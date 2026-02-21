"use client";

/* ── Kaze Design System — React Components ─────────────────── */

export { Button } from "./Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button";

export { FAB } from "./FAB";
export type { FABProps, FABVariant, FABSize, FABPosition } from "./FAB";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
} from "./Card";
export type {
  CardProps,
  CardVariant,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardBodyProps,
  CardFooterProps,
} from "./Card";

export { Badge } from "./Badge";
export type { BadgeProps, BadgeVariant } from "./Badge";

export { Input } from "./Input";
export type { InputProps } from "./Input";

export { Select } from "./Select";
export type { SelectProps } from "./Select";

export { Textarea } from "./Textarea";
export type { TextareaProps } from "./Textarea";

export { Checkbox } from "./Checkbox";
export type { CheckboxProps } from "./Checkbox";

export { Radio, RadioGroup } from "./Radio";
export type { RadioProps, RadioGroupProps } from "./Radio";

export { FormField } from "./FormField";
export type { FormFieldProps } from "./FormField";

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./Table";
export type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
} from "./Table";

export { Avatar } from "./Avatar";
export type { AvatarProps, AvatarSize } from "./Avatar";

export { TabGroup, Tabs, Tab, TabPanel } from "./Tabs";
export type { TabGroupProps, TabsProps, TabsVariant, TabProps, TabPanelProps } from "./Tabs";

export { Metric } from "./Metric";
export type { MetricProps, MetricChange } from "./Metric";

export { Search } from "./Search";
export type { SearchProps } from "./Search";

export {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "./Dialog";
export type {
  DialogProps,
  DialogHeaderProps,
  DialogTitleProps,
  DialogBodyProps,
  DialogFooterProps,
} from "./Dialog";

export { Divider } from "./Divider";
export type { DividerProps } from "./Divider";

export { Sidebar, NavItem } from "./Sidebar";
export type { SidebarProps, NavItemProps } from "./Sidebar";

export { TopBar } from "./TopBar";
export type { TopBarProps } from "./TopBar";

export { AppLayout } from "./Layout";
export type { AppLayoutProps } from "./Layout";

export { Logo } from "./Logo";
export type { LogoProps } from "./Logo";

export { ToastProvider, useToast } from "./Toast";
export type {
  ToastProviderProps,
  ToastVariant,
  ToastData,
  ToastOptions,
} from "./Toast";

export { Tooltip } from "./Tooltip";
export type { TooltipProps, TooltipSide } from "./Tooltip";

export {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
} from "./Dropdown";
export type {
  DropdownProps,
  DropdownTriggerProps,
  DropdownMenuProps,
  DropdownItemProps,
  DropdownSeparatorProps,
} from "./Dropdown";

export { CommandPalette } from "./CommandPalette";
export type { CommandPaletteProps, Command } from "./CommandPalette";

export { Icon } from "./Icon";
export type { IconProps, IconSize } from "./Icon";

/* ── Typography ────────────────────────────────────────────── */

export { Heading } from "./Heading";
export type { HeadingProps, HeadingLevel } from "./Heading";

export { Text } from "./Text";
export type {
  TextProps,
  TextVariant,
  TextSize,
  TextWeight,
  TextColor,
  TextAlign,
} from "./Text";

/* ── Layout ────────────────────────────────────────────────── */

export { Grid } from "./Grid";
export type { GridProps, GridColumns } from "./Grid";

/* ── Lists ─────────────────────────────────────────────────── */

export { List, ListItem } from "./List";
export type { ListProps, ListItemProps, ListMarker } from "./List";

export { DescriptionList, DescriptionItem } from "./DescriptionList";
export type { DescriptionListProps, DescriptionItemProps } from "./DescriptionList";

export { Timeline, TimelineItem } from "./Timeline";
export type { TimelineProps, TimelineItemProps, TimelineItemStatus } from "./Timeline";

/* ── Charts ────────────────────────────────────────────────── */

export { BarChart } from "./BarChart";
export type { BarChartProps, BarChartItem } from "./BarChart";

export { DonutChart } from "./DonutChart";
export type { DonutChartProps, DonutChartSegment } from "./DonutChart";

export { Sparkline } from "./Sparkline";
export type { SparklineProps } from "./Sparkline";

/* ── Feedback & UI ─────────────────────────────────────────── */

export { Alert } from "./Alert";
export type { AlertProps, AlertVariant } from "./Alert";

export { Progress } from "./Progress";
export type { ProgressProps, ProgressColor, ProgressSize } from "./Progress";

export { Switch } from "./Switch";
export type { SwitchProps } from "./Switch";

export { Skeleton } from "./Skeleton";
export type { SkeletonProps } from "./Skeleton";

export { EmptyState } from "./EmptyState";
export type { EmptyStateProps } from "./EmptyState";

/* ── Navigation ────────────────────────────────────────────── */

export { Breadcrumb } from "./Breadcrumb";
export type { BreadcrumbProps, BreadcrumbItem } from "./Breadcrumb";

export { Pagination } from "./Pagination";
export type { PaginationProps } from "./Pagination";

export { Stepper } from "./Stepper";
export type { StepperProps, StepperStep } from "./Stepper";

/* ── Landing Page Components ───────────────────────────────── */

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

/* ── New Components (inspired by design system research) ──── */

export { Watermark } from "./Watermark";
export type { WatermarkProps } from "./Watermark";

export { Meter } from "./Meter";
export type { MeterProps, MeterColor } from "./Meter";

export { Tracker } from "./Tracker";
export type { TrackerProps, TrackerItem, TrackerStatus } from "./Tracker";

export { BarList } from "./BarList";
export type { BarListProps, BarListItem } from "./BarList";

export { NumberField } from "./NumberField";
export type { NumberFieldProps, NumberFieldCurrency } from "./NumberField";

/* ── Theme ─────────────────────────────────────────────────── */

export { ThemeProvider, useTheme } from "../hooks/useTheme";
export type { Theme, ThemeContextValue, ThemeProviderProps } from "../hooks/useTheme";
