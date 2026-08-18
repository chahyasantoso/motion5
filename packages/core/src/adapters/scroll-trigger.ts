import type { TriggerPort } from "../ports/trigger";

/**
 * A push-based scroll source. Call onProgress(0..1) whenever scroll position
 * changes. Returns an unsubscribe function.
 *
 * Intentionally minimal — works with GSAP ScrollTrigger, native scroll,
 * Lenis, Locomotive Scroll, or anything else.
 */
export interface ScrollSource {
  subscribe(onProgress: (progress: number) => void): () => void;
}

/**
 * Wraps a ScrollSource in a TriggerPort so it can feed handle.signal()
 * or any other motion5 progress consumer.
 *
 * No GSAP import here. Wire GSAP in the call site (e.g. demo/scroll-source-gsap.ts).
 * Follows the same pattern as createBrowserClock(frameSource): Clock & { dispose() }.
 *
 * This adapter owns normalization, and only because a scroll position is a measured quantity:
 * clamping 1.0000001 to 1 here is noise removal, not a fallback that hides a declared trigger
 * failure. It does not own the range rule; Motion.#scheduleProgress does. See ADR-034.
 */
export function createScrollTriggerPort(source: ScrollSource): TriggerPort & { dispose(): void } {
  const listeners = new Set<(progress: number) => void>();
  let disposed = false;

  const unsubscribeSource = source.subscribe((progress) => {
    if (disposed) return;
    // Math.max(0, Math.min(1, NaN)) is NaN, so the clamp alone is not a normalization. Forwarding
    // a non-finite push would poison Motion.position and defer the throw to the scheduler flush,
    // where it blames the Track for a value this port handed in.
    if (!Number.isFinite(progress))
      throw new TypeError("ScrollSource progress must be a finite number.");
    const clamped = Math.max(0, Math.min(1, progress));
    for (const fn of [...listeners]) fn(clamped);
  });

  return {
    subscribe(fn) {
      if (disposed) throw new Error("ScrollTriggerPort is disposed.");
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      unsubscribeSource();
      listeners.clear();
    },
  };
}
