/**
 * Kaze Design System — TypeScript Token Definitions
 * CSS変数名の型安全な参照用。実際の値はtokens.cssで定義。
 */

export const color = {
  bg: "var(--color-bg)",
  bgSecondary: "var(--color-bg-secondary)",
  bgTertiary: "var(--color-bg-tertiary)",
  bgInverse: "var(--color-bg-inverse)",
  fg: "var(--color-fg)",
  fgSecondary: "var(--color-fg-secondary)",
  fgTertiary: "var(--color-fg-tertiary)",
  fgInverse: "var(--color-fg-inverse)",
  fgMuted: "var(--color-fg-muted)",
  border: "var(--color-border)",
  borderStrong: "var(--color-border-strong)",
  borderSubtle: "var(--color-border-subtle)",
  surface: "var(--color-surface)",
  surfaceHover: "var(--color-surface-hover)",
  surfaceActive: "var(--color-surface-active)",
  primary: "var(--color-primary)",
  primaryFg: "var(--color-primary-fg)",
  primaryHover: "var(--color-primary-hover)",
  positive: "var(--color-positive)",
  positiveLight: "var(--color-positive-light)",
  positiveFg: "var(--color-positive-fg)",
  negative: "var(--color-negative)",
  negativeLight: "var(--color-negative-light)",
  negativeFg: "var(--color-negative-fg)",
  warning: "var(--color-warning)",
  warningLight: "var(--color-warning-light)",
  warningFg: "var(--color-warning-fg)",
  info: "var(--color-info)",
  infoLight: "var(--color-info-light)",
  infoFg: "var(--color-info-fg)",
} as const;

export const chart = {
  emerald: "var(--chart-emerald)",
  blue: "var(--chart-blue)",
  purple: "var(--chart-purple)",
  amber: "var(--chart-amber)",
  red: "var(--chart-red)",
  cyan: "var(--chart-cyan)",
} as const;

export const space = {
  0: "var(--space-0)",
  px: "var(--space-px)",
  0.5: "var(--space-0-5)",
  1: "var(--space-1)",
  1.5: "var(--space-1-5)",
  2: "var(--space-2)",
  2.5: "var(--space-2-5)",
  3: "var(--space-3)",
  4: "var(--space-4)",
  5: "var(--space-5)",
  6: "var(--space-6)",
  8: "var(--space-8)",
  10: "var(--space-10)",
  12: "var(--space-12)",
  16: "var(--space-16)",
  20: "var(--space-20)",
  24: "var(--space-24)",
} as const;

export const radius = {
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
  "2xl": "var(--radius-2xl)",
  full: "var(--radius-full)",
} as const;

export type Theme = "light" | "dark";
