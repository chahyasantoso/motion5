import type { Ease } from "../parts/laws/ease";
import { seeded } from "../parts/randomness/random";
import { UNTIMED, type Time } from "../parts/time/time";
import { unreachable } from "../unreachable";

/** Which lanes start first: from one end, from the centre out, from both edges in, or shuffled by a seed. */
export type LaneOrigin = "start" | "end" | "center" | "edges" | { readonly seed: number };

/** Settings of `lanes`: `from` picks which start first (default `"start"`); `spacing`, an ease, bends
 * the start times (default even). */
export interface LanesOptions {
  /** Which lanes start first; default `"start"`. */
  readonly from?: LaneOrigin;
  /** Bends the start times across the whole stagger, keeping the first and last; default even. */
  readonly spacing?: Ease;
}

/** Lanes started `stagger` lane-lengths apart in the order `from` gives; `span` reaches the last finish. */
export interface Lanes {
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

/** Lanes of these relative lengths, each starting `stagger` after the one before it in the order `from` gives. */
export function lanes(
  lengths: readonly number[],
  stagger: number,
  options: LanesOptions = {},
): Lanes {
  const places = ranks(lengths.length, options.from ?? "start");
  const last = Math.max(0, ...places);
  const spacing = options.spacing;
  const starts = places.map((place) =>
    spacing === undefined || last === 0 ? place * stagger : spacing(place / last) * last * stagger,
  );
  const span = lengths.reduce(
    (latest, length, index) => Math.max(latest, (starts[index] ?? 0) + length),
    0,
  );
  return { lengths, stagger, starts, span };
}

/** Lane `index` at overall `position`; with `durationMs` its clock is that lane's own window, in ms. */
export function laneTime(position: number, index: number, of: Lanes, durationMs?: number): Time {
  const length = of.lengths[index] ?? 0;
  const staggered = of.stagger !== 0 && length > 0;
  const progress = staggered
    ? Math.max(0, Math.min(1, (position * of.span - (of.starts[index] ?? 0)) / length))
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
