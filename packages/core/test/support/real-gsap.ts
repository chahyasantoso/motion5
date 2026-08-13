import { gsap } from "gsap";
import type { Interpolator } from "../../src/ports/interpolator";
import {
  createGsapInterpolator,
  type GsapTimelineLike,
} from "../../src/adapters/interpolator/gsap";

/** What the adapter asked real GSAP for, plus real GSAP's own answers about it. */
export interface CreatedTimeline {
  /** Exactly the config the adapter passed to `gsap.timeline`, untouched by this seam. */
  readonly config: unknown;
  /** Real GSAP's view of whether the adapter's timeline is paused. */
  paused(): boolean;
  /** Real GSAP's own duration for the adapter's timeline. */
  duration(): number;
  /**
   * How many tweens the adapter scheduled. Lets a test prove that a scheduling change is
   * conditional, instead of trusting that it only fires when it should.
   */
  tweenCount(): number;
}

export interface RealGsapSeam {
  readonly interpolator: Interpolator;
  /** Every timeline the adapter constructed, in creation order. */
  readonly created: readonly CreatedTimeline[];
}

/**
 * A pass-through seam onto the real GSAP namespace, for tests that must observe the adapter
 * rather than a stand-in for it.
 *
 * It exists only to observe, never to correct. The timeline config and every tween position are
 * forwarded verbatim, so an adapter defect reaches real GSAP and fails an assertion instead of
 * being silently repaired by the fixture. The two `createRealGsapInterpolator` helpers this
 * replaces did both kinds of repair: they hardcoded `gsap.timeline({ paused: true })`, hiding
 * whether the adapter paused its own timeline (P0-2), and they called `real.to(target, vars)`
 * with no third argument, so the absolute stop positions the adapter passes were dropped and
 * every segment sequential-appended (P0-3).
 */
export function createRealGsapSeam(): RealGsapSeam {
  const created: CreatedTimeline[] = [];
  const interpolator = createGsapInterpolator({
    timeline(config): GsapTimelineLike {
      // The port types the config as `unknown` on purpose; narrowing it here would let the seam
      // decide what GSAP receives, which is the behavior under test.
      const real = gsap.timeline(config as Parameters<typeof gsap.timeline>[0]);
      let tweens = 0;
      created.push({
        config,
        paused: () => real.paused(),
        duration: () => real.duration(),
        tweenCount: () => tweens,
      });
      const timeline: GsapTimelineLike = {
        duration: () => real.duration(),
        progress,
        to(target, vars, position) {
          tweens += 1;
          real.to(target, vars, position);
          return timeline;
        },
        kill() {
          real.kill();
        },
      };
      function progress(): number;
      function progress(value: number): GsapTimelineLike;
      function progress(value?: number): number | GsapTimelineLike {
        if (value === undefined) return real.progress();
        real.progress(value);
        return timeline;
      }
      return timeline;
    },
  });
  return { interpolator, created };
}

/** Reads a numeric key off an adapter-owned proxy state without widening the port type. */
export function readNumber(state: Readonly<Record<string, unknown>>, key: string): number {
  const value = state[key];
  return typeof value === "number" ? value : Number.NaN;
}
