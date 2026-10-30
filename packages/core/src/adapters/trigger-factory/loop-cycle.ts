import { unreachable } from "../../lang/exhaustive";

/** Options for `createLoopCycle`; phase, direction and completion are owned here, not by the driver. */
export interface LoopCycleOptions {
  readonly duration: number;
  /** Passes after the initial one. `-1` is infinite. Defaults to `0`, a single pass. */
  readonly repeat?: number;
  /** Reverse every odd cycle. Defaults to `false`. */
  readonly yoyo?: boolean;
}

interface RunningCycle {
  readonly kind: "running";
  /** Loop time in clock units, reduced to a single period while the loop is infinite. */
  readonly elapsed: number;
}

interface FinishedCycle {
  readonly kind: "finished";
  /** The terminal elapsed time, retained so a later advance can replay its endpoint. */
  readonly elapsed: number;
}

type LoopCycleState = RunningCycle | FinishedCycle;

/** The progress a single `advance` produces. */
export interface LoopCycleStep {
  readonly progress: number;
}

/** Loop phase state; `advance` consumes a clock delta and returns progress. */
export interface LoopCycle {
  readonly state: LoopCycleState;
  advance(delta: number): LoopCycleStep;
}

/** Creates loop state and cycle arithmetic; `duration` is not re-validated here. */
export function createLoopCycle(options: LoopCycleOptions): LoopCycle {
  const duration = options.duration;
  const repeat = options.repeat ?? 0;
  const yoyo = options.yoyo ?? false;
  if (!Number.isInteger(repeat) || repeat < -1)
    throw new TypeError("Loop repeat must be an integer that is -1 or 0 and above.");
  const infinite = repeat === -1;
  // `repeat` counts passes after the initial one; a finite loop runs `repeat + 1` cycles.
  const totalDuration = infinite ? Number.POSITIVE_INFINITY : (repeat + 1) * duration;
  // Yoyo repeats every two cycles; the reduction must keep both or direction is lost.
  const period = (yoyo ? 2 : 1) * duration;
  let state: LoopCycleState = { kind: "running", elapsed: 0 };
  // Half-open at start, closed at end: a boundary tick ends the cycle it completed.
  // Direction derives from cycle index; a flip flag desyncs when one tick crosses two cycles.
  function progressAt(value: number): number {
    if (value <= 0) return 0;
    const index = Math.ceil(value / duration) - 1;
    // Float guard, not validation: the trigger input range is owned by `Motion.#scheduleProgress`.
    const position = Math.max(0, Math.min(1, value / duration - index));
    return yoyo && index % 2 === 1 ? 1 - position : position;
  }
  return {
    get state() {
      return state;
    },
    advance(delta: number): LoopCycleStep {
      switch (state.kind) {
        case "finished":
          return { progress: progressAt(state.elapsed) };
        case "running": {
          let elapsed = state.elapsed + delta;
          if (elapsed >= totalDuration) {
            elapsed = totalDuration;
            state = { kind: "finished", elapsed };
          } else {
            if (infinite) {
              // Reduce infinite phase into one period each advance: past ~2^58 a delta is absorbed
              // and the loop freezes; whole-period subtraction keeps the position exact.
              const wraps = Math.ceil(elapsed / period) - 1;
              if (wraps > 0) elapsed -= wraps * period;
            }
            state = { kind: "running", elapsed };
          }
          return { progress: progressAt(state.elapsed) };
        }
        default:
          return unreachable(state);
      }
    },
  };
}
