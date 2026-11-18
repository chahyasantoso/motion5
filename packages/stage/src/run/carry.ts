import {
  clamp,
  elapsedOf,
  mix,
  unreachable,
  type Ease,
  type Events,
  type Pose2d,
  type Time,
} from "@gerak/core";
import type { Box, Carry, CarryMode, RestReader } from "../author/layout";

interface Change {
  readonly at: number;
  readonly box: Box;
}

function mixBox(from: Box, to: Box, progress: number): Box {
  return {
    x: mix(from.x, to.x, progress),
    y: mix(from.y, to.y, progress),
    width: Math.max(0, mix(from.width, to.width, progress)),
    height: Math.max(0, mix(from.height, to.height, progress)),
  };
}

function isAbsent(box: Box): boolean {
  return !(box.width > 0) || !(box.height > 0);
}

function sameBox(a: Box, b: Box): boolean {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

function poseFor(own: Box, given: Box, target: Box, progress: number, mode: CarryMode): Pose2d {
  if (isAbsent(given) && isAbsent(target)) return {};
  const from = isAbsent(given) ? target : given;
  const to = isAbsent(target) ? from : target;
  const drawn = mixBox(from, to, progress);
  const moved: { x?: number; y?: number; scaleX?: number; scaleY?: number } = {};
  if (drawn.x !== own.x) moved.x = drawn.x - own.x;
  if (drawn.y !== own.y) moved.y = drawn.y - own.y;
  switch (mode) {
    case "keep":
      return moved;
    case "scale":
      if (isAbsent(own)) return moved;
      if (drawn.width !== own.width) moved.scaleX = drawn.width / own.width;
      if (drawn.height !== own.height) moved.scaleY = drawn.height / own.height;
      return moved;
    case "clip":
      if (drawn.width >= own.width && drawn.height >= own.height) return moved;
      return {
        ...moved,
        clipX: own.width / 2,
        clipY: own.height / 2,
        clipWidth: Math.min(drawn.width, own.width),
        clipHeight: Math.min(drawn.height, own.height),
      };
    default:
      return unreachable(mode);
  }
}

function carried(
  own: Box,
  at: (events: Events) => Box,
  events: Events,
  time: Time,
  ms: number,
  ease: Ease,
  mode: CarryMode,
): Pose2d {
  if (!(Number.isFinite(ms) && ms > 0)) throw new RangeError("carry: ms must be above 0.");
  const now = elapsedOf(time.clock);
  let happened = events.length;
  if (now !== undefined) {
    happened = 0;
    while (happened < events.length && (events[happened]?.at ?? Infinity) <= now) happened += 1;
  }
  const after = (count: number): Box =>
    at(count === events.length ? events : events.slice(0, count));
  const settled = after(happened);
  if (now === undefined) return poseFor(own, settled, settled, 1, mode);

  // Walks back only over the changes still settling at `now`.
  const changes: Change[] = [];
  let later = settled;
  let horizon = now;
  for (let count = happened; count > 0; count -= 1) {
    const event = events[count - 1];
    if (event === undefined || event.at <= horizon - ms) break;
    const before = after(count - 1);
    if (!sameBox(before, later)) {
      changes.push({ at: event.at, box: later });
      horizon = event.at;
    }
    later = before;
  }
  changes.reverse();

  const share = (t: number, change: Change): number =>
    t <= change.at ? 0 : ease(clamp((t - change.at) / ms, 0, 1));
  let from = later;
  for (let index = 0; index + 1 < changes.length; index += 1) {
    const change = changes[index];
    const next = changes[index + 1];
    if (change !== undefined && next !== undefined)
      from = mixBox(from, change.box, share(next.at, change));
  }
  const last = changes[changes.length - 1];
  if (last === undefined || now - last.at >= ms) return poseFor(own, settled, settled, 1, mode);
  return poseFor(own, from, last.box, share(now, last), mode);
}

/** The scene's `carry` for one frame: boxes come from the layout `pick` answers after each event. */
export function carryFor(
  pick: (events: Events) => string,
  layouts: Readonly<Record<string, RestReader>>,
  rest: RestReader,
  events: Events,
  time: Time,
): Carry {
  return (member, options) => {
    const at = (past: Events): Box => {
      const reader = layouts[pick(past)] ?? rest;
      return options.target === undefined ? reader.get(member) : options.target(past, reader);
    };
    const ease = options.ease ?? ((progress: number) => progress);
    return carried(rest.get(member), at, events, time, options.ms, ease, options.mode ?? "scale");
  };
}
