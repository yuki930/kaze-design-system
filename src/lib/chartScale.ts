/** Shared numeric helpers for SVG charts (no runtime dependencies). */

/** Round a raw step up to 1 / 2 / 2.5 / 5 × 10^n so axis ticks read cleanly. */
function niceStep(rawStep: number): number {
  if (rawStep <= 0 || !Number.isFinite(rawStep)) return 1;
  const exp = Math.floor(Math.log10(rawStep));
  const base = 10 ** exp;
  const fraction = rawStep / base;
  const nice =
    fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10;
  return nice * base;
}

export interface NiceScale {
  /** Lower bound of the axis (a multiple of `step`) */
  min: number;
  /** Upper bound of the axis (a multiple of `step`) */
  max: number;
  step: number;
  ticks: number[];
}

/**
 * Compute axis bounds and evenly spaced ticks that cover [min, max].
 * Zero is always included when the data does not cross it, so bars and areas
 * have a meaningful baseline.
 */
export function niceScale(dataMin: number, dataMax: number, tickCount = 5): NiceScale {
  let lo = Math.min(dataMin, 0);
  let hi = Math.max(dataMax, 0);
  if (lo === hi) {
    hi = lo + 1;
  }
  const step = niceStep((hi - lo) / Math.max(tickCount - 1, 1));
  lo = Math.floor(lo / step) * step;
  hi = Math.ceil(hi / step) * step;
  const ticks: number[] = [];
  // Guard against float drift (e.g. 0.30000000000000004)
  const decimals = Math.max(0, -Math.floor(Math.log10(step)) + 1);
  for (let v = lo; v <= hi + step / 2; v += step) {
    ticks.push(Number(v.toFixed(decimals)));
  }
  return { min: lo, max: hi, step, ticks };
}

/** Linear map from a domain to a range. */
export function linearScale(
  domain: [number, number],
  range: [number, number],
): (value: number) => number {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const span = d1 - d0 || 1;
  return (value: number) => r0 + ((value - d0) / span) * (r1 - r0);
}

/** Default compact number formatter for axis labels (1,200 / 1.2万 style is left to callers). */
export function defaultFormat(value: number): string {
  return value.toLocaleString("ja-JP");
}
