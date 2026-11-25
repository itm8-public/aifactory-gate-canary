/** A number kept between a lower and an upper bound. Synthetic canary code. */
export function clamp(n, low, high) {
  return Math.min(Math.max(n, low), high);
}
