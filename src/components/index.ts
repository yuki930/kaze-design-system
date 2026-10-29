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
export type { BadgeProps } from "./Badge";

export { StatusBadge } from "./StatusBadge";
export type { StatusBadgeProps, StatusBadgeStatus } from "./StatusBadge";

export { HelpButton } from "./HelpButton";
export type {
  HelpButtonProps,
  HelpButtonPosition,
  HelpButtonSize,
} from "./HelpButton";

export { Disclosure } from "./Disclosure";
export type {
  DisclosureProps,
  DisclosureIcon,
  DisclosureIconPosition,
  DisclosureSize,
  DisclosureVariant,
} from "./Disclosure";

export { FilterPill } from "./FilterPill";
export type { FilterPillProps } from "./FilterPill";

export { SegmentedControl } from "./SegmentedControl";
export type { SegmentedControlProps, SegmentedControlOption } from "./SegmentedControl";

export { Input } from "./Input";
export type { InputProps } from "./Input";

export { Combobox, defaultComboboxFilter } from "./Combobox";
export type { ComboboxProps, ComboboxOption, ComboboxSize } from "./Combobox";

export { DatePicker } from "./DatePicker";
export type { DatePickerProps, DatePickerEra, DatePickerSize } from "./DatePicker";

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

export { Popover, PopoverTrigger, PopoverContent, PopoverClose } from "./Popover";
export type {
  PopoverProps,
  PopoverTriggerProps,
  PopoverContentProps,
  PopoverCloseProps,
  PopoverSide,
  PopoverAlign,
} from "./Popover";

export { Drawer, DrawerHeader, DrawerTitle, DrawerBody, DrawerFooter } from "./Drawer";
export type {
  DrawerProps,
  DrawerHeaderProps,
  DrawerTitleProps,
  DrawerBodyProps,
  DrawerFooterProps,
  DrawerSide,
  DrawerSize,
} from "./Drawer";

export { Divider } from "./Divider";
export type { DividerProps } from "./Divider";

export { Sidebar, NavItem, SidebarGroupLabel, SidebarDivider } from "./Sidebar";
export type {
  SidebarProps,
  NavItemProps,
  SidebarGroupLabelProps,
  SidebarDividerProps,
} from "./Sidebar";

export { TopBar } from "./TopBar";
export type { TopBarProps } from "./TopBar";

export { AppLayout } from "./Layout";
export type { AppLayoutProps } from "./Layout";

export { Logo } from "./Logo";
export type { LogoProps, LogoSize } from "./Logo";

export { ToastProvider, useToast } from "./Toast";
export type {
  ToastProviderProps,
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
export type { IconComponent, IconProps, IconSize } from "./Icon";

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
export type { TimelineProps, TimelineItemProps } from "./Timeline";

/* ── Charts ────────────────────────────────────────────────── */

export { BarChart } from "./BarChart";
export type { BarChartProps, BarChartItem } from "./BarChart";

export { DonutChart } from "./DonutChart";
export type { DonutChartProps, DonutChartSegment } from "./DonutChart";

export { Sparkline } from "./Sparkline";
export type { SparklineProps } from "./Sparkline";

export { LineChart } from "./LineChart";
export type { LineChartProps, LineChartSeries, LineChartDatum } from "./LineChart";

export { ColumnChart } from "./ColumnChart";
export type { ColumnChartProps, ColumnChartSeries } from "./ColumnChart";

export { Heatmap } from "./Heatmap";
export type { HeatmapProps, HeatmapCell, HeatmapDatum } from "./Heatmap";

export { CategoryBar } from "./CategoryBar";
export type { CategoryBarProps, CategoryBarItem, CategoryBarMarker } from "./CategoryBar";

export { ChartLegend } from "./ChartLegend";
export type { ChartLegendProps, ChartLegendItem } from "./ChartLegend";

/* ── Feedback & UI ─────────────────────────────────────────── */

export { Alert } from "./Alert";
export type { AlertProps } from "./Alert";

export { Progress } from "./Progress";
export type { ProgressProps, ProgressSize } from "./Progress";

export { Switch } from "./Switch";
export type { SwitchProps } from "./Switch";

export { Skeleton } from "./Skeleton";
export type { SkeletonProps } from "./Skeleton";

export { EmptyState } from "./EmptyState";
export type { EmptyStateProps, EmptyStateSize } from "./EmptyState";

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
export type { MeterProps, MeterSize } from "./Meter";

export { Tracker } from "./Tracker";
export type { TrackerProps, TrackerItem } from "./Tracker";

export { BarList } from "./BarList";
export type { BarListProps, BarListItem } from "./BarList";

export { NumberField } from "./NumberField";
export type { NumberFieldProps, NumberFieldCurrency } from "./NumberField";

/* ── Theme ─────────────────────────────────────────────────── */

export { ThemeProvider, useTheme } from "../hooks/useTheme";
export type { Theme, ThemeContextValue, ThemeProviderProps } from "../hooks/useTheme";

/* ── Shared vocabulary ─────────────────────────────────────── */

export type { Tone, Size } from "../lib/types";
export { Slot } from "../lib/Slot";
export type { SlotProps } from "../lib/Slot";
