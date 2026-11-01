import { space } from "../tokens/tokens";

type SpaceToken = keyof typeof space;
/** Semantic step ("xs" to "xl"), a space token number (e.g. 4), or any CSS length. */
export type LayoutGap =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | SpaceToken
  | number
  | (string & {});

const SEMANTIC: Record<string, string> = {
  none: "var(--space-0)",
  xs: "var(--space-1)",
  sm: "var(--space-2)",
  md: "var(--space-4)",
  lg: "var(--space-6)",
  xl: "var(--space-8)",
};

export function resolveGap(v: LayoutGap): string {
  if (typeof v === "number") return space[v as SpaceToken] ?? `${v}px`;
  if (v in SEMANTIC) return SEMANTIC[v] as string;
  if (v in space) return space[v as SpaceToken];
  return v;
}
