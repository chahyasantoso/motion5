import type { Ease } from "../ease/ease";
import { seeded } from "../utility/random";
import { UNTIMED, type Time } from "./time";
import type { Timing } from "./timing";
import { unreachable } from "../utility/unreachable";

/** Which lanes start first: from one end, from the centre out, from both edges in, or shuffled by a seed. */
export type LaneOrigin = "start" | "end" | "center" | "edges" | { readonly seed: number };

/** Settings of `lanes`: `from` or `by` picks which start first (default `"start"`); `spacing`, an ease,
 * bends the start times (default even). */
export interface LanesOptions {
  /** Which lanes start first; default `"start"`. Not with `by`. */
  readonly from?: LaneOrigin;
  /** One value per lane: lanes start in ascending order of it, equal values together. Not with `from`. */
  readonly by?: readonly number[];
  /** Bends the start times across the whole stagger, keeping the first and last; default even. */
  readonly spacing?: Ease;
}

/** Lanes started `stagger` lane-lengths apart in the order `from` or `by` gives; `span` reaches the last
 * finish; `.of(time, index)` is lane `index` run inside `time`. */
export interface Lanes extends Timing<[index: number]> {
  readonly lengths: readonly number[];
  readonly stagger: number;
  /** Each lane's start, in lane lengths. */
  readonly starts: readonly number[];
  readonly span: number;
}

/** Each lane's place in the order, the first at 0; lanes the same distance from the origin share a place. */
function ranks(count: number, from: LaneOrigin): readonly number[] {
  const middle = (count - 1) / 2;
  const indices = Array.from({ length: count }, (_, index) => index);
  if (typeof from === "object") {
    const random = seeded(from.seed);
    const order = [...indices];
    for (let i = order.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [order[i], order[j]] = [order[j] ?? i, order[i] ?? j];
    }
    const places = new Array<number>(count).fill(0);
    order.forEach((index, place) => (places[index] = place));
    return places;
  }
  switch (from) {
    case "start":
      return indices;
    case "end":
      return indices.map((index) => count - 1 - index);
    case "center": {
      const distances = indices.map((index) => Math.abs(index - middle));
      const nearest = Math.min(...distances);
      return distances.map((distance) => distance - nearest);
    }
    case "edges":
      return indices.map((index) => Math.floor(middle - Math.abs(index - middle) + 1e-9));
    default:
      return unreachable(from);
  }
}

/** Each lane's place when ordered by `values`, lowest first; equal values share a place. */
function ranksBy(values: readonly number[], count: number): readonly number[] {
  if (values.length !== count)
    throw new RangeError(`lanes: \`by\` has ${values.length} values for ${count} lanes.`);
  if (values.some((value) => !Number.isFinite(value)))
    throw new RangeError("lanes: every `by` value is a finite number.");
  const distinct = [...new Set(values)].sort((a, b) => a - b);
  return values.map((value) => distinct.indexOf(value));
}

/** Lane `index` at overall `position`; with `durationMs` its clock is that lane's own window, in ms. */
function laneTime(position: number, index: number, of: Lanes, durationMs?: number): Time {
  const length = of.lengths[index] ?? 0;
  const staggered = of.stagger !== 0 && length > 0;
  const progress = staggered
    ? Math.max(0, Math.min(1, (position * of.span - (of.starts[index] ?? 0)) / length))
    : position;
  if (durationMs === undefined) return { progress, clock: UNTIMED };
  const lengthMs = staggered ? (durationMs * length) / of.span : durationMs;
  return { progress, clock: { kind: "timed", elapsed: progress * lengthMs, length: lengthMs } };
}

/** Lanes of these relative lengths, each starting `stagger` after the last in the order `from` or `by`
 * gives; `.of(time, index)` is lane `index` inside `time`, a timed clock split among lanes. */
export function lanes(
  lengths: readonly number[],
  stagger: number,
  options: LanesOptions = {},
): Lanes {
  if (options.by !== undefined && options.from !== undefined)
    throw new RangeError("lanes: give `from` or `by`, not both.");
  const places =
    options.by === undefined
      ? ranks(lengths.length, options.from ?? "start")
      : ranksBy(options.by, lengths.length);
  const last = Math.max(0, ...places);
  const spacing = options.spacing;
  const starts = places.map((place) =>
    spacing === undefined || last === 0 ? place * stagger : spacing(place / last) * last * stagger,
  );
  const span = lengths.reduce(
    (latest, length, index) => Math.max(latest, (starts[index] ?? 0) + length),
    0,
  );
  const made: Lanes = {
    lengths,
    stagger,
    starts,
    span,
    of(time: Time, index: number): Time {
      const clock = time.clock;
      switch (clock.kind) {
        case "timed":
          return laneTime(time.progress, index, made, clock.length);
        case "untimed":
        case "live":
          return laneTime(time.progress, index, made);
        default:
          return unreachable(clock);
      }
    },
  };
  return Object.freeze(made);
}
