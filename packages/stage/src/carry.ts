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

/** The pose drawing a member resting at `own` on `from` at 0 and `to` at 1; `"clip"` only crops, never
 * past `own`. Nothing is carried from or to a box with no size. */
export function carry(
  own: Box,
  given: Box,
  target: Box,
  progress: number,
  size: CarrySize = "scale",
): Pose2d {
  if (absent(given) && absent(target)) return {};
  const from = absent(given) ? target : given;
  const to = absent(target) ? from : target;
  const drawn = mix(from, to, progress);
  const moved: { x?: number; y?: number; scaleX?: number; scaleY?: number } = {};
  if (drawn.x !== own.x) moved.x = drawn.x - own.x;
  if (drawn.y !== own.y) moved.y = drawn.y - own.y;
  switch (size) {
    case "keep":
      return moved;
    case "scale": {
      if (absent(own)) return moved;
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
  let happened = events.length;
  if (now !== undefined) {
    happened = 0;
    while (happened < events.length && (events[happened]?.at ?? Infinity) <= now) happened += 1;
  }
  const after = (count: number): Box =>
    at(count === events.length ? events : events.slice(0, count));
  const settled = after(happened);
  if (now === undefined) return carry(own, settled, settled, 1, size);
  // Walks back only through changes still moving: one that came `ms` before the next has settled.
  const changes: Change[] = [];
  let later = settled;
  let horizon = now;
  for (let count = happened; count > 0; count -= 1) {
    const event = events[count - 1];
    if (event === undefined || event.at <= horizon - ms) break;
    const before = after(count - 1);
    if (!same(before, later)) {
      changes.push({ at: event.at, box: later });
      horizon = event.at;
    }
    later = before;
  }
  changes.reverse();
  const share = (t: number, change: Change): number =>
    t <= change.at ? 0 : ease(clamp01((t - change.at) / ms));
  let from = later;
  for (let index = 0; index + 1 < changes.length; index += 1) {
    const change = changes[index];
    const next = changes[index + 1];
    if (change === undefined || next === undefined) continue;
    from = mix(from, change.box, share(next.at, change));
  }
  const change = changes[changes.length - 1];
  if (change === undefined || now - change.at >= ms) return carry(own, settled, settled, 1, size);
  return carry(own, from, change.box, share(now, change), size);
}
