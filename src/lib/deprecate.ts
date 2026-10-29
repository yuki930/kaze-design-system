/**
 * Deprecation warnings for props that still work but are scheduled for removal.
 * Each key warns once per session and never in production builds (bundlers
 * replace `process.env.NODE_ENV`; plain ESM without a bundler keeps the warning).
 */
const warned = new Set<string>();

// Only `process.env.NODE_ENV` is read, and bundlers replace it literally. Declared here so
// the library does not depend on @types/node (TypeScript 6 no longer loads it implicitly).
declare const process: { env: { NODE_ENV?: string } };

function isProduction(): boolean {
  try {
    return typeof process !== "undefined" && process.env.NODE_ENV === "production";
  } catch {
    return false;
  }
}

export function warnDeprecated(key: string, message: string): void {
  if (isProduction() || warned.has(key)) return;
  warned.add(key);
  console.warn(`[kaze] ${message}`);
}

/**
 * Resolves a renamed prop: the new name wins, the old name still works but
 * warns once. Returns undefined when neither is set so the caller applies its default.
 */
export function renamedProp<T>(
  component: string,
  oldName: string,
  newName: string,
  oldValue: T | undefined,
  newValue: T | undefined,
): T | undefined {
  if (newValue !== undefined) return newValue;
  if (oldValue === undefined) return undefined;
  warnDeprecated(
    `${component}.${oldName}`,
    `${component} の \`${oldName}\` は \`${newName}\` に改名しました。次のマイナーバージョンで削除します`,
  );
  return oldValue;
}

/** Test helper: forget which keys have already warned. */
export function resetDeprecationWarnings(): void {
  warned.clear();
}
