import { UNTIMED, unreachable, type Time } from "./time";

/** Lanes started `stagger` lane-lengths apart; `span` reaches the last finish. */
export interface Lanes {
  readonly lengths: readonly number[];
  readonly stagger: number;
  readonly span: number;
}

/** Lanes of these relative lengths, each starting `stagger` after the one before it. */
export function lanes(lengths: readonly number[], stagger: number): Lanes {
  const span = lengths.reduce(
    (latest, length, index) => Math.max(latest, index * stagger + length),
    0,
  );
  return { lengths, stagger, span };
}

/** Lane `index` at overall `position`; with `durationMs` its clock is that lane's own window, in ms. */
export function laneTime(position: number, index: number, of: Lanes, durationMs?: number): Time {
  const length = of.lengths[index] ?? 0;
  const staggered = of.stagger !== 0 && length > 0;
  const progress = staggered
    ? Math.max(0, Math.min(1, (position * of.span - index * of.stagger) / length))
    : position;
  if (durationMs === undefined) return { progress, clock: UNTIMED };
  const lengthMs = staggered ? (durationMs * length) / of.span : durationMs;
  return { progress, clock: { kind: "timed", elapsed: progress * lengthMs, length: lengthMs } };
}

/** Lane `index` run inside `time`: its progress, and a timed clock split among the lanes. */
export function lane(time: Time, index: number, of: Lanes): Time {
  const clock = time.clock;
  switch (clock.kind) {
    case "timed":
      return laneTime(time.progress, index, of, clock.length);
    case "untimed":
    case "live":
      return laneTime(time.progress, index, of);
    default:
      return unreachable(clock);
  }
}
