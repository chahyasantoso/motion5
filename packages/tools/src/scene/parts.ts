/** The groups the parts list sorts its building blocks into, in print order. */
export const PART_GROUPS = [
  "time",
  "eases",
  "blends",
  "paths",
  "follow-through",
  "events",
  "randomness",
] as const;

export type PartGroup = (typeof PART_GROUPS)[number];

/** One building block of `@gerak/moves`: its export name, its call shape and what it is for. */
export interface MovePart {
  readonly name: string;
  readonly group: PartGroup;
  readonly call: string;
  readonly use: string;
}

/** Every function a move is built from that is not itself a move, each named once. */
export const MOVE_PARTS: readonly MovePart[] = [
  {
    name: "span",
    group: "time",
    call: "span(fromMs, toMs).of(time, ease?)",
    use: "a move's time inside a stretch of ms; .at(share) gives the ms a share falls on",
  },
  {
    name: "sequence",
    group: "time",
    call: "sequence(time, [[span, (t) => answer], ...])",
    use: "one target through several phases, each holding at its end until the next starts",
  },
  {
    name: "reversed",
    group: "time",
    call: "reversed(time)",
    use: "a time running backwards, so any enter move plays as an exit",
  },
  {
    name: "repeated",
    group: "time",
    call: "repeated(time, count)",
    use: "a time that runs its progress count times over",
  },
  {
    name: "lanes",
    group: "time",
    call: "lanes(lengths, stagger, { from, spacing })",
    use: "staggered start times for a row of targets, letters or items",
  },
  {
    name: "lane",
    group: "time",
    call: "lane(time, index, lanes)",
    use: "one target's time inside its lane",
  },
  {
    name: "timeAt",
    group: "time",
    call: "timeAt(time, ms)",
    use: "the same time moved to another ms, to read a signal a moment earlier or later",
  },
  {
    name: "elapsedOf",
    group: "time",
    call: "elapsedOf(time.clock)",
    use: "the ms on a clock, or undefined for an untimed one",
  },
  {
    name: "ease",
    group: "eases",
    call: "ease.cubicOut(share)",
    use: "the named curves: linear, sine, quad, cubic, quart, expo, back, elastic, bounce",
  },
  {
    name: "backEase",
    group: "eases",
    call: "backEase({ amount, direction })",
    use: "a curve that pulls back before it goes, overshoots as it ends, or both",
  },
  {
    name: "springEase",
    group: "eases",
    call: "springEase({ stiffness, damping })",
    use: "a spring from 0 settling on 1, fitted to a span, for values that ring",
  },
  {
    name: "mix",
    group: "blends",
    call: "mix(a, b, share)",
    use: "a number between two, for a one-off value",
  },
  {
    name: "mixPoint",
    group: "blends",
    call: "mixPoint(a, b, share)",
    use: "a point between two",
  },
  {
    name: "mixAngle",
    group: "blends",
    call: "mixAngle(a, b, share)",
    use: "an angle between two, the short way round",
  },
  {
    name: "mixPose",
    group: "blends",
    call: "mixPose(a, b, share)",
    use: "a pose between two, a missing field at its rest",
  },
  {
    name: "keyframes",
    group: "blends",
    call: "keyframes(start, [{ at, to, ease }], mix)",
    use: "a one-off value through keys in ms, then holding",
  },
  {
    name: "combine",
    group: "blends",
    call: "combine([pose, ...])",
    use: "several poses on one target as one: offsets add, scales multiply",
  },
  {
    name: "squashed",
    group: "blends",
    call: "squashed(squash, weight, anchor?)",
    use: "a squash pose against one side, for a landing or an impact",
  },
  {
    name: "mixPose3d",
    group: "blends",
    call: "mixPose3d(a, b, share)",
    use: "a 3D pose between two, turns along the short arc",
  },
  {
    name: "mixPoint3d",
    group: "blends",
    call: "mixPoint3d(a, b, share)",
    use: "a 3D point between two",
  },
  {
    name: "combine3d",
    group: "blends",
    call: "combine3d([pose, ...])",
    use: "several 3D poses on one target as one",
  },
  {
    name: "squashed3d",
    group: "blends",
    call: "squashed3d(squash, weight, axis?)",
    use: "a 3D squash along one axis, volume kept",
  },
  {
    name: "lift2d",
    group: "blends",
    call: "lift2d(pose, { unitsPerPx })",
    use: "a 2D pose on the 3D plane, so any 2D move reaches 3D",
  },
  {
    name: "toCubics",
    group: "paths",
    call: "toCubics(anchors)",
    use: "anchors as path segments, for along or applyPath",
  },
  {
    name: "along",
    group: "paths",
    call: "along(cubics, share, { turn })",
    use: "the pose a share of the way along a path, turned to its heading if asked",
  },
  {
    name: "toCubics3d",
    group: "paths",
    call: "toCubics3d(anchors)",
    use: "3D anchors as path segments",
  },
  {
    name: "along3d",
    group: "paths",
    call: "along3d(cubics, share, { face })",
    use: "the point a share of the way along a 3D path, facing along it if asked",
  },
  {
    name: "trail",
    group: "follow-through",
    call: "trail((t) => signal, { stiffness, damping })(time, events)",
    use: "a value chasing a signal on a spring: drag, a hanging letter, follow-through",
  },
  {
    name: "trailTurn",
    group: "follow-through",
    call: "trailTurn((t) => pose3d, { stiffness, damping })(time, events)",
    use: "a 3D turn chasing a signal's turn on a spring, the short way round",
  },
  {
    name: "spring",
    group: "follow-through",
    call: "spring(offset, speed, seconds, { stiffness, damping })",
    use: "where a spring is after some seconds, for a settle written by hand",
  },
  {
    name: "velocity",
    group: "follow-through",
    call: "velocity(signal, time, events)",
    use: "the px per second a pose signal moves at, to stretch or lean by speed",
  },
  {
    name: "smear",
    group: "follow-through",
    call: "smear({ vx, vy }, { stretch, max })",
    use: "a body stretched along its travel, area kept, and its heading",
  },
  {
    name: "velocity3d",
    group: "follow-through",
    call: "velocity3d(signal, time, events)",
    use: "the units per second a 3D pose signal moves at",
  },
  {
    name: "smear3d",
    group: "follow-through",
    call: "smear3d({ vx, vy, vz }, { stretch, max })",
    use: "a 3D body stretched along its travel, volume kept",
  },
  {
    name: "react",
    group: "events",
    call: "react({ on, target, kind, amplitude, decay })(time, events)",
    use: "a damped recoil, wobble, flash or shake after each named event",
  },
  {
    name: "follow",
    group: "events",
    call: "follow({ start, on, target })(time, events)",
    use: "a spring each named event sends towards its value, turning back with no jump",
  },
  {
    name: "mergeEvents",
    group: "events",
    call: "mergeEvents(...lists)",
    use: "several event lists as one, oldest first",
  },
  {
    name: "seeded",
    group: "randomness",
    call: "seeded(seed)()",
    use: "repeatable random numbers from 0 up to 1, never Math.random()",
  },
];

/** The parts as printed lines: a heading per group, then one line per part. */
export function formatParts(parts: readonly MovePart[] = MOVE_PARTS): readonly string[] {
  return PART_GROUPS.flatMap((group) => {
    const inGroup = parts.filter((part) => part.group === group);
    return inGroup.length === 0
      ? []
      : [`${group}:`, ...inGroup.map(({ call, use }) => `  ${call}  ${use}`)];
  });
}
