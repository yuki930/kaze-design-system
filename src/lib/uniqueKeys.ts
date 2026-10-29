/**
 * Pairs each item with a React key derived from its label. Labels may repeat:
 * the first "A" keeps "A", the next becomes "A#2". Unlike an array index, a key
 * stays with its label when items are reordered.
 */
export function withUniqueKeys<T>(
  items: readonly T[],
  label: (item: T) => string,
): { key: string; item: T }[] {
  const seen = new Map<string, number>();
  return items.map((item) => {
    const text = label(item);
    const count = (seen.get(text) ?? 0) + 1;
    seen.set(text, count);
    return { key: count === 1 ? text : `${text}#${count}`, item };
  });
}
