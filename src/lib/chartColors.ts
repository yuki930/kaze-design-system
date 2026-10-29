/**
 * Default series colours for the charts, in order. They follow the --chart-1..12
 * tokens, which are ordered to stay distinguishable for colour-vision deficiencies
 * and keep 3:1 against light and dark surfaces (see tokens/base.tokens.json).
 */
export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
  "var(--chart-9)",
  "var(--chart-10)",
  "var(--chart-11)",
  "var(--chart-12)",
] as const;
