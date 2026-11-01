/** Returns the x axis label of a row as one or more lines; a string is a single line. */
export type ChartIndexLabel<Row> = (row: Row, index: number) => string | string[];

/** Height of each extra x axis label line in px. */
export const LABEL_LINE_HEIGHT = 14;

export function labelLines<Row>(
  row: Row,
  i: number,
  fallback: string,
  fn?: ChartIndexLabel<Row>,
): string[] {
  const v = fn ? fn(row, i) : fallback;
  return Array.isArray(v) ? v : [v];
}
