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
import type { Box, LayoutSpec, RestReader } from "./rest";

/** How a carried member takes its target box size: `"scale"`, `"clip"`, or `"keep"`. */
export type CarryMode = "scale" | "clip" | "keep";

/** Options for `carry(member, options)` inside a scene. */
export interface CarryOptions {
  /** Duration of each carry transition in ms; must be above 0. */
  readonly ms: number;
  /** Easing curve shaping each carry; defaults to linear. */
  readonly ease?: Ease | undefined;
  /** Sizing strategy during carry; defaults to `"scale"`. */
  readonly mode?: CarryMode | undefined;
  /** Optional target box resolver for slot reordering or cross-member carry. */
  readonly target?: ((events: Events, layout: RestReader) => Box) | undefined;
}

/** Scene helper carrying `member` across layout changes with mid-flight interruption handling. */
export type CarryFn = (member: string, options: CarryOptions) => Pose2d;

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

function isAbsentBox(box: Box): boolean {
  return !(box.width > 0) || !(box.height > 0);
}

function sameBox(a: Box, b: Box): boolean {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

function solveCarryBox(
  own: Box,
  given: Box,
  target: Box,
  progress: number,
  mode: CarryMode,
): Pose2d {
  if (isAbsentBox(given) && isAbsentBox(target)) return {};
  const from = isAbsentBox(given) ? target : given;
  const to = isAbsentBox(target) ? from : target;
  const drawn = mixBox(from, to, progress);
  const moved: { x?: number; y?: number; scaleX?: number; scaleY?: number } = {};
  if (drawn.x !== own.x) moved.x = drawn.x - own.x;
  if (drawn.y !== own.y) moved.y = drawn.y - own.y;
  switch (mode) {
    case "keep":
      return moved;
    case "scale": {
      if (isAbsentBox(own)) return moved;
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
      return unreachable(mode);
  }
}

function carryOverEvents(
  own: Box,
  at: (events: Events) => Box,
  events: Events,
  time: Time,
  ms: number,
  easeFn: Ease,
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
  if (now === undefined) return solveCarryBox(own, settled, settled, 1, mode);

  // Walk backwards only over transitions still settling at `now`.
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
    t <= change.at ? 0 : easeFn(clamp((t - change.at) / ms, 0, 1));
  let from = later;
  for (let index = 0; index + 1 < changes.length; index += 1) {
    const change = changes[index];
    const next = changes[index + 1];
    if (change === undefined || next === undefined) continue;
    from = mixBox(from, change.box, share(next.at, change));
  }
  const change = changes[changes.length - 1];
  if (change === undefined || now - change.at >= ms)
    return solveCarryBox(own, settled, settled, 1, mode);
  return solveCarryBox(own, from, change.box, share(now, change), mode);
}

/** Creates the frame-scoped `carry` function bound to `time`, `events`, and measured layout boxes. */
export function createCarry<L extends string>(
  layout: LayoutSpec<L>,
  currentRest: RestReader,
  layoutReaders: Readonly<Record<L, RestReader>>,
  events: Events,
  time: Time,
): CarryFn {
  const readerAt = (past: Events): RestReader => {
    switch (layout.kind) {
      case "single":
        return currentRest;
      case "multi":
        return layoutReaders[layout.pick(past)] ?? currentRest;
      default:
        return unreachable(layout);
    }
  };
  return (member, options) => {
    const own = currentRest.get(member);
    const easeFn = options.ease ?? ((progress: number) => progress);
    const mode = options.mode ?? "scale";
    const target = options.target;
    const at = (past: Events): Box => {
      const reader = readerAt(past);
      return target === undefined ? reader.get(member) : target(past, reader);
    };
    return carryOverEvents(own, at, events, time, options.ms, easeFn, mode);
  };
}
