import type { Ease, Events, Pose2d } from "@gerak/core";

/** Stage size in px. */
export interface Frame {
  readonly width: number;
  readonly height: number;
}

/** Where a member rests once laid out: its centre and size in frame px. */
export interface Box {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/** Rest boxes by member or section name. */
export type Rest = Readonly<Record<string, Box>>;

/** Reads rest boxes; a name never measured answers a zero box. */
export interface RestReader {
  get(name: string): Box;
  has(name: string): boolean;
  keys(): readonly string[];
}

/** How a carried member takes the size of its target box. */
export type CarryMode = "scale" | "clip" | "keep";

/** Options of `carry`: transition length, easing, sizing, and an optional target box. */
export interface CarryOptions {
  readonly ms: number;
  readonly ease?: Ease | undefined;
  readonly mode?: CarryMode | undefined;
  readonly target?: ((events: Events, layout: RestReader) => Box) | undefined;
}

/** Moves `member` from its box in the last layout to its box in the next, over `options.ms`. */
export type Carry = (member: string, options: CarryOptions) => Pose2d;

/** Zero box answered for a name never measured. */
export const ZERO_BOX: Box = Object.freeze({ x: 0, y: 0, width: 0, height: 0 });

/** A `RestReader` over `rest`. */
export function restReader(rest: Rest = {}): RestReader {
  const keys = Object.freeze(Object.keys(rest));
  return Object.freeze({
    get: (name: string): Box => (Object.hasOwn(rest, name) ? (rest[name] ?? ZERO_BOX) : ZERO_BOX),
    has: (name: string): boolean => Object.hasOwn(rest, name),
    keys: (): readonly string[] => keys,
  });
}

/** A reader with no boxes, as headless runs have. */
export const NO_REST: RestReader = restReader();
