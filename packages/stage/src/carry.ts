import { elapsedOf, type Ease, type Events, type Pose2d, type Time } from "@gerak/moves";
import type { Box } from "./rest";
import { unreachable } from "./unreachable";

/** How a carried member takes a box's size: `"scale"` stretches it, `"keep"` leaves it, `"clip"`
 * leaves it and hides all outside the box. */
export type CarrySize = "scale" | "clip" | "keep";

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function lerp(from: number, to: number, progress: number): number {
  return from + (to - from) * progress;
}

function mix(from: Box, to: Box, progress: number): Box {
  return {
    x: lerp(from.x, to.x, progress),
    y: lerp(from.y, to.y, progress),
    width: Math.max(0, lerp(from.width, to.width, progress)),
    height: Math.max(0, lerp(from.height, to.height, progress)),
  };
}

function absent(box: Box): boolean {
  return !(box.width > 0) || !(box.height > 0);
}

function same(a: Box, b: Box): boolean {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

/** The pose that draws a member resting at `own` on `from` at 0 and on `to` at 1. `"clip"` only
 * crops, never drawing larger than `own`. An absent box throws a `RangeError` (not for `"keep"`). */
export function carry(
  own: Box,
  from: Box,
  to: Box,
  progress: number,
  size: CarrySize = "scale",
): Pose2d {
  switch (size) {
    case "scale":
    case "clip":
      if (absent(from))
        throw new RangeError("carry: `from` has no box; the member is absent from that layout.");
      if (absent(to))
        throw new RangeError("carry: `to` has no box; the member is absent from that layout.");
      break;
    case "keep":
      break;
    default:
      return unreachable(size);
  }
  const drawn = mix(from, to, progress);
  const moved: { x?: number; y?: number; scaleX?: number; scaleY?: number } = {};
  if (drawn.x !== own.x) moved.x = drawn.x - own.x;
  if (drawn.y !== own.y) moved.y = drawn.y - own.y;
  switch (size) {
    case "keep":
      return moved;
    case "scale": {
      if (!(own.width > 0) || !(own.height > 0))
        throw new RangeError("carry: `own` has no box; the member cannot be scaled to another.");
      if (drawn.width !== own.width) moved.scaleX = drawn.width / own.width;
      if (drawn.height !== own.height) moved.scaleY = drawn.height / own.height;
      return moved;
    }
    case "clip": {
      if (drawn.width >= own.width && drawn.height >= own.height) return moved;
      return {
        ...moved,
        clipX: own.width / 2,
        clipY: own.height / 2,
        clipWidth: Math.min(drawn.width, own.width),
        clipHeight: Math.min(drawn.height, own.height),
      };
    }
    default:
      return unreachable(size);
  }
}

/** What `carried` is given: where the member rests now, and where `at` says it belongs after the events. */
export interface CarriedOptions {
  /** Where the member rests now. */
  readonly own: Box;
  /** Where the member should be after these events. */
  readonly at: (events: Events) => Box;
  readonly events: Events;
  readonly time: Time;
  /** The length of each carry in ms; above 0. */
  readonly ms: number;
  /** Shapes each carry; default linear. */
  readonly ease?: Ease;
  /** How the member takes the size of the box; default `"scale"`. */
  readonly size?: CarrySize;
}

interface Change {
  readonly at: number;
  readonly box: Box;
}

/** The pose of a member carried to the box `at` names after each event, over `ms` each, setting off
 * from where it is drawn; with no clock it has arrived. */
export function carried(options: CarriedOptions): Pose2d {
  const { own, at, events, time, ms } = options;
  const ease = options.ease ?? ((progress: number) => progress);
  if (!(ms > 0)) throw new RangeError("carried: ms must be above 0.");
  const size = options.size ?? "scale";
  const now = elapsedOf(time.clock);
  const changes: Change[] = [];
  let box = at([]);
  const first = box;
  for (let i = 0; i < events.length; i += 1) {
    const event = events[i];
    if (event === undefined) continue;
    if (now !== undefined && event.at > now) break;
    const next = at(events.slice(0, i + 1));
    if (!same(next, box)) changes.push({ at: event.at, box: next });
    box = next;
  }
  const drawnAt = (t: number, last: number): Box => {
    const change = changes[last];
    if (change === undefined) return first;
    if (t - change.at >= ms) return change.box;
    return mix(drawnAt(change.at, last - 1), change.box, ease(clamp01((t - change.at) / ms)));
  };
  const last = changes.length - 1;
  const change = changes[last];
  if (change === undefined || now === undefined || now - change.at >= ms)
    return carry(own, box, box, 1, size);
  const p = ease(clamp01((now - change.at) / ms));
  return carry(own, drawnAt(change.at, last - 1), change.box, p, size);
}
