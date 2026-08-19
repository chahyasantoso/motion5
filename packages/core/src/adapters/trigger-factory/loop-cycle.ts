/**
 * Loop state and cycle arithmetic for a time-driven Motion, in one place.
 *
 * `createTimeDriver` owns the emission channel and disposal. Every question about which cycle a
 * Motion is in, which direction that cycle runs, and whether the loop has finished is answered
 * here and nowhere else, so no second object can hold a different opinion about the phase.
 * Issue #156 and ADR-040.
 *
 * `duration` is not re-validated. `validateMotionTrigger` rejects a bad authored duration and
 * `createTimeDriver` rejects a bad argument before this function runs, so a third check would be a
 * third owner of one rule. `repeat` is guarded because its domain belongs to this module, the same
 * way `Track.setProgress` guards its own progress without owning the trigger input rule.
 *
 * `delta` is deliberately not guarded. `Clock` owns the delta contract and
 * `Motion.#scheduleProgress` rejects a non-finite progress at the emit site, which is where the
 * pre-loop driver already left it. See ADR-037.
 */
export interface LoopCycleOptions {
  readonly duration: number;
  /** Passes after the initial one. `-1` is infinite. Defaults to `0`, a single pass. */
  readonly repeat?: number;
  /** Reverse every odd cycle. Defaults to `false`. */
  readonly yoyo?: boolean;
}

export interface LoopCycleStep {
  readonly progress: number;
  readonly completed: boolean;
}

export interface LoopCycle {
  readonly completed: boolean;
  /** Loop time in clock units, reduced to a single period while the loop is infinite. */
  readonly elapsed: number;
  advance(delta: number): LoopCycleStep;
}

export function createLoopCycle(options: LoopCycleOptions): LoopCycle {
  const duration = options.duration;
  const repeat = options.repeat ?? 0;
  const yoyo = options.yoyo ?? false;
  if (!Number.isInteger(repeat) || repeat < -1)
    throw new TypeError("Loop repeat must be an integer that is -1 or 0 and above.");
  const infinite = repeat === -1;
  // `repeat` counts the passes after the initial one, so the initial pass is never one of them and
  // a finite loop runs `repeat + 1` cycles. Matching the interpolation engine this project keeps
  // as its behavioral oracle is what lets a migrated v4 document keep its timing. See ADR-040.
  const totalDuration = infinite ? Number.POSITIVE_INFINITY : (repeat + 1) * duration;
  // A yoyo repeats itself every two cycles rather than every one, so the reduction below has to
  // keep both of them or it would drop the direction.
  const period = (yoyo ? 2 : 1) * duration;
  let elapsed = 0;
  let completed = false;
  /**
   * Cycles are half-open at the start and closed at the end: a tick landing exactly on a boundary
   * reads as the end of the cycle it completed, not the start of the next one.
   *
   * The other convention, a floor index with a position in `[0, 1)`, never emits `1` for any cycle
   * but the last, so a repeating fade would visibly skip its own end state on every pass. Emitting
   * both the endpoint and the wrapped value on one tick is not an option either: `Motion` coalesces
   * to the latest progress per scheduler pass, so the endpoint would be queued and then discarded,
   * which is a frame the runtime would claim to have applied and did not.
   *
   * Direction is derived from the cycle index rather than from a flag that flips on each wrap. A
   * flag desynchronizes the first time one tick crosses two cycles; an index cannot.
   */
  function progressAt(value: number): number {
    if (value <= 0) return 0;
    const index = Math.ceil(value / duration) - 1;
    // Internal arithmetic, so this clamp is a floating-point guard rather than input validation.
    // The trigger input range still has one owner in `Motion.#scheduleProgress`. See ADR-037.
    const position = Math.max(0, Math.min(1, value / duration - index));
    return yoyo && index % 2 === 1 ? 1 - position : position;
  }
  return {
    get completed() {
      return completed;
    },
    get elapsed() {
      return elapsed;
    },
    advance(delta: number): LoopCycleStep {
      if (completed) return { progress: progressAt(elapsed), completed };
      elapsed += delta;
      if (elapsed >= totalDuration) {
        elapsed = totalDuration;
        completed = true;
      } else if (infinite) {
        // An infinite loop must not accumulate unbounded loop time. Past roughly 2^58 clock units
        // a further delta is absorbed by the float and the loop freezes on one value forever, so
        // the phase is reduced into a single period on every advance instead. The reduction is
        // exact: subtracting whole periods cannot change the position inside the current one.
        const wraps = Math.ceil(elapsed / period) - 1;
        if (wraps > 0) elapsed -= wraps * period;
      }
      return { progress: progressAt(elapsed), completed };
    },
  };
}
