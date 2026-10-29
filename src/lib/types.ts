export type ClassValue = string | undefined | null | false;

/** Semantic colour shared by status-bearing components (Badge, Alert, Toast, Progress, Meter, Timeline, Tracker) */
export type Tone = "default" | "positive" | "negative" | "warning" | "info";

/** Size scale shared by every component with a `size` prop; each component accepts a subset of it */
export type Size = "xs" | "sm" | "md" | "lg" | "xl";
