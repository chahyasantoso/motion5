import type { Ease, Events, Pose2d } from "@gerak/core";

/** Where a member rests once laid out: its centre and size in frame px. */
export interface Box {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/** Rest boxes by member name. */
export type Rest = Readonly<Record<string, Box>>;

/** Measured world-unit bounding box size of a bound 3D object at rest. */
export interface ObjectBounds3d {
  readonly width: number;
  readonly height: number;
  readonly depth: number;
}

/** Measured rest sizes of 3D object members by name. */
export type ObjectRest = Readonly<Record<string, ObjectBounds3d>>;

/** Reads rest boxes and 3D object sizes; an unmeasured box answers a zero box. */
export interface RestReader {
  get(name: string): Box;
  has(name: string): boolean;
  keys(): readonly string[];
  object(name: string): ObjectBounds3d | undefined;
}

/** What a mount measured at `at` ms on its clock. */
export interface RestAt {
  readonly at: number;
  readonly rest: RestReader;
}

/** How a carried member takes the size of its target box. */
export type CarryMode = "scale" | "clip" | "keep";

/** Options of `carry`: transition length, easing, sizing, and an optional target box. */
export interface CarryOptions {
  readonly ms: number;
  readonly ease?: Ease | undefined;
  readonly mode?: CarryMode | undefined;
  readonly target?: ((events: Events, rest: RestReader) => Box) | undefined;
}

/** Moves `member` from its old rest box to its new one after a re-measure, over `options.ms`. */
export type Carry = (member: string, options: CarryOptions) => Pose2d;

/** Zero box answered for a name never measured. */
export const ZERO_BOX: Box = Object.freeze({ x: 0, y: 0, width: 0, height: 0 });

/** A `RestReader` over `rest` and optional 3D `objects`. */
export function restReader(rest: Rest = {}, objects: ObjectRest = {}): RestReader {
  const keys = Object.freeze(Object.keys(rest));
  return Object.freeze({
    get: (name: string): Box => (Object.hasOwn(rest, name) ? (rest[name] ?? ZERO_BOX) : ZERO_BOX),
    has: (name: string): boolean => Object.hasOwn(rest, name),
    keys: (): readonly string[] => keys,
    object: (name: string): ObjectBounds3d | undefined =>
      Object.hasOwn(objects, name) ? objects[name] : undefined,
  });
}

/** A reader with no boxes, as headless runs have. */
export const NO_REST: RestReader = restReader();
